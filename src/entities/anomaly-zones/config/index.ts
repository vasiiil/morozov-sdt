import type { AnomalyStatusTypes } from '@/entities/anomaly-statuses';

export interface IListItem {
	anomaly_id: number;
	doc_id: number;
	date_create: string | null;
	waybill_id: string;
	task_id: number | null;
	status: AnomalyStatusTypes.IListItem['id'];
	date_final_status: string | null;
	purpose: number | null;
}

export type TFilterFields =
	| 'status'
	| 'anomaly_id'
	| 'doc_id'
	| 'task_id'
	| 'waybill_id';

export type TFilter = {
	[P in keyof Pick<IListItem, TFilterFields>]?: string | number;
};

export type TDxDataGridFilters = {
	status: AnomalyStatusTypes.TId;
	anomaly_id?: IListItem['anomaly_id'];
	doc_id?: IListItem['doc_id'];
	task_id?: Exclude<IListItem['task_id'], null>;
	waybill_id?: IListItem['waybill_id'];
};

export interface ICardProductListItem {
	item_id: number;
	barcode: string[];
	cnt: number;
	photos: string[];
	comment: string;
	prod_name: string | null;
}
export interface IItem {
	doc_id: number;
	date_create: Date | null;
	date_final_status: Date | null;
	task_id: number;
	status: AnomalyStatusTypes.TId;
	purpose: number;
	wb_box: unknown;
	items: ICardProductListItem[];
}

export interface IItemResponse
	extends Omit<IItem, 'date_create' | 'date_final_status'> {
	date_create: string;
	date_final_status: string | null;
}
