import { Grid } from "./components/Grid";
import { IntersectionCellPropagator } from "./generator/CellPropagator";
import { RandomCellSelector } from "./generator/CellSelector";
import { DimensionMapper } from "./generator/DimensionMapper";
import { RandomModuleSelector } from "./generator/ModuleSelector";
import { SceneGenerator } from "./generator/SceneGenerator";
import { initialConditions } from "./generator/types";

function App() {
	const size = 5;
	const x = 4;
	const y = 4;
	const domain = new Set([...Array(size).keys()].map((i) => i + 1));
	const moduleConstraints = {
		1: new Set([1, 2]),
		2: new Set([1, 2, 3]),
		3: new Set([2, 3, 4]),
		4: new Set([3, 4, 5]),
		5: new Set([4, 5]),
	};

	const initialConditions: initialConditions = [[2, 2, 2]];

	const dimensionMapper = new DimensionMapper([x, y]);
	const sceneGenerator = new SceneGenerator(
		domain,
		dimensionMapper,
		initialConditions,
		moduleConstraints,
		new IntersectionCellPropagator(),
		new RandomCellSelector(),
		new RandomModuleSelector()
	);

	const result = sceneGenerator.generate(0);
	console.log(result);
	return <Grid scene={result} />;
}

export default App;
