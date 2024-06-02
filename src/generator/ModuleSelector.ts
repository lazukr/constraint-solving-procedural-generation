import * as math from "mathjs";
import { ModuleId } from "./Module";
import { CellDomain } from "./types";

export interface ModuleSelector {
	select(domain: CellDomain): number;
}

export class RandomModuleSelector implements ModuleSelector {
	select(domain: CellDomain): number {
		if (domain.values.size === 0 || domain.values == null) {
			return ModuleId.Invalid;
		}

		const weights = Array.from(domain.values).map((v) => domain.weights[v]);
		return math.pickRandom(Array.from(domain.values), 1, weights)[0];
	}
}
