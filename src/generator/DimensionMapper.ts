import * as math from "mathjs";

export class DimensionMapper {
	readonly maxIndexSize: number;

	private readonly dimensions: [number, number];
	private readonly adjacents: [number, number][];

	constructor([x, y]: [number, number]) {
		this.dimensions = [x, y];
		this.maxIndexSize = x * y;
		this.adjacents = [
			[-1, 0],
			[1, 0],
			[0, 1],
			[0, -1],
		];
	}

	createProjection<T>(initializedValues: T): T[] {
		return Array.from({ length: this.maxIndexSize }, () => initializedValues);
	}

	liftProjection<T>(indices: Array<T>): T[][] {
		if (indices.length !== this.maxIndexSize) {
			throw new Error(
				"This projection does not match the original dimension size."
			);
		}

		const result = Array.from({ length: this.dimensions[0] }, () =>
			Array(this.dimensions[1]).fill(null)
		);

		for (let i = 0; i < indices.length; i++) {
			const [x, y] = this.mapUpwards(i);
			result[y][x] = indices[i];
		}
		return result;
	}

	/**
	 * maps from a higher dimesion down to a linear one for storing
	 * @param [x,y] pair for the dimension
	 * @returns index equivalent in one dimension
	 */
	mapDownwards([x, y]: [number, number]): number {
		return x + y * this.dimensions[1];
	}

	/**
	 * maps from a lower dimension back up to the original higher dimension
	 * @param index the lower dimension index value
	 */
	mapUpwards(index: number): [number, number] {
		return [index % this.dimensions[1], math.floor(index / this.dimensions[1])];
	}

	/**
	 * gets adjacent cells for the provided index
	 * @param index input index to get adjacent from
	 * @returns array of indices corresponding to the valid adjacent cells
	 */
	getAdjacents(index: number): number[] {
		const [x, y]: [number, number] = this.mapUpwards(index);
		return this.adjacents
			.map(([dx, dy]) => [dx + x, dy + y]) // apply deltas
			.map((coord) => this.mapDownwards(coord as [number, number])) // map back to indices
			.filter((index) => this.isInBound(index)); // return only indices within bound
	}

	private isInBound(index: number): boolean {
		return index >= 0 || index < this.maxIndexSize;
	}
}
