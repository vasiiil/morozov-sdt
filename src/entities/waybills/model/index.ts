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
				data: response.data,
				additional: Object.entries(response.additional).map((item) => item[1]),
			};
		} catch {
			return null;
		}
	}

	return { getItem };
}
