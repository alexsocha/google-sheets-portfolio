import { AssetKey } from './asset';
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
        .getRange(2, 1, sheet.getMaxRows(), 5)
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

export const getAssetQtyAt = (transactions: RArray<Transaction>, date: Date) => {
    return transactions.reduce((acc, t) => {
        if (t.date.getTime() > date.getTime()) return acc;
        else return acc + (t.action === 'BUY' ? t.quantity : -t.quantity);
    }, 0);
};

// get the cumulative profit/loss of all transactions within a timeframe
export const getTransactionProfit = (
    transactions: RArray<Transaction>,
    [startDate, endDate]: [Date, Date]
) => {
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
) => {
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

// get a list of assets owned on or after the start date
export const getRelevantAssets = (
    transactionsByAsset: TransactionsByAsset,
    [startDate, endDate]: [Date, Date]
): RArray<AssetKey> => {
    return Object.entries(transactionsByAsset)
        .filter(([_, ts]) => {
            // check if a transaction was made within the timeframe
            const hasTransaction = ts.some(
                (t) =>
                    t.date.getTime() >= startDate.getTime() && t.date.getTime() <= endDate.getTime()
            );
            return getAssetQtyAt(ts, startDate) > 0 || hasTransaction;
        })
        .map(([a]) => a);
};
