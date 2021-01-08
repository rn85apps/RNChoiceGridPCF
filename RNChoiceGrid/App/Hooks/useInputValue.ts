import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

type InputValue = string | Date | null | undefined;

export const useInputValue = (
	context: ComponentFramework.Context<IInputs>,
	recordId: string,
	columns: DataSetInterfaces.Column[],
	inputValueType: string
) => {
	const [inputValue, setInputValue] = React.useState<InputValue>(
		initialValue
	);

	/** Sets the initial state value for the input column */
	function initialValue() {
		let val;

		if (inputValueType === "DateAndTime.DateOnly") {
			const providedDate = context.parameters.dataset.records[
				recordId
			].getValue(columns[2].name);

			if (providedDate != null) {
				const newDate = new Date(providedDate as Date);
				val = newDate;
			} else {
				val = null;
			}
		}

		if (inputValueType === "DateAndTime.DateAndTime") {
			const providedDate = context.parameters.dataset.records[
				recordId
			].getValue(columns[2].name);

			if (providedDate != null) {
				const newDate = new Date(providedDate as Date);
				val = newDate;
			} else {
				val = null;
			}
		}

		if (inputValueType === "SingleLine.Text") {
			val = context.parameters.dataset.records[
				recordId
			].getFormattedValue(columns[2].name);
		}

		if (inputValueType === "Whole.None") {
			val = context.parameters.dataset.records[
				recordId
			].getFormattedValue(columns[2].name);
		}

		console.log(
			`${context.parameters.dataset.records[recordId].getFormattedValue(
				columns[0].name
			)} : ${val}`
		);

		return val;
	}

	/** Updates the state of the input value */
	function updateInputValue(newValue: InputValue) {
		setInputValue(newValue);
	}

	

	return { inputValue, updateInputValue };
};
