import type { IItem, IListItem } from '../config';
import { useApi } from '../api';

export function useModel() {
	const api = useApi();
	function getItem(
		items: IListItem[],
		id: IListItem['supplier_id'],
	): IItem | null {
		try {
			const item = items.find((item) => item.supplier_id === id);
			if (!item) {
				return null;
			}

			return {
				...item,
				send_emails: item.send_emails?.split(',') ?? [],
			};
		} catch {
			return null;
		}
	}
	async function saveItem(
		body: Record<string, string | number>,
		id?: IListItem['supplier_id'],
	): Promise<IListItem['supplier_id'] | null> {
		try {
			if (id) {
				await api.saveItem(body, id);
			} else {
				id = await api.createItem(body);
			}
			return id;
		} catch {
			return null;
		}
	}

	return { getItem, saveItem };
}
