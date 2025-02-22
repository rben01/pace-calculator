// numeric input IDs
export const DUR_HR = "duration-hours";
export const DUR_MIN = "duration-minutes";
export const DUR_SEC = "duration-seconds";
export const DIST_QTY = "distance-qty";
export const DIST_UNIT = "distance-units";
export const PACE_MIN = "pace-minutes";
export const PACE_SEC = "pace-seconds";
export const PACE_UNIT = "pace-units";
export const SPEED_QTY = "speed-qty";
export const SPEED_UNIT = "speed-units";

// radio button IDs
export const RADIO_DUR = "radio-duration";
export const RADIO_DIST = "radio-distance";
export const RADIO_PACE = "radio-pace";

export const RADIO_IDS = [RADIO_DUR, RADIO_DIST, RADIO_PACE] as const;
export type RadioId = (typeof RADIO_IDS)[number];

// IDs grouped by purpose
export const DUR_IDS = [DUR_HR, DUR_MIN, DUR_SEC] as const;
export const DIST_IDS = [DIST_QTY, DIST_UNIT] as const;
export const PACE_IDS = [PACE_MIN, PACE_SEC, PACE_UNIT] as const;
export const SPEED_IDS = [SPEED_QTY, SPEED_UNIT] as const;

// the dropdown unit selectors
export const DIST_UNIT_IDS = [DIST_UNIT, PACE_UNIT] as const;
export type DistUnitId = (typeof DIST_UNIT_IDS)[number];

export const SPEED_UNIT_IDS = [SPEED_UNIT] as const;
export type SpeedUnitId = (typeof SPEED_UNIT_IDS)[number];

export const UNIT_IDS = [...DIST_UNIT_IDS, ...SPEED_UNIT_IDS];
export type UnitId = (typeof UNIT_IDS)[number];

// everything
export const ALL_INPUT_IDS = [
	...DUR_IDS,
	...DIST_IDS,
	...PACE_IDS,
	...SPEED_IDS,
] as const;
export type InputId = (typeof ALL_INPUT_IDS)[number];
