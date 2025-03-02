import type { TObjectKeys } from '@/shared/lib/types/object';

export const types = {
	2: 'Отгрузка со склада',
	4: 'ТОРГ-2 недостача',
	8: 'ТОРГ-2 брак',
	12: 'Поставка на склад',
	13: 'Возврат',
	22: 'Заявка на возврат',
} as const;
export type TType = TObjectKeys<typeof types>;
export const statuses = {
	20: '20: Отменено',
	21: '21: Макет',
	26: '26: В комплектации',
	22: '22: Собрано',
	23: '23: Отгружено',
	24: '24: Отгружено',
	42: '42: Оприходовано',
	82: '82: Оприходовано',
	120: '120: Отменено',
	121: '121: Макет',
	1201: '1201: Утверждено',
	1202: '1202: Прибыл',
	122: '122: Приемка',
	123: '123: Приемка',
	124: '124: Оприходовано',
	134: '134: Оприходовано ',
	220: '220: Отменено',
	221: '221: Макет',
	222: '222: Утверждено',
} as const;
export type TStatus = TObjectKeys<typeof statuses>;

export interface IListItem {
	doc_id: string;
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
