export type TId = number;
export type TItemId = string;
export type TSize = [number, number, number];
export type TBarcode = [string, string];

export interface IBaseListItem {
	item_id: TItemId;
	name: string;
	weight?: number;
	cnt?: number;
}
export interface IListItem extends IBaseListItem {
	price: number;
	quantity: number;
}
export interface IItemResponse extends IBaseListItem {
	prod_id: TId;
	cnt: number;
	stock_a: number;
	stock_b: number;
	stock_q: number;
	stock_d: number;
	stock_e: number;
	weight: number;
	size: TSize;
	lifetime: string | null;
	cnt_in_box: number | null;
	barcode: TBarcode;
	date_stock_update: string;
	label: string | null;
	comment: string | null;
	comment_pack: string | null;
	expiration: string | null;
	min_days_to_expire: number | null;
	marks: boolean;
}
