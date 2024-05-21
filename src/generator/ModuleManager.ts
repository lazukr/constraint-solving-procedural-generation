import { CellDomain } from "./types";

export class ModuleManager {
	private readonly domain: Set<number>;
	readonly constraints: Record<number, CellDomain>;

	constructor(domain: Set<number>, constraints: Record<number, CellDomain>) {
		this.domain = domain;
		this.verifyConstraints(constraints);
		this.constraints = constraints;
	}

	private verifyConstraints(constraints: Record<number, CellDomain>) {
		const keys = Object.keys(constraints);

		for (const key of keys) {
			if (this.domain.has(parseInt(key)) === false) {
				throw new Error("constraint key does not exist in domain");
			}
		}

		const cellDomains = Object.values(constraints);

		for (const cellDomain of cellDomains) {
			const weights = cellDomain.weights;

			if (weights.length < this.domain.size + 1) {
				throw new Error("weights must be the same size as domain.");
			}

			const set = cellDomain.values.values();
			for (const value of set) {
				if (this.domain.has(value) === false) {
					throw new Error("cell domain module does not exist in domain");
				}
			}
		}
	}
}
