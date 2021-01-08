import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { useOptions } from "./Hooks/useOptions";
import Row from "./Components/Row";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { useInputValue } from "./Hooks/useInputValue";

initializeIcons();

export interface IProps {
	context: ComponentFramework.Context<IInputs>;
	columns: DataSetInterfaces.Column[];
	target: string;
}

//////////////////////////////
// Styling
//////////////////////////////

export const App: React.FC<IProps> = (props) => {
	// destructure the props
	const { context, columns, target } = props;

	/** custom hook for option set metadata */
	const options = useOptions({
		columnName: columns[1].name,
		target,
		utils: context.utils,
	});

	/** memomized value of the input column's datatype */
	const inputValueType = React.useMemo(() => {
		return context.parameters.dataset.columns[2].dataType;
	}, [context.parameters.dataset.columns]);

	const recordIds = context.parameters.dataset.sortedRecordIds;

	console.log("rendering App");

	if (context.parameters.dataset.loading) {
		return <>Loading ...</>;
	}

	if (!options.length) {
		return <>Getting option set options...</>;
	}

	return (
		<>
			<div className="rn-grid">
				<table>
					<thead>
						<tr>
							<>
								{columns.map((col) => (
									<th key={col.name}>{col.displayName}</th>
								))}
							</>
						</tr>
					</thead>
					<tbody>
						{recordIds.map((recordId) => (
							<Row
								context={context}
								recordId={recordId}
								inputValueType={inputValueType}
								options={options}
								columns={columns}
								key={recordId}
								target={target}
							/>
						))}
					</tbody>
				</table>
			</div>
			<div>{context.parameters.dataset.paging.totalResultCount}</div>
		</>
	);
};

export default App;
