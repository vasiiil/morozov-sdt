import { useApi as _useApi } from '@/shared/api';
import type { IListItem, TFilter, TSort } from '../config';
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
	// async function getItem(
	// 	orderId: OrderTypes.TOrderId,
	// ): Promise<TItemReturn | null> {
	// 	try {
	// 		const { data } = await api.get<TItemResopnse>(`/order/${orderId}`);
	// 		return data;
	// 	} catch {
	// 		return null;
	// 	}
	// }

	return { getList };
}
