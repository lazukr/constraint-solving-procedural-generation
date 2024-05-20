interface GridProps {
	scene: number[][];
}

export function Grid({ scene }: GridProps) {
	return (
		<table>
			<tbody>
				{scene.map((row, rindex) => {
					return (
						<tr key={rindex}>
							{row.map((col, cindex) => {
								return <td key={cindex}>{col}</td>;
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
