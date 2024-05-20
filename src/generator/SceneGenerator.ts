import { CellPropagator } from "./CellPropagator";
import { CellSelector } from "./CellSelector";
import { DimensionMapper } from "./DimensionMapper";
import { ModuleId } from "./Module";
import { ModuleSelector } from "./ModuleSelector";
import { ModuleConstraints, initialConditions } from "./types";

export class SceneGenerator {
	private readonly dimensionMapper: DimensionMapper;
	private readonly moduleConstraints: ModuleConstraints;
	private readonly cellPropagator: CellPropagator;
	private readonly cellSelector: CellSelector;
	private readonly moduleSelector: ModuleSelector;

	private readonly domainMap: Array<Set<number>>;
	private readonly collapsedMap: Array<number>;
	private readonly initialConditionsCount: number;

	private cellsInConsideration: number[];

	constructor(
		domain: Set<number>,
		dimensionMapper: DimensionMapper,
		initialConditions: initialConditions,
		moduleConstraints: ModuleConstraints,
		cellPropagator: CellPropagator,
		cellSelector: CellSelector,
		moduleSelector: ModuleSelector
	) {
		this.dimensionMapper = dimensionMapper;
		this.moduleConstraints = moduleConstraints;
		this.cellPropagator = cellPropagator;
		this.cellSelector = cellSelector;
		this.moduleSelector = moduleSelector;

		this.cellsInConsideration = [];
		this.domainMap = this.dimensionMapper.createProjection(domain);
		this.collapsedMap = this.dimensionMapper.createProjection(
			ModuleId.Undetermined
		);

		this.initialConditionsCount = this.setInitialConditions(initialConditions);
	}

	step(selectedCell: number, selectedModule: number): void {
		this.cellsInConsideration = this.cellsInConsideration.filter(
			(i) => i !== selectedCell
		);

		this.collapsedMap[selectedCell] = selectedModule;
		const validAdjacents = this.dimensionMapper
			.getAdjacents(selectedCell)
			.filter((adj) => this.collapsedMap[adj] === ModuleId.Undetermined);

		for (const adjacent of validAdjacents) {
			this.domainMap[adjacent] = this.cellPropagator.propagate(
				this.domainMap[adjacent],
				this.moduleConstraints[this.collapsedMap[selectedCell]]
			);

			this.cellsInConsideration.push(adjacent);
		}
	}

	generate(iterations?: number) {
		const maxIterations =
			this.dimensionMapper.maxIndexSize - this.initialConditionsCount;

		iterations = iterations ?? 0;
		const numGenerations = iterations === 0 ? maxIterations : iterations;

		for (let i = 0; i < numGenerations; i++) {
			const selectedCell: number = this.cellSelector.select(
				this.cellsInConsideration
			);
			const domain = this.domainMap[selectedCell];
			const selectedModule = this.moduleSelector.select(domain);
			this.step(selectedCell, selectedModule);
		}

		return this.dimensionMapper.liftProjection(this.collapsedMap);
	}

	private setInitialConditions(initialConditions: initialConditions): number {
		for (const [x, y, value] of initialConditions) {
			this.step(this.dimensionMapper.mapDownwards([x, y]), value);
		}

		return initialConditions.length;
	}
}
