import {GameState,clone} from './util/util.js'

class GameApplication {
	
	rowCount = 0;
	colCount = 0;
	gameWin = 'undefined';
	current_state = GameState.SizeSelect;
	hasAI = false;
	endFunction = null
	ready = false;
	passFunction = null;
	
	get_current_state() {
		return clone(this.current_state);
	}
	
	initEnd(victory) {
		this.endFunction(this.current_state, victory);
	}
	
	tester(hand) {
		this.endFunction = hand;
	}
}

const app = new GameApplication();
export default app;