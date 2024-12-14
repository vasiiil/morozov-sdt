import { useReactiveIdentifiedArray } from '@/shared/lib/use/base/useReactiveIdentifiedArray';
import { useApi } from '../api';
import type { IListItem } from './types';

const { array: items, refresh } = useReactiveIdentifiedArray<IListItem>();
let request: Promise<IListItem[]> | null = null;
const names = new Map<IListItem['id'], IListItem['name']>();
export function useStore() {
	const api = useApi();
	function refreshItems(items: IListItem[]) {
		refresh(items);
		names.clear();
		for (const item of items) {
			names.set(item.id, item.name);
		}
	}
	async function loadList() {
		if (!request) {
			request = api.getList();
		}

		const data = await request;
		refreshItems(data);
		request = null;
	}

	return {
		items,
		loadList,
		names,
	};
}
