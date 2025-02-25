import moment from '../moment';
export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD hh:mm:ss';
export function isValidDate(value: unknown): value is Date {
	return value instanceof Date && !isNaN(value.getTime());
}
export function toFormat<
	TVavlue extends Date | null | undefined,
	R = TVavlue extends Date ? string : null,
>(value: TVavlue, format = dateTimeFormat): R {
	if (isValidDate(value)) {
		return moment(value).format(format) as R;
	}

	return null as R;
}
export function toDate(
	value: string | null | undefined,
	format: string = dateTimeFormat,
): Date | null {
	if (!value) {
		return null;
	}

	const dateValue = moment(value, format);
	if (dateValue.isValid()) {
		return dateValue.toDate();
	}

	return null;
}
export function convertDate(
	value: string | null | undefined,
	fromFormat: string = 'DD.MM.YYYY hh:mm:ss',
	toFormat: string = 'YYYY-MM-DD hh:mm:ss',
): string | null {
	if (!value) {
		return null;
	}

	const dateValue = moment(value, fromFormat);
	if (dateValue.isValid()) {
		return dateValue.format(toFormat);
	}

	return null;
}
export function getFormattedDate(value: string | null): string {
	return toDate(value)?.toLocaleDateString() ?? '';
}
export function getLastMonthDay(date?: Date | null): Date {
	date = date ?? new Date();
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function getFirstMonthDay(date?: Date | null): Date {
	date = date ?? new Date();
	return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function getOnlyDate(date?: Date | null): Date {
	date = date ?? new Date();
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
export function getCopyDate(date: Date): Date {
	return new Date(date.getTime());
}
export function datesAreEqual(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}
export function getQuarter(date: Date): number | null {
	try {
		return Math.floor((date.getMonth() + 3) / 3);
	} catch {
		return null;
	}
}
export function getYearBoundaryDates(year: number): [Date, Date] {
	return [new Date(year, 0, 1), new Date(year, 11, 31)];
}
export function getQuarterBoundaryDates(
	quarter: number,
	year?: number,
): [Date, Date] {
	if (year === undefined) {
		year = new Date().getFullYear();
	}
	const firstMonth = quarter - 1 * 3;
	const lastMonth = quarter * 3 - 1;
	return [new Date(year, firstMonth, 1), new Date(year, lastMonth + 1, 0)];
}
export function getMinDate(
	dates: (Date | null)[],
	defaultValue: Date | null = null,
): Date | null {
	return (
		dates.reduce((a, b) => {
			if (a && b) {
				return a < b ? a : b;
			}
			if (!a) {
				return b;
			}

			return a;
		}, null) ?? defaultValue
	);
}
export function getMaxDate(
	dates: (Date | null)[],
	defaultValue: Date | null = null,
): Date | null {
	return (
		dates.reduce((a, b) => {
			if (a && b) {
				return a > b ? a : b;
			}
			if (!a) {
				return b;
			}

			return a;
		}, null) ?? defaultValue
	);
}
