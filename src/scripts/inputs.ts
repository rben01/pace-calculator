import { ALL_INPUT_IDS, UNIT_IDS, type InputId, type UnitId } from "./elem-ids";
import { updateInput, type Unit } from "./update";

export const INPUTS = {} as { [key in InputId]: HTMLInputElement };
export const VALUES = {} as {
	[key in Exclude<InputId, UnitId>]: number;
} & { [key in UnitId]: Unit };

for (const id of ALL_INPUT_IDS) {
	const input = document.getElementById(id)! as HTMLInputElement;
	input.addEventListener("input", updateInput);
	if (input.classList.contains("numeric-input")) {
		input.setAttribute("inputmode", "decimal");
	}

	INPUTS[id] = input;
	setValue(id);
}

export function setValue(id: InputId) {
	const val = INPUTS[id].value;

	if (UNIT_IDS.has(id as UnitId)) {
		VALUES[id as UnitId] = val as Unit;
	} else {
		VALUES[id as Exclude<InputId, UnitId>] =
			val.length === 0 ? 0 : Number.parseFloat(val);
	}
}
