import * as React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";

interface IOptionSetProps {
	value: string;
	options: ComponentFramework.PropertyHelper.OptionMetadata[];
	onChange: (
		event: React.FormEvent<HTMLDivElement>,
		option?: IDropdownOption | undefined
	) => void;
	isDisabled: boolean;
}

type OptionSetItem = {
	key: number;
	text: string;
};

const OptionSet: React.FC<IOptionSetProps> = (props) => {
	const { value, options, onChange, isDisabled } = props;

	const opts: IDropdownOption[] = options.map((opt) => {
		const newOption: OptionSetItem = {
			key: opt.Value,
			text: opt.Label,
		};

		return newOption;
	});

	return (
		<Dropdown
			options={opts}
			placeholder="Select an option"
			selectedKey={
				value
					? opts[opts.map((opt) => opt.text).indexOf(value)].key
					: undefined
			}
			onChange={onChange}
			disabled={isDisabled}
		/>
	);
};

export default React.memo(OptionSet);
