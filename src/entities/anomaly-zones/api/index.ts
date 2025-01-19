import { useApi as _useApi } from '@/shared/api';
import { convertDate, toDate } from '@/shared/lib/utils/date';
import type { IListItem, IItem, TFilter, IItemResponse } from '../config';
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

type TItemResopnse = {
	data: IItemResponse;
};
type TItemReturn = IItem;

export function useApi() {
	const api = _useApi();
	async function getList(
		filter: TFilter,
		offset: number,
		limit: number,
	): Promise<TListReturn> {
		try {
			const response = await api.get<TListResponse>('/anomaly_zone', {
				filter,
				offset,
				limit,
			});
			return {
				totalCount: response.params.total,
				data: response.data.map((item) => ({
					...item,
					date_create: convertDate(item.date_create),
					date_final_status: convertDate(item.date_final_status),
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
		id: IListItem['anomaly_id'],
	): Promise<TItemReturn | null> {
		try {
			const { data } = await api.get<TItemResopnse>(`/anomaly/${id}`);

			return {
				...data,
				date_create: toDate(data.date_create),
				date_final_status: toDate(data.date_final_status),
			};
		} catch {
			return null;
		}
	}

	return {
		getList,
		getItem,
	};
}
