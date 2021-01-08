import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import DateBox from "./DateBox";
import OptionSet from "./OptionSet";
import TextBox from "./TextBox";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import NumberBox from "./NumberBox";
import { useInputValue } from "../Hooks/useInputValue";
import { useOptionSetValue } from "../Hooks/useOptionSetValue";
import { DefaultButton } from "@fluentui/react/lib/Button";

interface IRowProps {
	context: ComponentFramework.Context<IInputs>;
	options: ComponentFramework.PropertyHelper.OptionMetadata[];
	columns: DataSetInterfaces.Column[];
	recordId: string;
	inputValueType: string;
	target: string;
}

const Row: React.FunctionComponent<IRowProps> = (props) => {
	const {
		context,
		options,
		columns,
		recordId,
		inputValueType,
		target,
	} = props;

	/** The state of the row.  If dirty, the save should appear. */
	const [isDirty, setIsDirty] = React.useState<boolean>(false);

	/**  Custom hook for managing the option set column state*/
	const { optionSetValue, updateOptionSetValue } = useOptionSetValue(
		context,
		recordId,
		columns
	);

	/**  Custom hook for managing the input value column state*/
	const { inputValue, updateInputValue } = useInputValue(
		context,
		recordId,
		columns,
		inputValueType
	);

	/** event handler for option set changes */
	const onOptionSetChange = React.useCallback(
		(
			event: React.FormEvent<HTMLDivElement>,
			option: IDropdownOption | undefined
		) => {
			const selectedOptionKey = option ? option.key : undefined;

			if (typeof selectedOptionKey === "number") {
				console.log(selectedOptionKey);
				const optIndex = options
					.map((opt) => opt.Value)
					.indexOf(selectedOptionKey);
				const optValue = options[optIndex].Label;
				updateOptionSetValue(optValue);
				setIsDirty(true);
			} else {
				console.log(
					`Expecting a number value for option set.  Received ${option?.key}`
				);
			}
		},
		[options, updateOptionSetValue]
	);

	/** event handler for date input changes */
	const onSelectDate = React.useCallback(
		(date: Date | null | undefined) => {
			updateInputValue(date);
			setIsDirty(true);
		},
		[updateInputValue]
	);

	/** event handler for TextBox or NumberBox changes */
	const onInputChange = React.useCallback(
		(
			event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			newValue?: string | undefined
		) => {
			updateInputValue(newValue || "");
			if (!isDirty) {
				setIsDirty(true);
			}
		},
		[updateInputValue, isDirty]
	);

	/** event handler for save button.  uses PCF web API */
	const onSave = () => {
		console.log("Saving with WebAPI");

		async function executeUpdate() {
			try {
				const optionIndex = options
					.map((option) => option.Label)
					.indexOf(optionSetValue);

				const option = options[optionIndex];

				const data = {
					[columns[1].name]: option.Value,
					[columns[2].name]: inputValue,
				};

				console.log("webAPI data", data);

				const response = await context.webAPI.updateRecord(
					target,
					recordId,
					data
				);

				if (!response) {
					throw new Error("WebAPI update not successful.");
				}

				setIsDirty(false);
			} catch (error) {
				alert(error.message);
				console.log(error.message);
			}
		}

		executeUpdate();
	};

	const inputValueBlank = () => {
		if (typeof inputValue === "string") {
			return !!inputValue.trim();
		} else {
			return !!inputValue;
		}
	};

	const enableSave = !!optionSetValue && inputValueBlank();

	return (
		<>
			<tr>
				<td>
					<span>
						{context.parameters.dataset.records[
							recordId
						].getFormattedValue(columns[0].name)}
					</span>
				</td>
				<td>
					<OptionSet
						value={optionSetValue}
						options={options}
						onChange={onOptionSetChange}
					/>
				</td>
				<td>
					{inputValueType === "DateAndTime.DateOnly" && (
						<DateBox
							inputValue={inputValue as Date}
							onSelectDate={onSelectDate}
						/>
					)}
					{inputValueType === "DateAndTime.DateAndTime" && (
						<DateBox
							inputValue={inputValue as Date}
							onSelectDate={onSelectDate}
						/>
					)}
					{inputValueType === "SingleLine.Text" && (
						<TextBox
							inputValue={inputValue as string}
							onChange={onInputChange}
						/>
					)}
					{inputValueType === "Whole.None" && (
						<NumberBox
							inputValue={inputValue as string}
							onChange={onInputChange}
						/>
					)}
				</td>
			</tr>
			{isDirty && (
				<tr>
					<td>
						<span className="rn-unsaved-changes-msg">
							Unsaved changes
						</span>
					</td>
					<td></td>
					<td>
						<DefaultButton
							text="Save"
							onClick={onSave}
							disabled={!enableSave}
						/>
					</td>
				</tr>
			)}
		</>
	);
};

export default React.memo(Row);
