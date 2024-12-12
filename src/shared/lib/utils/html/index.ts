export function getHTMLSize(
	value: number | string | undefined,
	defaultValue: string = '100%',
): string {
	if (value === undefined) {
		return defaultValue;
	}
	if (typeof value === 'number') {
		return `${value}px`;
	}

	return value;
}
