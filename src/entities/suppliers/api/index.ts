import { useApi as _useApi } from '@/shared/api';
import type { IListItem } from '../config';
type TListResponse = {
	data: IListItem[];
	params: {
		total: number;
	};
};
type TListReturn = {
	data: IListItem[];
	totalCount: number;
};

export function useApi() {
	const api = _useApi();
	async function getList(offset: number, limit: number): Promise<TListReturn> {
		try {
			const response = await api.get<TListResponse>('/suppliers', {
				offset,
				limit,
			});
			return {
				totalCount: response.params.total,
				data: response.data,
			};
		} catch {
			return {
				totalCount: 0,
				data: [],
			};
		}
	}
	async function getItem(id: IListItem['supplier_id']): Promise<IListItem> {
		const { data } = await api.get<{ data: IListItem }>(`/supplier/${id}`);
		return data;
	}
	async function saveItem(
		body: Record<string, string | number>,
		id: IListItem['supplier_id'],
	) {
		return api.post(`/supplier/${id}`, body);
	}
	async function createItem(
		body: Record<string, string | number>,
	): Promise<IListItem['supplier_id']> {
		const {
			data: { supplier_id },
		} = await api.put<{
			data: { supplier_id: IListItem['supplier_id'] };
		}>('/supplier', body);
		return supplier_id;
	}

	return { getList, getItem, saveItem, createItem };
}
