import { Grid } from "./components/Grid";
import { IntersectionCellDomainPropagator } from "./generator/CellDomainPropagator";
import { RandomCellSelector } from "./generator/CellSelector";
import { DimensionMapper } from "./generator/DimensionMapper";
import { ModuleManager } from "./generator/ModuleManager";
import { RandomModuleSelector } from "./generator/ModuleSelector";
import { SceneGenerator } from "./generator/SceneGenerator";
import { initialConditions } from "./generator/types";

function App() {
	const size = 5;
	const x = 20;
	const y = 20;
	const domain = new Set([...Array(size).keys()].map((i) => i + 1));
	const initialConditions: initialConditions = [[2, 2, 2]];
	const dimensionMapper = new DimensionMapper([x, y]);
	const moduleManager = new ModuleManager(domain, {
		1: {
			values: new Set([1, 2]),
			weights: [0, 2, 1, 0, 0, 0],
		},
		2: {
			values: new Set([1, 2, 3]),
			weights: [0, 1, 2, 1, 0, 0],
		},
		3: {
			values: new Set([2, 3, 4]),
			weights: [0, 0, 1, 2, 1, 0],
		},
		4: {
			values: new Set([3, 4, 5]),
			weights: [0, 0, 0, 1, 2, 1],
		},
		5: {
			values: new Set([4, 5]),
			weights: [0, 0, 0, 0, 1, 2],
		},
	});

	const sceneGenerator = new SceneGenerator(
		domain,
		dimensionMapper,
		initialConditions,
		moduleManager,
		new IntersectionCellDomainPropagator(),
		new RandomCellSelector(),
		new RandomModuleSelector()
	);

	const result = sceneGenerator.generate(0);
	console.log(result);
	return <Grid scene={result} />;
}

export default App;
