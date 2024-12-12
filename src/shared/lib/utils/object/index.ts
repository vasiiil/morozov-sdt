export function freezeItem<T = unknown>(item: T): Readonly<T> {
	return Object.freeze(item);
}
export function freezeItems<T = unknown>(items: T[]): Readonly<T>[] {
	return items.map(freezeItem);
}
