import type { IIdentified } from '../../types/object';

export function spliceById<T extends IIdentified>(array: T[], id: T['id']) {
	const index = array.findIndex((item) => item.id === id);
	splice(array, index);
}

export function splice<T = unknown>(array: T[], index: number) {
	if (index === -1) {
		return;
	}
	array.splice(index, 1);
}

export function findById<T extends IIdentified>(
	id: T['id'],
	array: T[],
): T | undefined {
	return array.find((item) => item.id === id);
}

export function reset<T = unknown>(array: T[]) {
	array.length = 0;
}

export function refresh<T = unknown>(array: T[], newArray: T[]) {
	reset(array);
	array.push(...newArray);
}

export function update<T = unknown>(array: T[], index: number, item: T) {
	if (index === -1) {
		return;
	}
	array.splice(index, 1, item);
}

export function updateById<T extends IIdentified>(
	array: T[],
	id: T['id'],
	item: T,
) {
	const index = array.findIndex((item) => item.id === id);
	update(array, index, item);
}

export function pushMany<T = unknown>(array: T[], items: T[]) {
	array.push(...items);
}

const arrayMethods = {
	splice,
	spliceById,
	reset,
	refresh,
	update,
	updateById,
	findById,
	pushMany,
};

export default arrayMethods;
