import type { IIdentified } from '@/shared/lib/types/object';
import type { OrderStatusTypes } from '@/entities/order-status';
import type { DeliveryTypeTypes } from '@/entities/delivery-types';

export type TOrderId = string;
export interface IListItem extends IIdentified {
	id: string;
	order_id: TOrderId;
	status: OrderStatusTypes.TId;
	date_status: string | null;
	date_create: string | null;
	date_ship: string | null;
	type: DeliveryTypeTypes.TId;
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

export type TFilterFields =
	| 'order_id'
	| 'id'
	| 'date_create'
	| 'delivery_code'
	| 'summ'
	| 'date_status'
	| 'date_ship'
	| 'customer_name_full'
	| 'type'
	| 'status';

export type TFilter = {
	[P in keyof Pick<IListItem, TFilterFields>]?: string | number;
};

export type TDxDataGridFilters = {
	order_id?: string;
	id?: string;
	date_create?: Date | [Date, Date];
	delivery_code?: string;
	summ: number;
	date_status?: Date | [Date, Date];
	date_ship?: Date | [Date, Date];
	customer_name_full?: string;
	type: DeliveryTypeTypes.TId;
	status: OrderStatusTypes.TId | OrderStatusTypes.TId[];
};

export interface ICustomer {
	lastname: string;
	firstname: string;
	middlename: string;
	phone: string;
	phone2: string;
	email: string;
	company?: string;
	inn?: string;
	address?: string;
	bank?: string;
	r_s?: string;
	bik?: string;
	k_s?: string;
}

export interface IItem {
	order_id: string;
	id: string;
	date_create: string;
	status: OrderStatusTypes.TId;
	substatus_name: string | null;
	date_status: string;
	order_sum: number;
	payment_type: number;
}
