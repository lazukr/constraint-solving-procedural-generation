import * as math from "mathjs";
import { ModuleId } from "./Module";

export interface ModuleSelector {
	select(domain: Set<number>): number;
}

export class RandomModuleSelector implements ModuleSelector {
	select(domain: Set<number>): number {
		if (domain.size === 0) {
			return ModuleId.Invalid;
		}

		return math.pickRandom(Array.from(domain));
	}
}
