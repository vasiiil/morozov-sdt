export interface IIdentified {
	id: string | number;
}

export type TObjectKeys<
	T extends Record<string, unknown> | Record<number, unknown>,
> = keyof T;
export type TObjectValues<
	T extends Record<string, unknown> | Record<number, unknown>,
> = T[TObjectKeys<T>];
