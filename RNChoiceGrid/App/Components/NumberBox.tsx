import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";

//////////////////////////////////////////////////////////////////////
// Configuration of Fluent UI TextField
//////////////////////////////////////////////////////////////////////

const isANumber = (n: string) => {
	var numStr = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;
	return numStr.test(n.toString());
};

const getErrorMessage = (value: string): string => {
	const validNumber = isANumber(value);
	return validNumber ? `` : `Value must be numeric.`;
};

//////////////////////////////////////////////////////////////////////
//  Rendering of Fluent UI TextField
//////////////////////////////////////////////////////////////////////

interface INumberBoxProps {
	inputValue: string;
	onChange: (
		e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string
	) => void;
	isDisabled: boolean;
}

const NumberBox: React.FC<INumberBoxProps> = (props) => {
	const { inputValue, onChange, isDisabled } = props;

	return (
		<TextField
			value={inputValue ? inputValue : ""}
			onGetErrorMessage={getErrorMessage}
			onChange={onChange}
			placeholder={"Please enter a value"}
			disabled={isDisabled}
		/>
	);
};

export default NumberBox;
