import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

type InputValue = string | Date | null | undefined;

export const useOptionSetValue = (
	context: ComponentFramework.Context<IInputs>,
	recordId: string,
	columns: DataSetInterfaces.Column[]
) => {
	/** Stote of the option set value */
	const [optionSetValue, setOptionSetValue] = React.useState(initialValue);

	/** Sets the initial state value for the option set column */
	function initialValue() {
		const val = context.parameters.dataset.records[
			recordId
		].getFormattedValue(columns[1].name);
		return val ? val : "";
	}

	/** Updates the state of the option set*/
	function updateOptionSetValue(newValue: string) {
		setOptionSetValue(newValue);
	}

	return { optionSetValue, updateOptionSetValue };
};
