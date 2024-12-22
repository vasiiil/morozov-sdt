import { useApi as _useApi } from '@/shared/api';
import { convertDate } from '@/shared/lib/utils/date';
import type { OrderTypes } from '@/entities/order';
import { useOrderStatusStore } from '@/entities/order-status';
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
	const { names: statusNames } = useOrderStatusStore();
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
				data: response.data.map((item) => ({
					...item,
					date_status: convertDate(item.date_status),
					date_create: convertDate(item.date_create),
					date_ship: convertDate(item.date_ship),
					final_date: convertDate(item.final_date),
					status_name: statusNames.get(item.status) ?? `${item.status}`,
				})),
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
