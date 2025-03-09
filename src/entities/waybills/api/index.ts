import { useApi as _useApi } from '@/shared/api';
import type { TPrimitiveRecord } from '@/shared/lib/types/object';
import type {
	IAdditionalResponse,
	IItem,
	IListItem,
	TFilter,
	TSort,
} from '../config';
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
	async function getList(
		filter: TFilter,
		offset: number,
		limit: number,
		sort: TSort | null = null,
	): Promise<TListReturn> {
		try {
			const response = await api.get<TListResponse>('/waybills', {
				filter,
				offset,
				limit,
				sort: sort ?? {
					date_create: 'desc',
				},
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
	async function getItem(
		id: IListItem['doc_id'],
	): Promise<{ data: IItem; additional: IAdditionalResponse }> {
		const response = await api.get<{
			data: IItem;
			additional: IAdditionalResponse;
		}>(`/waybill_in/${id}`);
		return response;
	}
	async function createItem(
		body: TPrimitiveRecord,
	) {
		await api.put('/waybill', body);
	}

	return { getList, getItem, createItem };
}
