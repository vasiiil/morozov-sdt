import type { TObjectKeys } from '@/shared/lib/types/object';

export const types = {
	4: 'ТОРГ-2 недостача',
	8: 'ТОРГ-2 брак',
	12: 'Поставка на склад',
	13: 'Возврат',
	22: 'Заявка на возврат',
} as const;
export type TType = TObjectKeys<typeof types>;
export const statuses = {
	42: {
		value: 42,
		text: 'Оприходовано',
		type_id: 4,
	},
	82: {
		value: 82,
		text: 'Оприходовано',
		type_id: 8,
	},
	120: {
		value: 120,
		text: 'Отменено',
		type_id: 12,
	},
	121: {
		value: 121,
		text: 'Макет',
		type_id: 12,
	},
	1201: {
		value: 1201,
		text: 'Утверждено',
		type_id: 12,
	},
	1202: {
		value: 1202,
		text: 'Прибыл',
		type_id: 12,
	},
	122: {
		value: 122,
		text: 'Приемка',
		type_id: 12,
	},
	123: {
		value: 123,
		text: 'Приемка',
		type_id: 12,
	},
	124: {
		value: 124,
		text: 'Оприходовано',
		type_id: 12,
	},
	134: {
		value: 134,
		text: 'Оприходовано',
		type_id: 13,
	},
	220: {
		value: 220,
		text: 'Отменено',
		type_id: 22,
	},
	221: {
		value: 221,
		text: 'Макет',
		type_id: 22,
	},
	222: {
		value: 222,
		text: 'Утверждено',
		type_id: 22,
	},
} as const;
export type TStatus = TObjectKeys<typeof statuses>;

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

export interface IItemResponse extends IListItem {
	date_arrive: string | null;
	date_reception_begin: string | null;
	parent_id: IListItem['id'] | null;
	items: IProductListItem[];
}
export interface IItem
	extends Omit<
		IItemResponse,
		| 'doc_id'
		| 'date_create'
		| 'date_status'
		| 'date_arrive'
		| 'date_reception_begin'
		| 'type_name'
	> {
	date_create: Date | null;
	date_status: Date | null;
	date_arrive: Date | null;
	date_reception_begin: Date | null;
}
export interface IProductListItem {
	item_id: string;
	name: string;
	quantity: number;
	price_nds: number;
	sum_nds: number;
}
export interface IAdditional {
	[key: IProductListItem['item_id']]: {
		item_id: IProductListItem['item_id'];
		qty: number;
		qty_orig: number;
		qty_defect: number;
		vas: null;
		qty_b: number;
	};
}
export function getDefaultForm(): IItem {
	return {
		id: '',
		date_create: null,
		date_status: null,
		date_arrive: null,
		date_reception_begin: null,
		type_id: 12,
		status: 222,
		parent_id: null,
		items: [],
	};
}
