import { readStandardHistPrices } from './hist-price';
import {
    readTransactions,
    getTransactionsByAsset,
    getRelevantAssets,
    getAssetQtyAt,
    Transaction,
} from './transaction';
import {
    readAssetCurrencies,
    TOTAL,
    withTotal,
    AssetKey,
    withHistTotal,
    writeHistAssetValues,
} from './asset';
import {
    getHistAssetQty,
    getHistTransactionProfit,
    getHistWorth,
    getHistProfit,
    getHistAmountInvested,
    getHistProfitPercent,
    getInitWorth,
} from './portfolio';
import { readSettings, Settings } from './settings';
import {
    RArray,
    filterDict,
    justADate,
    sorted,
    getDateStr,
    getOrCreateSheet,
    dictFromArray,
} from './utils';

declare let global: any;

let transactionsCache: RArray<Transaction> | null = null;
let settingsCache: Settings | null = null;

const getTransactions = () => transactionsCache || readTransactions();
const getSettings = () => settingsCache || readSettings();

const loadHistData = () => {
    // get all buy/sell transactions
    const transactions = getTransactions();
    const transactionsByAsset = getTransactionsByAsset(transactions);

    // get settings
    const settings = getSettings();
    const [startDate, endDate] = [settings.startDate, settings.endDate];

    const assets = sorted(getRelevantAssets(transactionsByAsset, [startDate, endDate]));

    // get historical asset prices
    const assetCurrencies = readAssetCurrencies(assets);
    const histPrices = readStandardHistPrices(assets, assetCurrencies, settings);

    // find the portfolio worth before the start date
    const initWorth = getInitWorth(
        transactionsByAsset,
        histPrices[getDateStr(startDate)],
        startDate
    );

    // calculate historical portfolio properties
    const histAssetQty = getHistAssetQty(transactionsByAsset, assets, [startDate, endDate]);
    const histTransactionProfit = getHistTransactionProfit(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);
    const histAmountInvested = getHistAmountInvested(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);

    const histWorth = getHistWorth(histPrices, histAssetQty);
    const histWorthWithTotal = withHistTotal(histWorth);

    const histProfit = getHistProfit(initWorth, histWorth, histTransactionProfit);
    const histProfitWithTotal = withHistTotal(histProfit);

    const histProfitPercentWithTotal = getHistProfitPercent(
        withTotal(initWorth),
        withHistTotal(histAmountInvested),
        histProfitWithTotal
    );

    // write historical data
    const assetsWithTotal = [TOTAL].concat(assets);
    writeHistAssetValues(assetsWithTotal, histWorthWithTotal, 'Hist Worth');
    writeHistAssetValues(assetsWithTotal, histProfitWithTotal, 'Hist Profit');
    writeHistAssetValues(assetsWithTotal, histProfitPercentWithTotal, 'Hist Profit %');
};

const onOpen = () => {
    var ui = SpreadsheetApp.getUi();
    SpreadsheetApp.getActive().removeMenu('Portfolio');
    ui.createMenu('Portfolio').addItem('Load Data', 'loadHistData').addToUi();
};

global.loadHistData = loadHistData;
global.onOpen = onOpen;

// utilities
global.getAssetQtyAt = (asset: AssetKey, date: Date) => {
    const transactions = getTransactions();
    return getAssetQtyAt(
        transactions.filter((t) => t.asset === asset),
        date
    );
};
