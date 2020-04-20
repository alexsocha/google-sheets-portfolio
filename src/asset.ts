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
        return { ...acc, [asset]: sheetValues[i][0] };
    }, {});
};

export const withTotal = (assetValues: Dict<AssetKey, number>): Dict<AssetKey, number> => {
    const total = Object.values(assetValues).reduce((acc, v) => acc + v);
    return { ...assetValues, [TOTAL]: total };
};

export const withHistTotal = (histValues: HistAssetValues): HistAssetValues => {
    return mapDict(histValues, (asset, assetValues) => {
        return withTotal(assetValues);
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
