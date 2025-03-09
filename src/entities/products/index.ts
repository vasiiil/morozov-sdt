export { useApi } from './api';
export type { types as ProductTypes } from './model';
export { DataGrid as ProductsDataGrid } from './ui';
import { searchByItemId, searchByItemName } from './util';
export const searchProducts = {
	byId: searchByItemId,
	byName: searchByItemName,
};
