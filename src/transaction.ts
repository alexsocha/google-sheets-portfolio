import { AssetKey, getCurrencyKey, TotalFn } from './asset';
import { RArray, Dict, justADate } from './utils';

export interface Transaction {
    readonly action: 'BUY' | 'SELL';
    readonly asset: AssetKey;
    readonly date: Date;
    readonly quantity: number;
    readonly unitPrice: number;
}

export const readTransactions = (): RArray<Transaction> => {
    const sheet = SpreadsheetApp.getActive().getSheetByName('Transactions')!;
    const sheetValues = sheet
        .getRange(2, 1, sheet.getLastRow() + 1, 5)
        .getValues()
        .filter((row) => row[0] != '');

    return sheetValues.map((row) => ({
        date: justADate(row[0]),
        asset: String(row[1]).toUpperCase(),
        action: String(row[2]).toUpperCase() as Transaction['action'],
        quantity: row[3],
        unitPrice: row[4],
    }));
};

export type TransactionsByAsset = {
    readonly [k in AssetKey]: RArray<Transaction>;
};
export const getTransactionsByAsset = (transactions: RArray<Transaction>): TransactionsByAsset => {
    return transactions.reduce((acc, t) => {
        if (!(t.asset in acc)) return { ...acc, [t.asset]: [t] };

        // @ts-ignore
        acc[t.asset].push(t);
        return acc;
    }, {} as TransactionsByAsset);
};

// create separate transaction for the target currency, e.g sell stock => buy currency
export const withCurrencyTransactions = (
    transactions: RArray<Transaction>,
    currency: string
): RArray<Transaction> => {
    const currencyAsset = getCurrencyKey(currency);
    return transactions.flatMap((t) => {
        if (t.asset !== currencyAsset) {
            const currencyTransaction: Transaction = {
                asset: currencyAsset,
                action: t.action === 'SELL' ? 'BUY' : 'SELL',
                date: t.date,
                quantity: t.unitPrice * t.quantity,
                unitPrice: 1,
            };
            return [t, currencyTransaction];
        } else return [t];
    });
};

// get the quantity of an asset at the given date
export const getAssetQty = (transactions: RArray<Transaction>, date: Date): number => {
    return transactions.reduce((acc, t) => {
        if (t.date.getTime() > date.getTime()) return acc;
        else return acc + (t.action === 'BUY' ? t.quantity : -t.quantity);
    }, 0);
};

// get the cumulative profit/loss of all transactions within the timeframe
export const getTransactionProfit = (
    transactions: RArray<Transaction>,
    [startDate, endDate]: [Date, Date]
): number => {
    return transactions.reduce((acc, t) => {
        if (t.date.getTime() < startDate.getTime() || t.date.getTime() > endDate.getTime())
            return acc;
        else return acc + t.unitPrice * (t.action === 'BUY' ? -t.quantity : t.quantity);
    }, 0);
};

// get the amount of money invested within the timeframe,
// defined as the amount needed to ensure that all transactions can be paid for
export const getAmountInvested = (
    transactions: RArray<Transaction>,
    [startDate, endDate]: [Date, Date]
): number => {
    return transactions.reduce(
        ([maxInvested, accountDebit], t) => {
            if (t.date.getTime() < startDate.getTime() || t.date.getTime() > endDate.getTime())
                return [maxInvested, accountDebit];
            else {
                const newAccountDebit =
                    accountDebit + t.unitPrice * (t.action === 'BUY' ? t.quantity : -t.quantity);
                return [Math.max(0, maxInvested, newAccountDebit), newAccountDebit];
            }
        },
        [0, 0]
    )[0];
};

// get the total amount invested, simply defined as the amount
// 'invested' into the target currency
export const getTotalAmountInvested: (targetCurrency: string) => TotalFn = (targetCurrency) => (
    assetValues
) => {
    return assetValues[getCurrencyKey(targetCurrency)];
};

// get a list of assets owned on or after the start date
export const getRelevantAssets = (
    transactionsByAsset: TransactionsByAsset,
    currency: string,
    [startDate, endDate]: [Date, Date]
): RArray<AssetKey> => {
    return Object.entries(transactionsByAsset)
        .filter(([asset, ts]) => {
            if (asset === getCurrencyKey(currency)) return false;

            // check if a transaction was made within the timeframe
            const hasTransaction = ts.some(
                (t) =>
                    t.date.getTime() >= startDate.getTime() && t.date.getTime() <= endDate.getTime()
            );
            return getAssetQty(ts, startDate) > 0 || hasTransaction;
        })
        .map(([a]) => a);
};
