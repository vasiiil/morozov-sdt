export { DataGrid, PopupCard } from './ui';
export type { IListItem } from './config';

import { useApi } from './api';
export async function getSuppliers(offset: number, limit: number) {
	const api = useApi();
	return await api.getList(offset, limit);
}
