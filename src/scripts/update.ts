import {
	ALL_INPUT_IDS,
	DIST_QTY,
	DIST_UNIT,
	DUR_HR,
	DUR_MIN,
	DUR_SEC,
	PACE_MIN,
	PACE_SEC,
	PACE_UNIT,
	RADIO_DIST,
	RADIO_DUR,
	RADIO_PACE,
	type InputId,
} from "./elem-ids";

import { INPUTS, VALUES, setValue } from "./inputs";
import { RADIOS } from "./radios";

export type Unit = "mi" | "km" | "m";

function unitToMeters(unit: Unit) {
	switch (unit) {
		case "mi":
			return 1609.344;
		case "km":
			return 1000;
		case "m":
			return 1;
		default:
			return unit satisfies never;
	}
}

export function updateInput(this: HTMLInputElement & { id: InputId }) {
	setValue(this.id);

	const currDurationSec =
		VALUES[DUR_HR] * 3600 + VALUES[DUR_MIN] * 60 + VALUES[DUR_SEC];
	const currDistanceMeters = VALUES[DIST_QTY] * unitToMeters(VALUES[DIST_UNIT]);
	const currPaceSecsPerMeter =
		(VALUES[PACE_MIN] * 60 + VALUES[PACE_SEC]) / unitToMeters(VALUES[PACE_UNIT]);

	if (RADIOS[RADIO_DUR].checked) {
		if (currPaceSecsPerMeter === 0) {
			return;
		}
		let durationSec = currDistanceMeters * currPaceSecsPerMeter;
		INPUTS[DUR_HR].value = Math.floor(durationSec / 3600).toString();
		durationSec %= 3600;
		INPUTS[DUR_MIN].value = Math.floor(durationSec / 60).toString();
		durationSec %= 60;
		INPUTS[DUR_SEC].value = durationSec.toFixed(1);
	} else if (RADIOS[RADIO_DIST].checked) {
		if (currPaceSecsPerMeter === 0) {
			return;
		}
		const distanceMeters = currDurationSec / currPaceSecsPerMeter;
		INPUTS[DIST_QTY].value = (distanceMeters / unitToMeters(VALUES[DIST_UNIT])).toFixed(
			2,
		);
	} else if (RADIOS[RADIO_PACE].checked) {
		if (currDistanceMeters === 0) {
			return;
		}
		const paceSecsPerMeter = currDurationSec / currDistanceMeters;
		let paceSecsPerDist = paceSecsPerMeter * unitToMeters(VALUES[PACE_UNIT]);
		INPUTS[PACE_MIN].value = Math.floor(paceSecsPerDist / 60).toString();
		paceSecsPerDist %= 60;
		INPUTS[PACE_SEC].value = paceSecsPerDist.toFixed(1);
	}

	for (const id of ALL_INPUT_IDS) {
		setValue(id);
	}
}
