import { readHistPricesInCurrency, withTrivialHistCurrencyPrice } from './hist-price';
import {
    readTransactions,
    getTransactionsByAsset,
    getRelevantAssets,
    getAssetQtyAt,
    Transaction,
    withCurrencyTransactions,
} from './transaction';
import {
    readAssetCurrencies,
    withTotal,
    AssetKey,
    withHistTotal,
    writeHistAssetValues,
    getCurrencyKey,
    TOTAL,
} from './asset';
import {
    getHistQty,
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

const getSettings = (): Settings => {
    if (settingsCache) return settingsCache;
    const settings = readSettings();
    settingsCache = settings;
    return settings;
};

const getTransactions = (settings: Settings): RArray<Transaction> => {
    if (transactionsCache) return transactionsCache;
    const transactions = withCurrencyTransactions(readTransactions(), settings.currency);
    transactionsCache = transactions;
    return transactions;
};

const loadData = () => {
    // clear cache
    settingsCache = null;
    transactionsCache = null;

    // get settings
    const settings = getSettings();
    const [startDate, endDate] = [settings.startDate, settings.endDate];

    // get all buy/sell transactions
    const transactions = getTransactions(settings);
    const transactionsByAsset = getTransactionsByAsset(transactions);

    // get the assets owned in the timeframe
    const dynamicAssets = sorted(
        getRelevantAssets(transactionsByAsset, settings.currency, [startDate, endDate])
    );
    // add the currency as an asset
    const assets = [getCurrencyKey(settings.currency)].concat(dynamicAssets);

    // get historical asset prices
    const assetCurrencies = readAssetCurrencies(dynamicAssets);
    const dynamicHistPrices = readHistPricesInCurrency(dynamicAssets, assetCurrencies, settings);
    const histPrices = withTrivialHistCurrencyPrice(dynamicHistPrices, settings.currency);

    // find the portfolio worth before the start date
    const initWorth = getInitWorth(
        transactionsByAsset,
        histPrices[getDateStr(startDate)],
        startDate
    );

    // calculate historical portfolio properties
    const histQty = getHistQty(transactionsByAsset, assets, [startDate, endDate]);
    const histTransactionProfit = getHistTransactionProfit(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);
    const histAmountInvested = getHistAmountInvested(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);

    const histWorth = getHistWorth(histPrices, histQty);
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
    ui.createMenu('Portfolio').addItem('Load data', 'loadData').addToUi();
};

global.loadData = loadData;
global.onOpen = onOpen;

// utilities
global.getAssetQtyAt = (asset: AssetKey, date: Date) => {
    const transactions = getTransactions(getSettings());
    return getAssetQtyAt(
        transactions.filter((t) => t.asset === asset),
        date
    );
};
