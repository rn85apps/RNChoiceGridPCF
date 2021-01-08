import * as React from "react";
import { SpinButton } from "@fluentui/react/lib/SpinButton";

interface IIncrementBoxProps {
	inputValue: number;
}

const IncrementBox: React.FunctionComponent<IIncrementBoxProps> = (props) => {
	const { inputValue } = props;

	const min = 0;
	const max = 100;
	const step = 1;

	console.log("rendering numebr box");

	const onSpinButtonIncrement = (value: string) => {
		if (Number(value) + step > 100) {
			return String(value);
		} else {
			return String(+value + step);
		}
	};

	const onSpinButtonDecrement = (value: string) => {
		if (Number(value) - step < 0) {
			return String(value);
		} else {
			return String(+value - step);
		}
	};

	const onSpinButtonValidate = (value: string) => {
		if (
			Number(value) > max ||
			Number(value) < min ||
			value.trim().length === 0 ||
			isNaN(+value)
		) {
			return "0";
		}

		return String(value);
	};

	const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		console.log(event.target.type);
	};

	return (
		<SpinButton
			value={inputValue ? inputValue.toString() : ""}
			min={min}
			max={max}
			onIncrement={onSpinButtonIncrement}
			onDecrement={onSpinButtonDecrement}
			onValidate={onSpinButtonValidate}
			incrementButtonAriaLabel={`Increase value by ${step}`}
			decrementButtonAriaLabel={`Decrease value by ${step}`}
			onBlur={onBlur}
		/>
	);
};

export default React.memo(IncrementBox);
