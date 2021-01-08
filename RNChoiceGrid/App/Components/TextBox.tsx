import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";

//////////////////////////////////////////////////////////////////////
// Configuration of Fluent UI Text Field
//////////////////////////////////////////////////////////////////////

type ITextBoxProps = {
	inputValue: string;
	onChange: (
		e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string
	) => void;
};

const TextBox: React.FC<ITextBoxProps> = (ITextBoxProps) => {
	const { inputValue, onChange } = ITextBoxProps;

	return (
		<>
			<TextField value={inputValue} onChange={onChange} />
		</>
	);
};

export default React.memo(TextBox);
