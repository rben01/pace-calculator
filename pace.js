(() => {
	// input IDs
	const DUR_HR = "duration-hours";
	const DUR_MIN = "duration-minutes";
	const DUR_SEC = "duration-seconds";
	const DIST_QTY = "distance";
	const DIST_UNIT = "units";
	const PACE_MIN = "pace-minutes";
	const PACE_SEC = "pace-seconds";
	const PACE_UNIT = "pace-units";

	// radio button IDs
	const COMP_DUR = "compute-duration";
	const COMP_DIST = "compute-distance";
	const COMP_PACE = "compute-pace";
	const RADIO_IDS = [COMP_DUR, COMP_DIST, COMP_PACE];

	// IDs grouped by purpose
	const DUR_IDS = new Set([DUR_HR, DUR_MIN, DUR_SEC]);
	const DIST_IDS = new Set([DIST_QTY, DIST_UNIT]);
	const PACE_IDS = new Set([PACE_MIN, PACE_SEC, PACE_UNIT]);

	const UNIT_IDS = new Set([DIST_UNIT, PACE_UNIT]);

	const ALL_INPUT_IDS = [...DUR_IDS, ...DIST_IDS, ...PACE_IDS];

	const RADIO_TO_INPUT = {
		[COMP_DUR]: DUR_IDS,
		[COMP_DIST]: DIST_IDS,
		[COMP_PACE]: PACE_IDS,
	};

	const INPUT_TO_RADIO = (() => {
		const o = {};
		for (const radioId of Object.keys(RADIO_TO_INPUT)) {
			for (const inputId of RADIO_TO_INPUT[radioId]) {
				o[inputId] = radioId;
			}
		}
		return o;
	})();

	function clickRadio() {
		for (const inputId of ALL_INPUT_IDS) {
			if (UNIT_IDS.has(inputId)) {
				continue;
			}
			const isDisabled = INPUT_TO_RADIO[inputId] === this.id;
			if (isDisabled) {
				INPUTS[inputId].setAttribute("disabled", "");
			} else {
				INPUTS[inputId].removeAttribute("disabled");
			}
		}
	}

	function unitToMeters(unit) {
		if (unit === "mi") {
			return 1609.344;
		} else if (unit === "km") {
			return 1000;
		} else if (unit === "m") {
			return 1;
		} else {
			throw new Error(`unrecognized unit: ${unit}`);
		}
	}

	function setValue(id) {
		const val = INPUTS[id].value;

		if (id === DIST_UNIT || id === PACE_UNIT) {
			VALUES[id] = val;
		} else {
			VALUES[id] = val.length === 0 ? 0 : Number.parseFloat(val);
		}
	}

	function updateInput() {
		setValue(this.id);

		const currDurationSec =
			VALUES[DUR_HR] * 3600 + VALUES[DUR_MIN] * 60 + VALUES[DUR_SEC];
		const currDistanceMeters = VALUES[DIST_QTY] * unitToMeters(VALUES[DIST_UNIT]);
		const currPaceSecsPerMeter =
			(VALUES[PACE_MIN] * 60 + VALUES[PACE_SEC]) / unitToMeters(VALUES[PACE_UNIT]);

		if (RADIOS[COMP_DUR].checked) {
			if (currPaceSecsPerMeter === 0) {
				return;
			}
			let durationSec = currDistanceMeters * currPaceSecsPerMeter;
			INPUTS[DUR_HR].value = Math.floor(durationSec / 3600);
			durationSec %= 3600;
			INPUTS[DUR_MIN].value = Math.floor(durationSec / 60);
			durationSec %= 60;
			INPUTS[DUR_SEC].value = durationSec.toFixed(1);
		} else if (RADIOS[COMP_DIST].checked) {
			if (currPaceSecsPerMeter === 0) {
				return;
			}
			const distanceMeters = currDurationSec / currPaceSecsPerMeter;
			INPUTS[DIST_QTY].value = (
				distanceMeters / unitToMeters(VALUES[DIST_UNIT])
			).toFixed(2);
		} else if (RADIOS[COMP_PACE].checked) {
			if (currDistanceMeters === 0) {
				return;
			}
			const paceSecsPerMeter = currDurationSec / currDistanceMeters;
			let paceSecsPerDist = paceSecsPerMeter * unitToMeters(VALUES[PACE_UNIT]);
			INPUTS[PACE_MIN].value = Math.floor(paceSecsPerDist / 60);
			paceSecsPerDist %= 60;
			INPUTS[PACE_SEC].value = paceSecsPerDist.toFixed(1);
		}

		for (const id of ALL_INPUT_IDS) {
			setValue(id);
		}
	}

	const RADIOS = {};
	for (const id of [COMP_DUR, COMP_DIST, COMP_PACE]) {
		const radio = document.getElementById(id);
		radio.onclick = clickRadio;
		RADIOS[id] = radio;
	}

	const INPUTS = {};
	const VALUES = {};

	for (const id of ALL_INPUT_IDS) {
		const input = document.getElementById(id);
		input.oninput = updateInput;
		INPUTS[id] = input;

		setValue(id);
	}
})();
