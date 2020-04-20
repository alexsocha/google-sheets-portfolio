import { justADate } from './utils';

export interface Settings {
    readonly startDate: Date;
    readonly endDate: Date;
    readonly interval: 'DAILY' | 'WEEKLY';
    readonly currency: string;
}

export const readSettings = (): Settings => {
    const sheet = SpreadsheetApp.getActive().getSheetByName('Settings')!;
    const sheetValues = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();

    const getKey = (rawKey: unknown) => {
        const keyStr = String(rawKey).toLowerCase().replace(' ', '_');
        return keyStr.slice(0, keyStr.endsWith(':') ? -1 : keyStr.length);
    };

    return sheetValues.reduce((acc, row) => {
        const key = getKey(row[0]);
        if (key === 'start_date') return { ...acc, startDate: justADate(row[1]) };
        else if (key === 'end_date') return { ...acc, endDate: justADate(row[1]) };
        else if (key === 'interval')
            return {
                ...acc,
                interval: String(row[1]).toUpperCase() as Settings['interval'],
            };
        else if (key === 'currency') return { ...acc, currency: String(row[1]).toUpperCase() };
        else return acc;
    }, {} as Settings);
};
