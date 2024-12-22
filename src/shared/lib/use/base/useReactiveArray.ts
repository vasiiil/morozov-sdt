import { reactive } from 'vue';
import arrayMethods from '../../utils/array';
import { freezeItem, freezeItems } from '../../utils/object';

export interface IUseReactiveArray<T> {
	array: T[];
	push: (item: T) => void;
	unshift: (item: T) => void;
	pushMany: (items: T[]) => void;
	remove: (index: number) => void;
	reset: () => void;
	refresh: (items: T[]) => void;
	update: (index: number, item: T) => void;
}

export function useReactiveArray<T>(init: T[] = []): IUseReactiveArray<T> {
	const array = reactive<Readonly<T>[]>([]) as Readonly<T>[];
	refresh(init);

	function push(item: T) {
		array.push(freezeItem<T>(item));
	}
	function unshift(item: T) {
		array.unshift(freezeItem<T>(item));
	}
	function pushMany(items: T[]) {
		arrayMethods.pushMany(array, freezeItems(items));
	}
	function remove(index: number) {
		arrayMethods.splice(array, index);
	}
	function reset() {
		arrayMethods.reset(array);
	}
	function refresh(items: T[]) {
		reset();
		pushMany(items);
	}
	function update(index: number, item: T) {
		arrayMethods.update(array, index, freezeItem(item));
	}

	return {
		array,
		push,
		pushMany,
		unshift,
		remove,
		reset,
		refresh,
		update,
	};
}
