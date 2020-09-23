/**@module util*/

/**
* Enum, all cell states
*/
export const CellState = {
	//No snake, no food
	Empty: 'empty',
	
	//Snake
	Snake: 'snake',
	
	//Food
	Food: 'food',
}

/**
* Enum, Game states
*/
export const GameState = {
	//Choose grid size
	SizeSelect: 'sizeselect',
	
	//actual game
	Gameplay: 'gameplay',
	
	//end game
	Fin: 'fin',
}

export const instructions = {
	[GameState.SizeSelect]: "Decide on the size of the Board\nRows -- Cols",
	[GameState.Gameplay]: "",
	[GameState.Fin]: "You {end}!",
}

export const snakeDirection = {
	Up: 'up',
	Down: 'down',
	Left: 'left',
	Right: 'right',
}

export function clone(obj) {
	//not an object or array
	if (obj === null || typeof obj !== 'object') return obj;
	
	//is an array
	if (Array.isArray(obj)) return obj.map(x => clone(x));
	
	//is an object
	const copy = {};
	for (const prop in obj) {
		copy[prop] = clone(obj[prop]);
	}
	return copy;
}