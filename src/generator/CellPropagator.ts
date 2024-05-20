export interface CellPropagator {
	propagate(
		existingDomain: Set<number>,
		incomingDomain: Set<number>
	): Set<number>;
}

export class IntersectionCellPropagator implements CellPropagator {
	propagate(
		existingDomain: Set<number>,
		incomingDomain: Set<number>
	): Set<number> {
		if (incomingDomain == null) {
			return existingDomain;
		}

		return new Set([...existingDomain].filter((e) => incomingDomain.has(e)));
	}
}
