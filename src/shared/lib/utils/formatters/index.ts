export const formatInteger = ',##0';
export const formatDecimal2 = ',##0.00';
export const formatCurrency = formatDecimal2;

export function createNumberFormatter(fractionDigits: number = 2) {
	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
		style: 'decimal',
	});
}
export const currencyFormatter = createNumberFormatter();
