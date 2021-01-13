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
	isDateUserLocal: boolean;
	target: string;
	choiceRequiresInput: ComponentFramework.PropertyHelper.OptionMetadata | null;
	isDisabled: boolean;
}

const Row: React.FunctionComponent<IRowProps> = ({
	context,
	options,
	columns,
	recordId,
	inputValueType,
	isDateUserLocal,
	target,
	choiceRequiresInput,
	isDisabled,
}: IRowProps) => {
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
		inputValueType,
		isDateUserLocal
	);

	/** determines if the save button should be enabled or disabled */
	const enableSave = setEnableSave(
		inputValue,
		optionSetValue,
		choiceRequiresInput
	);

	/** event handler for option set changes */
	const onOptionSetChange = React.useCallback(
		(
			event: React.FormEvent<HTMLDivElement>,
			option: IDropdownOption | undefined
		) => {
			const selectedOptionKey = option ? option.key : undefined;

			if (typeof selectedOptionKey === "number") {
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
	const onInputDateBoxChange = React.useCallback(
		(date: Date | null | undefined) => {
			if (isDisabled) {
				return;
			}

			updateInputValue(date);

			if (!isDirty) {
				setIsDirty(true);
			}
		},
		[updateInputValue, isDirty, isDisabled]
	);

	/** event handler for TextBox or NumberBox changes */
	const onInputTextBoxChange = React.useCallback(
		(
			event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			newValue?: string | undefined
		) => {
			if (isDisabled) {
				return;
			}
			updateInputValue(newValue || "");
			if (!isDirty) {
				setIsDirty(true);
			}
		},
		[updateInputValue, isDirty, isDisabled]
	);

	/** event handler for save button.  uses PCF web API */
	const onSave = () => {
		if (isDisabled) {
			return;
		}

		async function executeUpdate() {
			try {
				const optionIndex = options
					.map((option) => option.Label)
					.indexOf(optionSetValue);

				const optVal = options[optionIndex].Value;

				const isDateOnlyNotLocal =
					inputValueType === "DateAndTime.DateOnly" &&
					!isDateUserLocal;

				const inpVal = !isDateOnlyNotLocal
					? inputValue
					: context.formatting.formatDateAsFilterStringInUTC(
							inputValue as Date
					  );

				const data = {
					[columns[1].name]: optVal,
					[columns[2].name]: inpVal,
				};

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

	/** Event handler for clicking the display name */
	const onDisplayNameClick = () => {
		const entityReference = context.parameters.dataset.records[
			recordId
		].getNamedReference();
		context.parameters.dataset.openDatasetItem(entityReference);
	};

	const displayName = context.parameters.dataset.records[
		recordId
	].getFormattedValue(columns[0].name);

	return (
		<>
			<tr>
				<td>
					<span
						className="rn-display-name"
						title={displayName}
						onClick={onDisplayNameClick}
					>
						{displayName}
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
							onSelectDate={onInputDateBoxChange}
						/>
					)}
					{inputValueType === "DateAndTime.DateAndTime" && (
						<DateBox
							inputValue={inputValue as Date}
							onSelectDate={onInputDateBoxChange}
						/>
					)}
					{inputValueType === "SingleLine.Text" && (
						<TextBox
							inputValue={inputValue as string}
							onChange={onInputTextBoxChange}
						/>
					)}
					{inputValueType === "Whole.None" && (
						<NumberBox
							inputValue={inputValue as string}
							onChange={onInputTextBoxChange}
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

/** Determines if the save button should be enabled. */
function setEnableSave(
	inputValue: string | Date | null | undefined,
	optionSetValue: string,
	choiceRequiresInput: ComponentFramework.PropertyHelper.OptionMetadata | null
) {
	const inputValueEmptyString =
		typeof inputValue === "string" && inputValue.trim() === "";

	const inputValueContainsData =
		inputValueEmptyString || inputValue === null || inputValue === undefined
			? false
			: true;

	// never enable save if the optionset value is blank.
	// if the selected choice requires an input, don't enable save if there is no input value;
	// otherwise, enable save.
	const enableSave = !optionSetValue
		? false
		: choiceRequiresInput != null &&
		  choiceRequiresInput.Label === optionSetValue
		? inputValueContainsData
		: true;
	return enableSave;
}
