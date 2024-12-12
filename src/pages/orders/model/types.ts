import type { IIdentified } from '@/shared/lib/types/object';
export interface IOrderItem {
	amount: number;
	orderDate: Date;
	deliveryDate: Date;
	deliveryType: string;
	fio: string;
	executorNumber: string;
	customerNumber: number | null;
}

export interface IOrderListItem
	extends Omit<IOrderItem, 'orderDate' | 'deliveryDate' | 'customerNumber'>,
		IIdentified {
	id: number;
	orderDate: string;
	deliveryDate: string;
	customerNumber: number;
}
