import { useApi as _useApi } from '@/shared/api';
import type { types } from '../model';

type TListResponse = {
	data: types.IItemResponse[];
	params: {
		total: number;
	};
};
type TListReturn = {
	data: types.IBaseListItem[];
	totalCount: number;
};

export function useApi() {
	const api = _useApi();
	async function searchBy(
		field: 'item_id' | 'name',
		value: string,
		skip: number,
		take: number,
	): Promise<TListReturn> {
		try {
			const {
				data,
				params: { total: totalCount },
			} = await api.get<TListResponse>('/products', {
				filter: { [field]: value },
				limit: take,
				offset: skip,
			});

			return {
				data: data.map((item) => ({
					item_id: item.item_id,
					name: item.name,
					cnt: item.cnt,
					weight: item.weight,
				})),
				totalCount,
			};
		} catch {
			return {
				data: [],
				totalCount: 0,
			};
		}
	}
	async function searchByItemId(
		itemId: types.TItemId,
		skip: number,
		take: number,
	): Promise<TListReturn> {
		return await searchBy('item_id', itemId, skip, take);
	}
	async function searchByItemName(
		itemName: types.IBaseListItem['name'],
		skip: number,
		take: number,
	): Promise<TListReturn> {
		return await searchBy('name', itemName, skip, take);
	}

	return { searchByItemId, searchByItemName };
}
