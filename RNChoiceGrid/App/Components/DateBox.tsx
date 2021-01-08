import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";
import { DatePicker, IDatePickerStrings } from "@fluentui/react/lib/DatePicker";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";

//////////////////////////////////////////////////////////////////////
// Configuration of Fluent UI DatePicker
//////////////////////////////////////////////////////////////////////

const DayPickerStrings: IDatePickerStrings = {
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],

	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],

	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	],

	shortDays: ["S", "M", "T", "W", "T", "F", "S"],

	goToToday: "Go to today",
	prevMonthAriaLabel: "Go to previous month",
	nextMonthAriaLabel: "Go to next month",
	prevYearAriaLabel: "Go to previous year",
	nextYearAriaLabel: "Go to next year",
	closeButtonAriaLabel: "Close date picker",
	monthPickerHeaderAriaLabel: "{0}, select to change the year",
	yearPickerHeaderAriaLabel: "{0}, select to change the month",
};

const onFormatDate = (date?: Date): string => {
	return !date
		? ""
		: date.getMonth() +
				1 +
				"/" +
				date.getDate() +
				"/" +
				(date.getFullYear() % 100);
};

//////////////////////////////////////////////////////////////////////
// Date Picker
//////////////////////////////////////////////////////////////////////

interface IDateBoxProps {
	inputValue?: Date;
	onSelectDate: (date: Date | null | undefined) => void;
}

const DateBox: React.FC<IDateBoxProps> = (props) => {
	const { inputValue, onSelectDate } = props;

	return (
		<>
			<DatePicker
				isRequired={false}
				allowTextInput={false}
				strings={DayPickerStrings}
				value={inputValue!}
				ariaLabel={"Select a date"}
				placeholder="Select a date..."
				onSelectDate={onSelectDate}
				formatDate={onFormatDate}
			/>
		</>
	);
};

export default React.memo(DateBox);
