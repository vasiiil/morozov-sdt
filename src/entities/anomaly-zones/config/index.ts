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
	'status'
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
