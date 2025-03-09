import { useApi } from '../api';
import type { types } from '../model';
export async function searchByItemId(
	itemId: types.TItemId,
	skip: number,
	take: number,
) {
	const { searchByItemId } = useApi();
	try {
		return await searchByItemId(itemId, skip, take);
	} catch {
		return {
			data: [],
			totalCount: 0,
		};
	}
}
export async function searchByItemName(
	itemName: types.IBaseListItem['name'],
	skip: number,
	take: number,
) {
	const { searchByItemName } = useApi();
	try {
		return await searchByItemName(itemName, skip, take);
	} catch {
		return {
			data: [],
			totalCount: 0,
		};
	}
}
