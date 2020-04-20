import {
    getAssetQtyAt,
    TransactionsByAsset,
    Transaction,
    getAmountInvested,
    getTransactionProfit,
} from './transaction';
import { AssetKey, HistAssetValues } from './asset';
import {
    RArray,
    getDailyDates,
    getDateStr,
    justADate,
    dictFromArray,
    mapDict,
    sortedDateStrs,
    Dict,
} from './utils';

type HistPropFn = (transactions: RArray<Transaction>, date: Date, startDate: Date) => number;

const getHistProp: (
    propFn: HistPropFn
) => (
    transactionsByAsset: TransactionsByAsset,
    assets: RArray<AssetKey>,
    dates: [Date, Date]
) => HistAssetValues = (propFn) => (transactionsByAsset, assets, [startDate, endDate]) => {
    const dates = getDailyDates(startDate, justADate(new Date()));

    return dictFromArray(dates, (d) => {
        return [
            getDateStr(d),
            dictFromArray(assets, (a) => [a, propFn(transactionsByAsset[a], d, startDate)]),
        ];
    });
};

export const getHistQty = getHistProp((ts, date) => getAssetQtyAt(ts, date));
export const getHistAmountInvested = getHistProp((ts, date, startDate) =>
    getAmountInvested(ts, [startDate, date])
);
export const getHistTransactionProfit = getHistProp((ts, date, startDate) =>
    getTransactionProfit(ts, [startDate, date])
);

export const getInitWorth = (
    transactionsByAsset: TransactionsByAsset,
    prices: Dict<AssetKey, number>,
    startDate: Date
): Dict<AssetKey, number> => {
    // find the previous worth of each asset
    const dateBeforeStart = justADate(startDate);
    dateBeforeStart.setUTCDate(startDate.getUTCDate() - 1);

    return mapDict(
        prices,
        (asset, price) => getAssetQtyAt(transactionsByAsset[asset], dateBeforeStart) * price
    );
};

export const getHistWorth = (
    histPrices: HistAssetValues,
    histQty: HistAssetValues
): HistAssetValues => {
    return mapDict(histPrices, (dateStr, prices) => {
        return mapDict(prices, (asset, price) => {
            return histQty[dateStr][asset] * price;
        });
    });
};

export const getHistProfit = (
    initWorth: Dict<AssetKey, number>,
    histWorth: HistAssetValues,
    histTransactionProfit: HistAssetValues
): HistAssetValues => {
    return mapDict(histWorth, (dateStr, assetWorths) => {
        return mapDict(assetWorths, (asset, curAssetWorth) => {
            const transactionProfit = histTransactionProfit[dateStr][asset];
            return transactionProfit + (curAssetWorth - initWorth[asset]);
        });
    });
};

export const getHistProfitPercent = (
    initWorth: Dict<AssetKey, number>,
    histAmountInvested: HistAssetValues,
    histProfit: HistAssetValues
): HistAssetValues => {
    return mapDict(histProfit, (dateStr, proftPerAsset) => {
        return mapDict(proftPerAsset, (asset, profit) => {
            const totalAmountInvested = initWorth[asset] + histAmountInvested[dateStr][asset];

            if (totalAmountInvested === 0) return 0;
            else return (profit / totalAmountInvested) * 100;
        });
    });
};
