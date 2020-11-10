import { RArray, Dict, getOrCreateSheet, DateStr, mapDict, sortedDateStrs } from './utils';

export type AssetKey = string; // e.g. NASDAQ:TSLA

export const TOTAL: AssetKey = 'Total';

export type HistAssetValues = {
    readonly [d in DateStr]: {
        readonly [a in AssetKey]: number;
    };
};

export const getCurrencyKey = (currency: string) => {
    return 'CURRENCY:' + currency;
};

export const readAssetCurrencies = (assets: RArray<AssetKey>): Dict<AssetKey, string> => {
    const sheet = getOrCreateSheet('Raw Hist Prices');
    sheet.clear();

    // create commands to get price data
    assets.forEach((asset, i) => {
        sheet.getRange(i + 1, 1).setFormula(`=GOOGLEFINANCE("${asset}", "currency")`);
    });
    SpreadsheetApp.flush();

    const sheetValues = sheet.getRange(1, 1, assets.length, 1).getValues();
    return assets.reduce((acc, asset, i) => {
        const currency = String(sheetValues[i][0]);
        if (currency === '#N/A') {
            console.error(`No currency data for asset '${asset}', assuming USD`);
            return { ...acc, [asset]: 'USD' };
        }
        return { ...acc, [asset]: sheetValues[i][0] };
    }, {});
};

export type TotalFn = (assetValues: Dict<AssetKey, number>) => number;

const basicTotal: TotalFn = (assetValues) => Object.values(assetValues).reduce((acc, v) => acc + v);

export const withTotal = (assetValues: Dict<AssetKey, number>, totalFn = basicTotal) => {
    return { ...assetValues, [TOTAL]: totalFn(assetValues) };
};

export const withHistTotal = (
    histValues: HistAssetValues,
    totalFn: TotalFn = basicTotal
): HistAssetValues => {
    return mapDict(histValues, (asset, assetValues) => {
        return withTotal(assetValues, totalFn);
    });
};

export const writeHistAssetValues = (
    assets: RArray<AssetKey>,
    histValues: HistAssetValues,
    sheetName: string
) => {
    const sortedDates = sortedDateStrs(Object.keys(histValues));

    const dateRows = sortedDates.map((d) => {
        return [d].concat(assets.map((a) => Number(histValues[d][a]).toFixed(8) + ''));
    });

    const headerRow = ['Date'].concat(assets);
    const sheetValues = [headerRow].concat(dateRows);

    const sheet = getOrCreateSheet(sheetName);
    sheet.clear();
    sheet.getRange(1, 1, sortedDates.length + 1, assets.length + 1).setValues(sheetValues);
    SpreadsheetApp.flush();
};
