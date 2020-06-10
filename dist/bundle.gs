function loadData() {
}
function onOpen() {
}
// === utilities ===
function getAssetQty(asset, date) {
}
function getAmountInvested(asset, date) {
}/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getDateStr = function (date) {
    return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
};
exports.justADate = function (date) {
    var dateObj = date instanceof Date ? date : new Date(date);
    return new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
};
exports.sortedDateStrs = function (dates) {
    return __spreadArrays(dates).sort(function (d1, d2) { return exports.justADate(d1).getTime() - exports.justADate(d2).getTime(); });
};
exports.getDailyDates = function (startDate, endDate) {
    var numDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return new Array(numDays).fill(0).map(function (_, i) {
        var date = exports.justADate(startDate);
        date.setUTCDate(date.getUTCDate() + i);
        return date;
    });
};
exports.filterUnique = function (arr) {
    return Array.from(new Set(Object.values(arr)));
};
exports.sorted = function (arr, compareFn) {
    return Array.from(arr).sort(compareFn);
};
exports.mapDict = function (dict, fn) {
    return Object.entries(dict).reduce(function (acc, _a, i) {
        var _b;
        var k = _a[0], v = _a[1];
        var nv = fn(k, v, i);
        return __assign(__assign({}, acc), (_b = {}, _b[k] = nv, _b));
    }, {});
};
exports.filterDict = function (dict, fn) {
    return Object.entries(dict).reduce(function (acc, _a, i) {
        var _b;
        var k = _a[0], v = _a[1];
        return fn(k, v, i) ? __assign(__assign({}, acc), (_b = {}, _b[k] = v, _b)) : acc;
    }, {});
};
exports.dictFromArray = function (arr, fn) {
    return arr.reduce(function (acc, v, i) {
        var _a;
        var _b = fn(v, i), k = _b[0], nv = _b[1];
        return __assign(__assign({}, acc), (_a = {}, _a[k] = nv, _a));
    }, {});
};
exports.getOrCreateSheet = function (name) {
    var sheet = SpreadsheetApp.getActive().getSheetByName(name);
    // insert a new sheet at the end
    if (sheet === null)
        return SpreadsheetApp.getActive().insertSheet(name, 100);
    else
        return sheet;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var utils_1 = __webpack_require__(0);
exports.TOTAL = 'Total';
exports.getCurrencyKey = function (currency) {
    return 'CURRENCY:' + currency;
};
exports.readAssetCurrencies = function (assets) {
    var sheet = utils_1.getOrCreateSheet('Raw Hist Prices');
    sheet.clear();
    // create commands to get price data
    assets.forEach(function (asset, i) {
        sheet.getRange(i + 1, 1).setFormula("=GOOGLEFINANCE(\"" + asset + "\", \"currency\")");
    });
    SpreadsheetApp.flush();
    var sheetValues = sheet.getRange(1, 1, assets.length, 1).getValues();
    return assets.reduce(function (acc, asset, i) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[asset] = sheetValues[i][0], _a));
    }, {});
};
var basicTotal = function (assetValues) { return Object.values(assetValues).reduce(function (acc, v) { return acc + v; }); };
exports.withTotal = function (assetValues, totalFn) {
    var _a;
    if (totalFn === void 0) { totalFn = basicTotal; }
    return __assign(__assign({}, assetValues), (_a = {}, _a[exports.TOTAL] = totalFn(assetValues), _a));
};
exports.withHistTotal = function (histValues, totalFn) {
    if (totalFn === void 0) { totalFn = basicTotal; }
    return utils_1.mapDict(histValues, function (asset, assetValues) {
        return exports.withTotal(assetValues, totalFn);
    });
};
exports.writeHistAssetValues = function (assets, histValues, sheetName) {
    var sortedDates = utils_1.sortedDateStrs(Object.keys(histValues));
    var dateRows = sortedDates.map(function (d) {
        return [d].concat(assets.map(function (a) { return Number(histValues[d][a]).toFixed(8) + ''; }));
    });
    var headerRow = ['Date'].concat(assets);
    var sheetValues = [headerRow].concat(dateRows);
    var sheet = utils_1.getOrCreateSheet(sheetName);
    sheet.clear();
    sheet.getRange(1, 1, sortedDates.length + 1, assets.length + 1).setValues(sheetValues);
    SpreadsheetApp.flush();
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var asset_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(0);
exports.readTransactions = function () {
    var sheet = SpreadsheetApp.getActive().getSheetByName('Transactions');
    var sheetValues = sheet
        .getRange(2, 1, sheet.getLastRow() + 1, 5)
        .getValues()
        .filter(function (row) { return row[0] != ''; });
    return sheetValues.map(function (row) { return ({
        date: utils_1.justADate(row[0]),
        asset: String(row[1]).toUpperCase(),
        action: String(row[2]).toUpperCase(),
        quantity: row[3],
        unitPrice: row[4],
    }); });
};
exports.getTransactionsByAsset = function (transactions) {
    return transactions.reduce(function (acc, t) {
        var _a;
        if (!(t.asset in acc))
            return __assign(__assign({}, acc), (_a = {}, _a[t.asset] = [t], _a));
        // @ts-ignore
        acc[t.asset].push(t);
        return acc;
    }, {});
};
// create separate transaction for the target currency, e.g sell stock => buy currency
exports.withCurrencyTransactions = function (transactions, currency) {
    var currencyAsset = asset_1.getCurrencyKey(currency);
    return transactions.flatMap(function (t) {
        if (t.asset !== currencyAsset) {
            var currencyTransaction = {
                asset: currencyAsset,
                action: t.action === 'SELL' ? 'BUY' : 'SELL',
                date: t.date,
                quantity: t.unitPrice * t.quantity,
                unitPrice: 1,
            };
            return [t, currencyTransaction];
        }
        else
            return [t];
    });
};
exports.getAssetQtyAt = function (transactions, date) {
    return transactions.reduce(function (acc, t) {
        if (t.date.getTime() > date.getTime())
            return acc;
        else
            return acc + (t.action === 'BUY' ? t.quantity : -t.quantity);
    }, 0);
};
// get the cumulative profit/loss of all transactions within a timeframe
exports.getTransactionProfit = function (transactions, _a) {
    var startDate = _a[0], endDate = _a[1];
    return transactions.reduce(function (acc, t) {
        if (t.date.getTime() < startDate.getTime() || t.date.getTime() > endDate.getTime())
            return acc;
        else
            return acc + t.unitPrice * (t.action === 'BUY' ? -t.quantity : t.quantity);
    }, 0);
};
// get the amount of money invested within the timeframe,
// defined as the amount needed to ensure that all transactions can be paid for
exports.getAmountInvested = function (transactions, _a) {
    var startDate = _a[0], endDate = _a[1];
    return transactions.reduce(function (_a, t) {
        var maxInvested = _a[0], accountDebit = _a[1];
        if (t.date.getTime() < startDate.getTime() || t.date.getTime() > endDate.getTime())
            return [maxInvested, accountDebit];
        else {
            var newAccountDebit = accountDebit + t.unitPrice * (t.action === 'BUY' ? t.quantity : -t.quantity);
            return [Math.max(0, maxInvested, newAccountDebit), newAccountDebit];
        }
    }, [0, 0])[0];
};
// get the total amount invested, simply defined as the amount
// 'invested' into the target currency
exports.getTotalAmountInvested = function (targetCurrency) { return function (assetValues) {
    return assetValues[asset_1.getCurrencyKey(targetCurrency)];
}; };
// get a list of assets owned on or after the start date
exports.getRelevantAssets = function (transactionsByAsset, currency, _a) {
    var startDate = _a[0], endDate = _a[1];
    return Object.entries(transactionsByAsset)
        .filter(function (_a) {
        var asset = _a[0], ts = _a[1];
        if (asset === asset_1.getCurrencyKey(currency))
            return false;
        // check if a transaction was made within the timeframe
        var hasTransaction = ts.some(function (t) {
            return t.date.getTime() >= startDate.getTime() && t.date.getTime() <= endDate.getTime();
        });
        return exports.getAssetQtyAt(ts, startDate) > 0 || hasTransaction;
    })
        .map(function (_a) {
        var a = _a[0];
        return a;
    });
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
exports.__esModule = true;
var hist_price_1 = __webpack_require__(5);
var transaction_1 = __webpack_require__(2);
var asset_1 = __webpack_require__(1);
var portfolio_1 = __webpack_require__(6);
var settings_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(0);
var transactionsCache = null;
var settingsCache = null;
var getSettings = function () {
    if (settingsCache)
        return settingsCache;
    var settings = settings_1.readSettings();
    settingsCache = settings;
    return settings;
};
var getTransactions = function (settings) {
    if (transactionsCache)
        return transactionsCache;
    var transactions = transaction_1.withCurrencyTransactions(transaction_1.readTransactions(), settings.currency);
    transactionsCache = transactions;
    return transactions;
};
var loadData = function () {
    // clear cache
    settingsCache = null;
    transactionsCache = null;
    // get settings
    var settings = getSettings();
    var _a = [settings.startDate, settings.endDate], startDate = _a[0], endDate = _a[1];
    // get all buy/sell transactions
    var transactions = getTransactions(settings);
    var transactionsByAsset = transaction_1.getTransactionsByAsset(transactions);
    // get the assets owned in the timeframe
    var dynamicAssets = utils_1.sorted(transaction_1.getRelevantAssets(transactionsByAsset, settings.currency, [startDate, endDate]));
    // add the currency as an asset
    var assets = [asset_1.getCurrencyKey(settings.currency)].concat(dynamicAssets);
    // get historical asset prices
    var assetCurrencies = asset_1.readAssetCurrencies(dynamicAssets);
    var dynamicHistPrices = hist_price_1.readHistPricesInCurrency(dynamicAssets, assetCurrencies, settings);
    var histPrices = hist_price_1.withTrivialHistCurrencyPrice(dynamicHistPrices, settings.currency);
    // find the portfolio worth before the start date
    var initWorth = portfolio_1.getInitWorth(transactionsByAsset, histPrices[utils_1.getDateStr(startDate)], startDate);
    // calculate historical portfolio properties
    var histQty = portfolio_1.getHistQty(transactionsByAsset, assets, [startDate, endDate]);
    var histTransactionProfit = portfolio_1.getHistTransactionProfit(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);
    var histAmountInvested = portfolio_1.getHistAmountInvested(transactionsByAsset, assets, [
        startDate,
        endDate,
    ]);
    var histWorth = portfolio_1.getHistWorth(histPrices, histQty);
    var histWorthWithTotal = asset_1.withHistTotal(histWorth);
    var histProfit = portfolio_1.getHistProfit(initWorth, histWorth, histTransactionProfit);
    var histProfitWithTotal = asset_1.withHistTotal(histProfit);
    var histProfitPercentWithTotal = portfolio_1.getHistProfitPercent(asset_1.withTotal(initWorth), asset_1.withHistTotal(histAmountInvested, transaction_1.getTotalAmountInvested(settings.currency)), histProfitWithTotal);
    // write historical data
    var assetsWithTotal = [asset_1.TOTAL].concat(assets);
    asset_1.writeHistAssetValues(assetsWithTotal, histWorthWithTotal, 'Hist Worth');
    asset_1.writeHistAssetValues(assetsWithTotal, histProfitWithTotal, 'Hist Profit');
    asset_1.writeHistAssetValues(assetsWithTotal, histProfitPercentWithTotal, 'Hist Profit %');
};
var onOpen = function () {
    var ui = SpreadsheetApp.getUi();
    SpreadsheetApp.getActive().removeMenu('Portfolio');
    ui.createMenu('Portfolio').addItem('Load data', 'loadData').addToUi();
};
global.loadData = loadData;
global.onOpen = onOpen;
// === utilities ===
global.getAssetQty = function (asset, date) {
    var transactions = getTransactions(getSettings());
    var transactionsByAsset = transaction_1.getTransactionsByAsset(transactions);
    return transaction_1.getAssetQtyAt(transactionsByAsset[asset], utils_1.justADate(date));
};
global.getAmountInvested = function (asset, date) {
    var settings = getSettings();
    var transactions = getTransactions(getSettings());
    var transactionsByAsset = transaction_1.getTransactionsByAsset(transactions);
    var amountInvested = utils_1.mapDict(transactionsByAsset, function (_, ts) {
        return transaction_1.getAmountInvested(ts, [settings.startDate, utils_1.justADate(date)]);
    });
    var amountInvestedWithTotal = asset_1.withTotal(amountInvested, transaction_1.getTotalAmountInvested(settings.currency));
    return amountInvestedWithTotal[asset];
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var asset_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(0);
var getAssetMod = function (asset) {
    var _a = asset.split(':'), exchange = _a[0], ticker = _a[1];
    // edge case for GBX, which google finance doesn't handle
    if (exchange === 'CURRENCY' && ticker.startsWith('GBX'))
        return {
            code: 'CURRENCY:GBP' + ticker.substring(3),
            conversionFn: function (v) { return v / 100; },
        };
    return { code: asset, conversionFn: function (v) { return v; } };
};
var writeHistPriceFormulas = function (assets, settings) {
    var sheet = utils_1.getOrCreateSheet('Raw Hist Prices');
    sheet.clear();
    var assetMods = assets.map(getAssetMod);
    // write historial prices
    assetMods.forEach(function (assetMod, i) {
        sheet
            .getRange(1, i * 2 + 1)
            .setFormula('=GOOGLEFINANCE(' +
            ("\"" + assetMod.code + "\", ") +
            '"price", ' +
            ("\"" + utils_1.getDateStr(settings.startDate) + "\", ") +
            ("\"" + utils_1.getDateStr(settings.endDate) + "\", ") +
            ("\"" + settings.interval + "\")"));
    });
    SpreadsheetApp.flush();
    // append current prices at the end of each column
    if (settings.endDate.getTime() === utils_1.justADate(new Date()).getTime()) {
        var sheetValues_1 = sheet
            .getRange(2, 1, sheet.getLastRow() + 1, assets.length * 2)
            .getValues();
        assetMods.forEach(function (assetMod, i) {
            var lastRow = sheetValues_1.findIndex(function (row) { return row[i * 2] === ''; }) - 1;
            var lastDate = utils_1.justADate(sheetValues_1[lastRow][i * 2]);
            if (lastDate.getTime() !== settings.endDate.getTime()) {
                sheet.getRange(lastRow + 3, i * 2 + 1).setValue(settings.endDate);
                sheet.getRange(lastRow + 3, i * 2 + 2).setFormula('=GOOGLEFINANCE(' +
                    ("\"" + assetMod.code + "\"") +
                    // the 'price' attribute must be omitted for currencies in this case
                    (assetMod.code.startsWith('CURRENCY') ? ')' : ', "price")'));
            }
        });
        SpreadsheetApp.flush();
    }
};
var readHistPrices = function (assets, settings) {
    writeHistPriceFormulas(assets, settings);
    var sheet = utils_1.getOrCreateSheet('Raw Hist Prices');
    var sheetValues = sheet.getRange(2, 1, sheet.getLastRow() + 1, assets.length * 2).getValues();
    var dates = utils_1.getDailyDates(settings.startDate, settings.endDate);
    return assets.reduce(function (assetAcc, asset, i) {
        var assetMod = getAssetMod(asset);
        var row = 0;
        var prevPrice = assetMod.conversionFn(sheetValues[0][i * 2 + 1]);
        var prices = dates.map(function (date) {
            var sheetDate = utils_1.justADate(sheetValues[row][i * 2]);
            var rawSheetPrice = sheetValues[row][i * 2 + 1];
            if (rawSheetPrice !== '' && date.getTime() === sheetDate.getTime()) {
                row += 1;
                prevPrice = assetMod.conversionFn(rawSheetPrice);
                return prevPrice;
            }
            return prevPrice;
        });
        var assetPrices = utils_1.dictFromArray(prices, function (price, i) { return [assets[i], price]; });
        return dates.reduce(function (acc, d, i) {
            var _a, _b;
            var dateStr = utils_1.getDateStr(d);
            var price = prices[i];
            return __assign(__assign({}, acc), (_a = {}, _a[dateStr] = __assign(__assign({}, acc[dateStr]), (_b = {}, _b[asset] = price, _b)), _a));
        }, assetAcc);
    }, utils_1.dictFromArray(dates, function (d) { return [utils_1.getDateStr(d), {}]; }));
};
// read the historical prices, converted the given currency
exports.readHistPricesInCurrency = function (assets, assetCurrencies, settings) {
    var currencies = utils_1.filterUnique(Object.values(assetCurrencies));
    // currency conversion asset keys, relative to the target currency
    var currencyKeys = currencies
        .filter(function (c) { return c !== settings.currency; })
        .map(function (c) { return asset_1.getCurrencyKey(c + settings.currency); });
    var histPrices = readHistPrices(assets.concat(currencyKeys), settings);
    return utils_1.mapDict(histPrices, function (dateStr, assetPrices) {
        return utils_1.dictFromArray(assets, function (asset) {
            var price = assetPrices[asset];
            if (assetCurrencies[asset] === settings.currency)
                return [asset, price];
            else {
                // convert price to target currency, at the given date
                var currencyKey = asset_1.getCurrencyKey(assetCurrencies[asset] + settings.currency);
                var exchangeRate = histPrices[dateStr][currencyKey];
                return [asset, price * exchangeRate];
            }
        });
    });
};
// add historical values for the target currency, which will never change in value relative to itself
exports.withTrivialHistCurrencyPrice = function (histPrices, currency) {
    return utils_1.mapDict(histPrices, function (_, assetPrices) {
        var _a;
        return __assign(__assign({}, assetPrices), (_a = {}, _a[asset_1.getCurrencyKey(currency)] = 1, _a));
    });
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var transaction_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(0);
var getHistProp = function (propFn) { return function (transactionsByAsset, assets, _a) {
    var startDate = _a[0], endDate = _a[1];
    var dates = utils_1.getDailyDates(startDate, utils_1.justADate(endDate));
    return utils_1.dictFromArray(dates, function (d) {
        return [
            utils_1.getDateStr(d),
            utils_1.dictFromArray(assets, function (a) { return [a, propFn(transactionsByAsset[a], d, startDate)]; }),
        ];
    });
}; };
exports.getHistQty = getHistProp(function (ts, date) { return transaction_1.getAssetQtyAt(ts, date); });
exports.getHistAmountInvested = getHistProp(function (ts, date, startDate) {
    return transaction_1.getAmountInvested(ts, [startDate, date]);
});
exports.getHistTransactionProfit = getHistProp(function (ts, date, startDate) {
    return transaction_1.getTransactionProfit(ts, [startDate, date]);
});
exports.getInitWorth = function (transactionsByAsset, prices, startDate) {
    // find the previous worth of each asset
    var dateBeforeStart = utils_1.justADate(startDate);
    dateBeforeStart.setUTCDate(startDate.getUTCDate() - 1);
    return utils_1.mapDict(prices, function (asset, price) { return transaction_1.getAssetQtyAt(transactionsByAsset[asset], dateBeforeStart) * price; });
};
exports.getHistWorth = function (histPrices, histQty) {
    return utils_1.mapDict(histPrices, function (dateStr, prices) {
        return utils_1.mapDict(prices, function (asset, price) {
            return histQty[dateStr][asset] * price;
        });
    });
};
exports.getHistProfit = function (initWorth, histWorth, histTransactionProfit) {
    return utils_1.mapDict(histWorth, function (dateStr, assetWorths) {
        return utils_1.mapDict(assetWorths, function (asset, curAssetWorth) {
            var transactionProfit = histTransactionProfit[dateStr][asset];
            return transactionProfit + (curAssetWorth - initWorth[asset]);
        });
    });
};
exports.getHistProfitPercent = function (initWorth, histAmountInvested, histProfit) {
    return utils_1.mapDict(histProfit, function (dateStr, proftPerAsset) {
        return utils_1.mapDict(proftPerAsset, function (asset, profit) {
            var totalAmountInvested = initWorth[asset] + histAmountInvested[dateStr][asset];
            if (totalAmountInvested === 0)
                return 0;
            else
                return (profit / totalAmountInvested) * 100;
        });
    });
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var utils_1 = __webpack_require__(0);
exports.readSettings = function () {
    var sheet = SpreadsheetApp.getActive().getSheetByName('Settings');
    var sheetValues = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();
    var getKey = function (rawKey) {
        var keyStr = String(rawKey).toLowerCase().replace(' ', '_');
        return keyStr.slice(0, keyStr.endsWith(':') ? -1 : keyStr.length);
    };
    return sheetValues.reduce(function (acc, row) {
        var key = getKey(row[0]);
        if (key === 'start_date')
            return __assign(__assign({}, acc), { startDate: utils_1.justADate(row[1]) });
        else if (key === 'end_date')
            return __assign(__assign({}, acc), { endDate: utils_1.justADate(row[1]) });
        else if (key === 'interval')
            return __assign(__assign({}, acc), { interval: String(row[1]).toUpperCase() });
        else if (key === 'currency')
            return __assign(__assign({}, acc), { currency: String(row[1]).toUpperCase() });
        else
            return acc;
    }, {});
};


/***/ })
/******/ ]);