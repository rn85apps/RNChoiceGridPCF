import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

export type InputValue = string | Date | null | undefined;

export const useInputValue = (
	context: ComponentFramework.Context<IInputs>,
	recordId: string,
	columns: DataSetInterfaces.Column[],
	inputValueType: string,
	isDateUserLocal: boolean
) => {
	const [inputValue, setInputValue] = React.useState<InputValue>(
		initialValue
	);

	/** Sets the initial state value for the input column */
	function initialValue() {
		let val;

		if (inputValueType === "DateAndTime.DateOnly") {
			// the formatted date string provided by the PCF is in CDS UTC time
			const dateValue = context.parameters.dataset.records[
				recordId
			].getValue(columns[2].name);

			if (dateValue != null && typeof dateValue === "string") {
				// first, create a new date object
				const localDate = new Date(dateValue);
				// next, convert the date object to the local date accounting for timezone offset
				const convertedDate = convertDate(localDate);
				val = convertedDate;
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

		return val;
	}

	/** Updates the state of the input value */
	function updateInputValue(newValue: InputValue) {
		setInputValue(newValue);
	}

	////////////////////////////////////////////////////////////////////////////
	//// HANDLING DATE VALUES FOR DATE ONLY FIELDS
	////////////////////////////////////////////////////////////////////////////

	// see https://develop1.net/public/post/2020/05/11/pcf-datetimes-the-saga-continues

	/** helper function to converting to the local date */
	function convertDate(value: Date) {
		const offsetMinutes = context.userSettings.getTimeZoneOffsetMinutes(
			value
		);
		const localDate = addMinutes(value, offsetMinutes);
		return getUtcDate(localDate);
	}

	/** helper function for converting to the local date */
	function addMinutes(date: Date, minutes: number): Date {
		return new Date(date.getTime() + minutes * 60000);
	}

	/**  helper function for handling the conversion of dates */
	function getUtcDate(localDate: Date) {
		return new Date(
			localDate.getUTCFullYear(),
			localDate.getUTCMonth(),
			localDate.getUTCDate(),
			localDate.getUTCHours(),
			localDate.getUTCMinutes()
		);
	}

	return { inputValue, updateInputValue };
};
