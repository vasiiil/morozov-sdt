import type { IIdentified } from '../../types/object';
import { freezeItem } from '../../utils/object';
import arrayMethods from '../../utils/array';
import { useReactiveArray, type IUseReactiveArray } from './useReactiveArray';

export interface IUseReactiveIdentifiedArray<T extends IIdentified>
	extends IUseReactiveArray<T> {
	removeById: (id: T['id']) => void;
	updateById: (id: T['id'], item: T) => void;
}

export function useReactiveIdentifiedArray<T extends IIdentified>(
	init: T[] = [],
): IUseReactiveIdentifiedArray<T> {
	const array = useReactiveArray<T>(init);

	function removeById(id: T['id']) {
		arrayMethods.spliceById(array.array, id);
	}
	function updateById(id: T['id'], item: T) {
		arrayMethods.updateById(array.array, id, freezeItem(item));
	}

	return {
		...array,
		removeById,
		updateById,
	};
}
