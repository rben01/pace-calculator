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
	SPEED_QTY,
	SPEED_UNIT,
	RADIO_DIST,
	RADIO_DUR,
	RADIO_PACE,
	type InputId,
	PACE_IDS,
	SPEED_IDS,
} from "./elem-ids";

import { INPUT_KINDS, INPUTS, updateValue, VALUES } from "./inputs";
import { RADIOS } from "./radios";

export type DistUnit = "mi" | "km" | "m";
export type SpeedUnit = "mi-per-hr" | "feet-per-sec" | "km-per-hr" | "meter-per-sec";

export function distUnitToMeters(unit: DistUnit) {
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

export function speedUnitToMetersPerSec(unit: SpeedUnit) {
	switch (unit) {
		case "mi-per-hr":
			return 0.44704;
		case "feet-per-sec":
			return 0.3048;
		case "km-per-hr":
			return 0.2777777778;
		case "meter-per-sec":
			return 1;
		default:
			return unit satisfies never;
	}
}

export function updateInput(this: HTMLInputElement & { id: InputId }) {
	updateValue(INPUT_KINDS[this.id]);

	const { durationSec, distanceMeters, speedMetersPerSec } = VALUES;

	if (RADIOS[RADIO_DUR].checked) {
		if (
			speedMetersPerSec === 0 ||
			Number.isNaN(speedMetersPerSec) ||
			!Number.isFinite(speedMetersPerSec)
		) {
			return;
		}

		let durationSec = distanceMeters / speedMetersPerSec;
		VALUES["durationSec"] = durationSec;

		INPUTS[DUR_HR].value = Math.floor(durationSec / 3600).toString();
		durationSec %= 3600;
		INPUTS[DUR_MIN].value = Math.floor(durationSec / 60).toString();
		durationSec %= 60;
		INPUTS[DUR_SEC].value = durationSec.toFixed(1);
	} else if (RADIOS[RADIO_DIST].checked) {
		if (
			speedMetersPerSec === 0 ||
			Number.isNaN(speedMetersPerSec) ||
			!Number.isFinite(speedMetersPerSec)
		) {
			return;
		}

		const distanceMeters = durationSec * speedMetersPerSec;
		VALUES["distanceMeters"] = distanceMeters;

		INPUTS[DIST_QTY].value = (
			distanceMeters / distUnitToMeters(INPUTS[DIST_UNIT].value as DistUnit)
		).toFixed(2);
	} else if (RADIOS[RADIO_PACE].checked) {
		if (distanceMeters === 0) {
			return;
		}

		const paceSecsPerMeter = durationSec / distanceMeters;

		let paceSecsPerDist =
			paceSecsPerMeter * distUnitToMeters(INPUTS[PACE_UNIT].value as DistUnit);
		INPUTS[PACE_MIN].value = Math.floor(paceSecsPerDist / 60).toString();
		paceSecsPerDist %= 60;
		INPUTS[PACE_SEC].value = paceSecsPerDist.toFixed(1);

		const speedMetersPerSec = 1 / paceSecsPerMeter;
		VALUES["speedMetersPerSec"] = speedMetersPerSec;
		INPUTS[SPEED_QTY].value = (
			speedMetersPerSec / speedUnitToMetersPerSec(INPUTS[SPEED_UNIT].value as SpeedUnit)
		).toFixed(1);
	} else {
		throw new Error("no radios checked?");
	}
}
