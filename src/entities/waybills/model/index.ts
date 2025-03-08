import { toDate } from '@/shared/lib/utils/date';
import type { IAdditionalListItem, IItem, IListItem } from '../config';
import { useApi } from '../api';

export function useModel() {
	const api = useApi();
	async function getItem(id: IListItem['doc_id']): Promise<{
		data: IItem;
		additional: IAdditionalListItem[];
	} | null> {
		try {
			const response = await api.getItem(id);
			return {
				data: {
					...response.data,
					date_create: toDate(response.data.date_create),
					date_status: toDate(response.data.date_status),
					date_arrive: toDate(response.data.date_arrive),
					date_reception_begin: toDate(response.data.date_reception_begin),
				},
				additional: Object.entries(response.additional).map((item) => item[1]),
			};
		} catch {
			return null;
		}
	}

	return { getItem };
}
