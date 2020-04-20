import { AssetKey, HistAssetValues, getCurrencyKey } from './asset';
import { Settings } from './settings';
import {
    getDateStr,
    RArray,
    DateStr,
    dictFromArray,
    Dict,
    filterUnique,
    mapDict,
    justADate,
    getDailyDates,
    getOrCreateSheet,
} from './utils';

interface AssetMod {
    readonly code: string;
    readonly conversionFn: (v: number) => number;
}

const getAssetMod = (asset: string): AssetMod => {
    const [exchange, ticker] = asset.split(':');
    // edge case for GBX, which google finance doesn't handle
    if (exchange === 'CURRENCY' && ticker.startsWith('GBX'))
        return {
            code: 'CURRENCY:GBP' + ticker.substring(3),
            conversionFn: (v) => v / 100,
        };

    return { code: asset, conversionFn: (v) => v };
};

const writeHistPriceFormulas = (assets: RArray<AssetKey>, settings: Settings) => {
    const sheet = getOrCreateSheet('Raw Hist Prices');
    sheet.clear();

    const assetMods = assets.map(getAssetMod);

    // write historial prices
    assetMods.forEach((assetMod, i) => {
        sheet
            .getRange(1, i * 2 + 1)
            .setFormula(
                '=GOOGLEFINANCE(' +
                    `"${assetMod.code}", ` +
                    '"price", ' +
                    `"${getDateStr(settings.startDate)}", ` +
                    `"${getDateStr(settings.endDate)}", ` +
                    `"${settings.interval}")`
            );
    });
    SpreadsheetApp.flush();

    const sheetValues = sheet.getRange(2, 1, sheet.getLastRow() + 1, assets.length * 2).getValues();

    // append current prices at the end of each column
    assetMods.forEach((assetMod, i) => {
        const lastRow = sheetValues.findIndex((row) => row[i * 2] === '') - 1;
        const lastDate = justADate(sheetValues[lastRow][i * 2]);

        if (lastDate.getTime() !== settings.endDate.getTime()) {
            sheet.getRange(lastRow + 3, i * 2 + 1).setValue(settings.endDate);
            sheet.getRange(lastRow + 3, i * 2 + 2).setFormula(
                '=GOOGLEFINANCE(' +
                    `"${assetMod.code}"` +
                    // the 'price' attribute must be omitted for currencies in this case
                    (assetMod.code.startsWith('CURRENCY') ? ')' : ', "price")')
            );
        }
    });
    SpreadsheetApp.flush();
};

const readHistPrices = (assets: RArray<AssetKey>, settings: Settings): HistAssetValues => {
    writeHistPriceFormulas(assets, settings);

    const sheet = getOrCreateSheet('Raw Hist Prices');
    const sheetValues = sheet.getRange(2, 1, sheet.getLastRow() + 1, assets.length * 2).getValues();
    const dates = getDailyDates(settings.startDate, settings.endDate);

    return assets.reduce(
        (assetAcc, asset, i) => {
            const assetMod = getAssetMod(asset);
            let row = 0;
            let prevPrice = assetMod.conversionFn(sheetValues[0][i * 2 + 1]);
            const prices = dates.map((date) => {
                const sheetDate = justADate(sheetValues[row][i * 2]);
                const rawSheetPrice = sheetValues[row][i * 2 + 1];

                if (rawSheetPrice !== '' && date.getTime() === sheetDate.getTime()) {
                    row += 1;
                    prevPrice = assetMod.conversionFn(rawSheetPrice);
                    return prevPrice;
                }
                return prevPrice;
            });

            const assetPrices = dictFromArray(prices, (price, i) => [assets[i], price]);
            return dates.reduce((acc, d, i) => {
                const dateStr = getDateStr(d);
                const price = prices[i];
                return { ...acc, [dateStr]: { ...acc[dateStr], [asset]: price } };
            }, assetAcc);
        },
        dictFromArray(dates, (d) => [getDateStr(d), {}])
    );
};

// read the historical prices, converted the given currency
export const readHistPricesInCurrency = (
    assets: RArray<AssetKey>,
    assetCurrencies: Dict<AssetKey, string>,
    settings: Settings
): HistAssetValues => {
    const currencies = filterUnique(Object.values(assetCurrencies));
    // currency conversion asset keys, relative to the target currency
    const currencyKeys = currencies
        .filter((c) => c !== settings.currency)
        .map((c) => getCurrencyKey(c + settings.currency));

    const histPrices = readHistPrices(assets.concat(currencyKeys), settings);

    return mapDict(histPrices, (dateStr, assetPrices) => {
        return dictFromArray(assets, (asset) => {
            const price = assetPrices[asset];
            if (assetCurrencies[asset] === settings.currency) return [asset, price];
            else {
                // convert price to target currency, at the given date
                const currencyKey = getCurrencyKey(assetCurrencies[asset] + settings.currency);
                const exchangeRate = histPrices[dateStr][currencyKey];
                return [asset, price * exchangeRate];
            }
        });
    });
};

// add historical values for the target currency, which will never change in value relative to itself
export const withTrivialHistCurrencyPrice = (histPrices: HistAssetValues, currency: string) => {
    return mapDict(histPrices, (_, assetPrices) => {
        return { ...assetPrices, [getCurrencyKey(currency)]: 1 };
    });
};
