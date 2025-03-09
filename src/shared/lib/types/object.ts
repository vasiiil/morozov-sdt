export interface IIdentified {
	id: string | number;
}

export type TObjectKeys<
	T extends Record<string, unknown> | Record<number, unknown>,
> = keyof T;
export type TObjectValues<
	T extends Record<string, unknown> | Record<number, unknown>,
> = T[TObjectKeys<T>];

type TPrimitive = string | null | number | boolean;
export type TPrimitiveRecord = {
	[key: string]:
		| TPrimitive
		| TPrimitive[]
		| TPrimitiveRecord
		| TPrimitiveRecord[];
};
