import type { TObjectKeys } from '@/shared/lib/types/object';

export const types = {
	4: 'ТОРГ-2 недостача',
	8: 'ТОРГ-2 брак',
	12: 'Поставка на склад',
	13: 'Возврат',
	22: 'Заявка на возврат',
} as const;
export type TType = TObjectKeys<typeof types>;
export const statuses = [
	{
		value: 42,
		text: 'Оприходовано',
		type_id: 4,
	},
	{
		value: 82,
		text: 'Оприходовано',
		type_id: 8,
	},
	{
		value: 120,
		text: 'Отменено',
		type_id: 12,
	},
	{
		value: 121,
		text: 'Макет',
		type_id: 12,
	},
	{
		value: 1201,
		text: 'Утверждено',
		type_id: 12,
	},
	{
		value: 1202,
		text: 'Прибыл',
		type_id: 12,
	},
	{
		value: 122,
		text: 'Приемка',
		type_id: 12,
	},
	{
		value: 123,
		text: 'Приемка',
		type_id: 12,
	},
	{
		value: 124,
		text: 'Оприходовано',
		type_id: 12,
	},
	{
		value: 134,
		text: 'Оприходовано',
		type_id: 13,
	},
	{
		value: 220,
		text: 'Отменено',
		type_id: 22,
	},
	{
		value: 221,
		text: 'Макет',
		type_id: 22,
	},
	{
		value: 222,
		text: 'Утверждено',
		type_id: 22,
	},
] as const;
export type TStatus = (typeof statuses)[number]['value'];

export interface IListItem {
	doc_id: number;
	id: string;
	date_create: string;
	date_status: string;
	type_id: TType;
	type_name: string;
	status: TStatus;
}

export type TSortFields =
	| 'doc_id'
	| 'date_create'
	| 'date_status'
	| 'status'
	| 'type_id';
export type TSort = {
	[P in keyof Pick<IListItem, TSortFields>]?: 'asc' | 'desc';
};

export type TFilterFields =
	| 'doc_id'
	| 'date_create'
	| 'date_status'
	| 'type_id'
	| 'status';
export type TFilter = {
	[P in keyof Pick<IListItem, TFilterFields>]?: string | number;
};
export type TDxDataGridFilters = {
	doc_id?: string;
	date_create?: Date | [Date, Date];
	date_status?: Date | [Date, Date];
	type_id: TType;
	status: TStatus;
};

export interface IItem extends IListItem {
	date_arrive: string | null;
	date_reception_begin: string | null;
	parent_id: IListItem['id'] | null;
	items: IProductListItem[];
}
export interface IProductListItem {
	item_id: string;
	name: string;
	quantity: number;
	price_nds: number;
	sum_nds: number;
	order_id?: string;
}
export interface IProductItem {
	item_id: string;
	name: string;
	barcode: string;
	price_nds: number;
	quantity: number;
	cnt: number;
	marks: boolean;
	vas: number | null;
}

export interface IAdditionalExpirationListItem {
	qty: number;
	date: string;
	stock: string;
}
export interface IAdditionalListItem {
	item_id: IProductListItem['item_id'];
	qty: number;
	qty_orig: number;
	qty_defect: number;
	vas: number[] | null;
	qty_b: number;
	serial_numbers?: string[];
	expiration?: IAdditionalExpirationListItem[];
	marks?: string[];
}
export interface IAdditionalResponse {
	[key: IProductListItem['item_id']]: IAdditionalListItem;
}
export function getProductDefaultForm(): IProductItem {
	return {
		item_id: '',
		name: '',
		barcode: '',
		price_nds: 0,
		quantity: 0,
		cnt: 0,
		marks: false,
		vas: null,
	};
}
