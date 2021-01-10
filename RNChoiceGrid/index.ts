import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as React from "react";
import * as ReactDOM from "react-dom";
import App, { IProps } from "./App/App";

export class RNChoiceGrid
	implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;

	/**
	 * Empty constructor.
	 */
	constructor() {}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement
	) {
		// Add control initialization code

		this._container = document.createElement("div");
		container.appendChild(this._container);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view

		// if (context.parameters.dataset.paging.hasNextPage) {
		// 	context.parameters.dataset.paging.loadNextPage();
		// 	return;
		// }

		// columns provided by the PCF
		const columnsOnView = context.parameters.dataset.columns;

		// create an array of the column aliases
		const aliases = columnsOnView.map((col) => col.alias);

		// create an array of columns that only include the configured property-set columns defined in the manifest
		const propertySetColumns = [
			"displayColumn",
			"optionSetColumn",
			"inputColumn",
		].map((alias) => columnsOnView[aliases.indexOf(alias)]);

		const props: IProps = {
			context: context,
			columns: propertySetColumns,
			target: context.parameters.dataset.getTargetEntityType(),
			requireInputForOption: context.parameters.requireInputOn.raw,
		};

		ReactDOM.render(React.createElement(App, props), this._container);
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._container);
	}
}
