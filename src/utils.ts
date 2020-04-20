export type RArray<T> = ReadonlyArray<T>;
export type Dict<K extends string, T> = { readonly [k in K]: T };

export type DateStr = string;

export const getDateStr = (date: Date): DateStr => {
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
};

export const justADate = (date: Date | string): Date => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
};

export const sortedDateStrs = (dates: RArray<DateStr>): RArray<DateStr> => {
    return [...dates].sort((d1, d2) => justADate(d1).getTime() - justADate(d2).getTime());
};

export const getDailyDates = (startDate: Date, endDate: Date) => {
    const numDays =
        Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return new Array(numDays).fill(0).map((_, i) => {
        const date = justADate(startDate);
        date.setUTCDate(date.getUTCDate() + i);
        return date;
    });
};

export const filterUnique = <V>(arr: RArray<V>): RArray<V> => {
    return Array.from(new Set(Object.values(arr)));
};

export const sorted = <V>(arr: RArray<V>, compareFn?: (v1: V, v2: V) => number): RArray<V> => {
    return Array.from(arr).sort(compareFn);
};

export const mapDict = <V, NV, K extends string>(
    dict: Dict<K, V>,
    fn: (k: K, v: V, i: number) => NV
): Dict<K, NV> => {
    return Object.entries(dict).reduce((acc, [k, v], i) => {
        const nv = fn(k as K, v as V, i);
        return { ...acc, [k]: nv };
    }, {} as Dict<K, NV>);
};

export const filterDict = <V, K extends string>(
    dict: Dict<K, V>,
    fn: (k: K, v: V, i: number) => boolean
): Dict<K, V> => {
    return Object.entries(dict).reduce((acc, [k, v], i) => {
        return fn(k as K, v as V, i) ? { ...acc, [k]: v } : acc;
    }, {} as Dict<K, V>);
};

export const dictFromArray = <V, NV, K extends string>(
    arr: RArray<V>,
    fn: (v: V, i: number) => [K, NV]
): Dict<K, NV> => {
    return arr.reduce<Dict<K, NV>>((acc, v, i) => {
        const [k, nv] = fn(v, i);
        return { ...acc, [k]: nv };
    }, {} as Dict<K, NV>);
};

export const getOrCreateSheet = (name: string) => {
    const sheet = SpreadsheetApp.getActive().getSheetByName(name);
    // insert a new sheet at the end
    if (sheet === null) return SpreadsheetApp.getActive().insertSheet(name, 100);
    else return sheet;
};
