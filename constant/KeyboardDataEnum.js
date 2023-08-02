const WHERE = Object.freeze({
	ATTIC: 'attic',
	STAIRCASE: 'staircase',
	FLAT: 'flat',
	BASEMENT: 'basement',
	HEATING_STATION: 'heatingStation',
});

const PROBLEM_WITH = Object.freeze({
	HOT_WATER: 'hotWater',
	COLD_WATER: 'coldWater',
	HEATING: 'heating',
});

const CAUSE = Object.freeze({
	PIPELINE: 'pipeline',
	TANK: 'tank',
	VENTIL: 'ventil',
	VALVE: 'valve',
	RISER: 'riser',
	RADIATOR: 'radiator',
	FILTER: 'filter',
	TOWEL_RAIL: 'towelRail',
	COUNTER: 'counter',
	EXPANSION_TANK: 'expansionTank',
});

const OTHER = Object.freeze({
	SAVE_TO_DB: 'saveToDB',
	ADD_COMMENT: 'addComment',
	BACK_BTN: `wizardBack`,
	CONTINUE_BTN: `continue`,
	COMPLETE: 'complete',
	SEND: 'send',
	OPTIONS_HANDLER: 'optionsHandler',
	UNDERSTAND: 'understand',
	DISABLED: 'disabled',
	CLOSE_MENU: 'closeMenu'
});

module.exports = {
	WHERE,
	PROBLEM_WITH,
	CAUSE,
	OTHER
};