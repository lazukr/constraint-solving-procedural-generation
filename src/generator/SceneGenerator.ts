import { CellDomainPropagator } from "./CellDomainPropagator";
import { CellSelector } from "./CellSelector";
import { DimensionMapper } from "./DimensionMapper";
import { ModuleId } from "./Module";
import { ModuleManager } from "./ModuleManager";
import { ModuleSelector } from "./ModuleSelector";
import { CellDomain, initialConditions } from "./types";

export class SceneGenerator {
	private readonly dimensionMapper: DimensionMapper;
	private readonly cellSelector: CellSelector;
	private readonly moduleSelector: ModuleSelector;
	private readonly moduleManager: ModuleManager;
	private readonly cellDomainPropagator: CellDomainPropagator;

	private readonly cellDomainMap: Array<CellDomain>;
	private readonly collapsedMap: Array<number>;

	private readonly initialConditionsCount: number;

	private cellsInConsideration: number[];

	constructor(
		domain: Set<number>,
		dimensionMapper: DimensionMapper,
		initialConditions: initialConditions,
		moduleManager: ModuleManager,
		cellDomainPropagator: CellDomainPropagator,
		cellSelector: CellSelector,
		moduleSelector: ModuleSelector
	) {
		this.dimensionMapper = dimensionMapper;
		this.cellSelector = cellSelector;
		this.moduleSelector = moduleSelector;
		this.cellDomainPropagator = cellDomainPropagator;
		this.moduleManager = moduleManager;

		this.cellsInConsideration = [];
		this.collapsedMap = this.dimensionMapper.createProjection(
			ModuleId.Undetermined
		);
		this.cellDomainMap = this.dimensionMapper.createProjection({
			values: domain,
			weights: Array(domain.size + 1).fill(0),
		});

		this.initialConditionsCount = this.setInitialConditions(initialConditions);
	}

	step(selectedCell: number, selectedModule: number): void {
		this.cellsInConsideration = this.cellsInConsideration.filter(
			(i) => i !== selectedCell
		);

		this.collapsedMap[selectedCell] = selectedModule;

		// do not propagate if selected module is invalid
		if (selectedModule === ModuleId.Invalid) {
			return;
		}

		const validAdjacents = this.dimensionMapper
			.getAdjacents(selectedCell)
			.filter((adj) => this.collapsedMap[adj] === ModuleId.Undetermined);

		for (const adjacent of validAdjacents) {
			this.cellDomainMap[adjacent] = this.cellDomainPropagator.propagate(
				this.cellDomainMap[adjacent],
				this.moduleManager.constraints[this.collapsedMap[selectedCell]]
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

			const domain = this.cellDomainMap[selectedCell];
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
