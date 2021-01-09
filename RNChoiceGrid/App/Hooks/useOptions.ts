import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";

interface IUseOptions {
	columnName: string;
	target: string;
	utils: ComponentFramework.Utility;
	requireInputForOption: number | null;
}

export const useOptions = ({
	columnName,
	target,
	utils,
	requireInputForOption
}: IUseOptions): {
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    requiredOption: ComponentFramework.PropertyHelper.OptionMetadata | null;
} => {
	const [options, setOptions] = React.useState<
		Array<ComponentFramework.PropertyHelper.OptionMetadata>
	>([]);

	const [
		requiredOption,
		setRequiredOption,
	] = React.useState<ComponentFramework.PropertyHelper.OptionMetadata | null>(
		null
	);

	/**
	 * Side effect that manages the state of the optionset metadata consumed by the component
	 */
	React.useEffect(() => {
		let cancel = false;

		console.log("executing retrieve options metadata");

		async function executeRetrieveMetadata() {
			try {
				const response = await utils.getEntityMetadata(target, [
					columnName,
				]);
				const data: ComponentFramework.PropertyHelper.OptionMetadata[] = response.Attributes.get(
					columnName
				)?.attributeDescriptor.OptionSet;

				console.table(data);

				if (!cancel) {
					setOptions(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		}

		executeRetrieveMetadata();

		return () => {
			console.log("Cleaning up useOptions side effect");
			// Side effect cleanup function will run when
			// 1. The component unmounts
			// 2. The dependent property for the effect changes
			cancel = true;
		};
	}, [columnName, target, utils]);


	/**
	 * Side effect that manages the state of the option that requires an input, if configured.
	 */
	React.useEffect(() => {
		let cancel = false;

		const option = () => {
			if (requireInputForOption && requireInputForOption != null) {
				const index = options
					.map((option) => option.Value)
					.indexOf(requireInputForOption);
				return options[index];
			}

			return null;
		};

		if (!cancel) {
			setRequiredOption(option);
		}

		return () => {
			cancel = true;
		};
	}, [options, requireInputForOption]);

	return {options, requiredOption};
};
