import {
	ALL_INPUT_IDS,
	SPEED_UNIT,
	DIST_UNIT_IDS,
	type InputId,
	type DistUnitId,
	type SpeedUnitId,
	type UnitId,
	DUR_HR,
	DUR_MIN,
	DUR_SEC,
	DIST_QTY,
	DIST_UNIT,
	PACE_MIN,
	PACE_SEC,
	PACE_UNIT,
	SPEED_QTY,
	DUR_IDS,
	DIST_IDS,
	PACE_IDS,
	SPEED_IDS,
} from "./elem-ids";
import {
	distUnitToMeters,
	speedUnitToMetersPerSec,
	updateInput,
	type DistUnit,
	type SpeedUnit,
} from "./update";

export const INPUTS = {} as { [key in InputId]: HTMLInputElement };

for (const id of ALL_INPUT_IDS) {
	const input = document.getElementById(id)! as HTMLInputElement;
	input.addEventListener("input", updateInput);
	if (input.classList.contains("numeric-input")) {
		input.setAttribute("inputmode", "decimal");
	}

	INPUTS[id] = input;
}

export type ValueKind = "durationSec" | "distanceMeters" | "speedMetersPerSec";
export const VALUES = {} as {
	[key in ValueKind]: number;
};

type InputKind = ValueKind | "paceSecondsPerMeter";
export const INPUT_KINDS = {} as {
	[K in InputId]: InputKind;
};

for (const [inputIds, valueKind] of [
	[DUR_IDS, "durationSec"],
	[DIST_IDS, "distanceMeters"],
	[PACE_IDS, "paceSecondsPerMeter"],
	[SPEED_IDS, "speedMetersPerSec"],
] as const) {
	for (const inputId of inputIds) {
		INPUT_KINDS[inputId] = valueKind;
	}

	updateValue(valueKind);
}

export function updateValue(kind: InputKind) {
	function getNumericValue(id: InputId) {
		const val = INPUTS[id].value;
		if (!val) {
			return 0;
		}
		return Number.parseFloat(val);
	}

	switch (kind) {
		case "durationSec":
			VALUES["durationSec"] =
				getNumericValue(DUR_HR) * 3600 +
				getNumericValue(DUR_MIN) * 60 +
				getNumericValue(DUR_SEC);
			break;
		case "distanceMeters":
			VALUES["distanceMeters"] =
				getNumericValue(DIST_QTY) *
				distUnitToMeters(INPUTS[DIST_UNIT].value as DistUnit);
			break;
		case "paceSecondsPerMeter": {
			const speedMetersPerSec =
				distUnitToMeters(INPUTS[PACE_UNIT].value as DistUnit) /
				(getNumericValue(PACE_MIN) * 60 + getNumericValue(PACE_SEC));

			VALUES["speedMetersPerSec"] = speedMetersPerSec;

			if (speedMetersPerSec === 0 || !Number.isFinite(speedMetersPerSec)) {
				break;
			}

			INPUTS[SPEED_QTY].value = (
				speedMetersPerSec /
				speedUnitToMetersPerSec(INPUTS[SPEED_UNIT].value as SpeedUnit)
			).toFixed(2);
			break;
		}
		case "speedMetersPerSec": {
			const speedMetersPerSec =
				getNumericValue(SPEED_QTY) *
				speedUnitToMetersPerSec(INPUTS[SPEED_UNIT].value as SpeedUnit);

			VALUES["speedMetersPerSec"] = speedMetersPerSec;

			if (speedMetersPerSec === 0 || !Number.isFinite(speedMetersPerSec)) {
				break;
			}

			let paceSecsPerDist =
				distUnitToMeters(INPUTS[PACE_UNIT].value as DistUnit) / speedMetersPerSec;
			INPUTS[PACE_MIN].value = Math.floor(paceSecsPerDist / 60).toString();
			paceSecsPerDist %= 60;
			INPUTS[PACE_SEC].value = paceSecsPerDist.toFixed(1);

			break;
		}
		default:
			return kind satisfies never;
	}
}
