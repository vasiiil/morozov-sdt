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
			const productNames = new Map<
				IAdditionalListItem['item_id'],
				IAdditionalListItem['item_name']
			>();
			for (const product of response.data.items) {
				productNames.set(product.item_id, product.name);
			}
			return {
				data: response.data,
				additional: Object.entries(response.additional).map((item) => ({
					...item[1],
					item_name: productNames.get(item[1].item_id) ?? '',
				})),
			};
		} catch {
			return null;
		}
	}
	async function saveItem(
		waybill: TPrimitiveRecord,
		items: TPrimitiveRecord[],
	): Promise<boolean> {
		try {
			await api.createItem({ waybill, items });
			return true;
		} catch {
			return false;
		}
	}

	return { getItem, saveItem };
}
