import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { useOptions } from "./Hooks/useOptions";
import Row from "./Components/Row";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { DefaultButton } from "@fluentui/react/lib/Button";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

initializeIcons();

export interface IProps {
	context: ComponentFramework.Context<IInputs>;
	columns: DataSetInterfaces.Column[];
	target: string;
	requireInputForOption: number | null;
	isDisabled: boolean;
}

//////////////////////////////
// Styling
//////////////////////////////

export const App: React.FC<IProps> = (props) => {
	// destructure the props
	const { context, columns, target, requireInputForOption, isDisabled } = props;

	/** custom hook for option set metadata */
	const { options, requiredOption } = useOptions({
		columnName: columns[1].name,
		target,
		utils: context.utils,
		requireInputForOption,
	});

	const inputValueType = context.parameters.dataset.columns[2].dataType;
	const [isDateUserLocal, setIsDateUserLocal] = React.useState<boolean>();
	//const [targetMetadata, setTargetMetadata] = React.useState<ComponentFramework.PropertyHelper.EntityMetadata>();

	React.useEffect(
		() => {
			let cancel = false;

			if (inputValueType !== "DateAndTime.DateOnly") {
				if (!cancel) {
					setIsDateUserLocal(false);
				}
			}

			if (inputValueType === "DateAndTime.DateOnly") {
				getInputFieldMetadata();
			}

			async function getInputFieldMetadata() {
				try {
					const inputColumn = columns[2].name;
					const response = await context.utils.getEntityMetadata(
						target,
						[inputColumn]
					);

					const data = response.Attributes.get(inputColumn);

					const dateBehavior = data.attributeDescriptor.Behavior;

					// BEHAVIOR
					// User Local 				= 1 --- will need to be converted to a local date on inbound
					// DateOnly					= 2 --- will need to be manually converted to a UTC string format on outbound
					// Time Zone Independent 	= 3 --- will need to be manually converted to a UTC string format on outbound

					if (!cancel) {
						if (dateBehavior === 1) {
							setIsDateUserLocal(true);
						} else {
							setIsDateUserLocal(false);
						}
					}
				} catch (error) {
					console.log(error.message);
				}
			}

			return () => {
				// Side effect cleanup function will run when
				// 1. The component unmounts
				// 2. The dependent property for the effect changes
				cancel = true;
			};
		},
		[
			// the side effect will run on the first render only
			// because this empty array is passed through with no dependent properties added
		]
	);

	let recordIds = context.parameters.dataset.sortedRecordIds;
	const totalResultCount = context.parameters.dataset.paging.totalResultCount;

	////////////////////////////////////////////////////////////
	//  RENDERING
	////////////////////////////////////////////////////////////

	if (context.parameters.dataset.loading) {
		return <>Loading ...</>;
	}

	if (!options.length) {
		return <>Getting option set options...</>;
	}

	if (typeof isDateUserLocal === "undefined") {
		return <>Getting metadata...</>;
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
								isDateUserLocal={isDateUserLocal}
								options={options}
								columns={columns}
								key={recordId}
								target={target}
								choiceRequiresInput={requiredOption}
								isDisabled={isDisabled}
							/>
						))}
					</tbody>
				</table>
			</div>
			<div>
				{recordIds.length} of {totalResultCount} records loaded
			</div>
			<div>
				{context.parameters.dataset.paging.hasNextPage && (
					<DefaultButton
						text="Load more"
						onClick={() =>
							context.parameters.dataset.paging.loadNextPage()
						}
					/>
				)}
			</div>
		</>
	);
};

export default App;
