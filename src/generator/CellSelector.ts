import * as math from "mathjs";

export interface CellSelector {
	select(cellConsiderationList: number[]): number;
}

export class RandomCellSelector implements CellSelector {
	select(cellConsiderationList: number[]): number {
		return math.pickRandom(cellConsiderationList);
	}
}
