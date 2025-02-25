import { useApi as _useApi } from '@/shared/api';
import type { OrderTypes } from '@/entities/order';
import type { ProductTypes } from '@/entities/products';

type TListResponse = {
	data: OrderTypes.IListItem[];
	params: {
		total: number;
	};
};
type TListReturn = {
	data: OrderTypes.IListItem[];
	totalCount: number;
};

type TItemResopnse = {
	data: {
		items: ProductTypes.IListItem[];
	}
};
type TItemReturn = {
	items: ProductTypes.IListItem[];
};

export function useApi() {
	const api = _useApi();
	async function getList(
		filter: OrderTypes.TFilter,
		offset: number,
		limit: number,
		sort: OrderTypes.TSort | null = null,
	): Promise<TListReturn> {
		try {
			const response = await api.get<TListResponse>('/orders', {
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
		orderId: OrderTypes.TOrderId,
	): Promise<TItemReturn | null> {
		try {
			const { data } = await api.get<TItemResopnse>(`/order/${orderId}`);
			return data;
		} catch {
			return null;
		}
	}

	return { getList, getItem };
}
