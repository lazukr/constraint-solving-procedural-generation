import { CellDomain } from "./types";

export interface CellDomainPropagator {
	propagate(
		existingCellDomain: CellDomain,
		incomingCellDomain: CellDomain
	): CellDomain;
}

export class IntersectionCellDomainPropagator implements CellDomainPropagator {
	propagate(
		existingCellDomain: CellDomain,
		incomingCellDomain: CellDomain
	): CellDomain {
		if (incomingCellDomain == null || incomingCellDomain.values.size === 0) {
			return existingCellDomain;
		}

		const newValues = new Set(
			[...existingCellDomain.values].filter((e) =>
				incomingCellDomain.values.has(e)
			)
		);

		const newWeights = existingCellDomain.weights.map(
			(e, i) => e + incomingCellDomain.weights[i]
		);

		return {
			values: newValues,
			weights: newWeights,
		};
	}
}
