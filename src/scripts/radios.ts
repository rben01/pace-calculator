import {
	ALL_INPUT_IDS,
	DIST_IDS,
	type DistUnitId,
	DUR_IDS,
	type InputId,
	PACE_IDS,
	RADIO_DIST,
	RADIO_DUR,
	RADIO_IDS,
	RADIO_PACE,
	type RadioId,
	SPEED_IDS,
	UNIT_IDS,
	type UnitId,
} from "./elem-ids";

import { INPUTS } from "./inputs";

export const INPUT_TO_RADIO = {} as { [key in InputId]: (typeof RADIO_IDS)[number] };
export const RADIOS = {} as { [key in RadioId]: HTMLInputElement };

for (const [radioId, inputIds] of [
	[RADIO_DUR, DUR_IDS],
	[RADIO_DIST, DIST_IDS],
	[RADIO_PACE, [...PACE_IDS, ...SPEED_IDS]],
] as const) {
	for (const inputId of inputIds) {
		INPUT_TO_RADIO[inputId] = radioId;
	}

	const radio = document.getElementById(radioId)! as HTMLInputElement;
	radio.addEventListener("click", function (this: HTMLInputElement) {
		for (const inputId of ALL_INPUT_IDS) {
			if (UNIT_IDS.includes(inputId as UnitId)) {
				continue;
			}

			const isDisabled = INPUT_TO_RADIO[inputId] === this.id;
			if (isDisabled) {
				INPUTS[inputId].setAttribute("disabled", "");
			} else {
				INPUTS[inputId].removeAttribute("disabled");
			}
		}
	});
	RADIOS[radioId] = radio;
}
