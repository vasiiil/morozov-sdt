import { useApi as _useApi } from '@/shared/api';
import type { OrderStatusTypes } from '@/entities/order-status';

export function useApi() {
	const api = _useApi();
	async function getList(): Promise<OrderStatusTypes.IListItem[]> {
		try {
			const { data } = await api.get<{ data: OrderStatusTypes.IListItem[] }>(
				'/lst_status',
			);

			return data;
		} catch {
			return [];
		}
	}

	return { getList };
}
