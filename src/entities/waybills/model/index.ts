import type { TPrimitiveRecord } from '@/shared/lib/types/object';
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
	async function saveItem(body: TPrimitiveRecord): Promise<boolean> {
		try {
			await api.createItem(body);
			return true;
		} catch {
			return false;
		}
	}

	return { getItem, saveItem };
}
