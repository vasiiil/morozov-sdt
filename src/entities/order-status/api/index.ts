import { useApi as _useApi } from '@/shared/api';
import type { types } from '../model';

export function useApi() {
	const api = _useApi();
	async function getList(): Promise<types.IListItem[]> {
		try {
			const { data } = await api.get<{ data: types.IListItem[] }>(
				'/lst_status',
			);

			return data;
		} catch {
			return [];
		}
	}

	return { getList };
}
