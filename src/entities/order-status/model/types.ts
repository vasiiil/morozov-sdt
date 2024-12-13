import type { IIdentified } from '@/shared/lib/types/object';

export type TId = number;
export interface IListItem extends IIdentified {
	id: TId;
	name: string;
}
