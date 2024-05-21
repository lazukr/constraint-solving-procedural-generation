export type initialConditions = Array<[x: number, y: number, value: number]>;
export interface CellDomain {
	values: Set<number>;
	weights: Array<number>;
}
