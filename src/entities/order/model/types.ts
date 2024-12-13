import type { IIdentified } from '@/shared/lib/types/object';
import type { OrderStatusTypes } from '@/entities/order-status';

export interface IListItem extends IIdentified {
	id: string;
	order_id: string;
	status: OrderStatusTypes.TId;
	status_name: OrderStatusTypes.IListItem['name'];
	date_status: string | null;
	date_create: string | null;
	date_ship: string | null;
	type: number;
	delivery_code: number | null;
	summ: number;
	customer_name_full: string;
	payment_type: number;
	final_date: string | null;
}

export type TSortFields =
	| 'order_id'
	| 'id'
	| 'date_create'
	| 'delivery_code'
	| 'summ'
	| 'date_status'
	| 'customer_name_full'
	| 'status';

export type TSort = {
	[P in keyof Pick<IListItem, TSortFields>]?: 'asc' | 'desc'
};
