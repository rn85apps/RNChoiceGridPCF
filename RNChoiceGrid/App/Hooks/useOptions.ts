import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";

interface IUseOptions {
	columnName: string;
	target: string;
	utils: ComponentFramework.Utility;
}

export const useOptions = ({
	columnName,
	target,
	utils,
}: IUseOptions): ComponentFramework.PropertyHelper.OptionMetadata[] => {
	const [options, setOptions] = React.useState<
		Array<ComponentFramework.PropertyHelper.OptionMetadata>
	>([]);

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

	return options;
};
