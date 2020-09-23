import {Component} from '../../lib/vuetranslit.js'
import {GameState, instructions} from '../util/util.js'
import app from '../application.js'

const template = `
<div class='top-level-container'>
	<div v-if="current_state === GameState.SizeSelect">
		<div>
			<hr class='separator--line'/>
			<h1 class='header_title' id="test">Snake</h1>
			<hr class='separator--dot' />
		</div>
		<div id="diminput">
			<span class="instructions" v-if='instructions'>{{instructions}}</span><br />
			<input type="number" v-model="rowinput"/>
			<input type="number" v-model="colinput"/>
		</div>
		<button id='ai-btn' v-bind:class="{ hasai: has_ai, noai: !has_ai }" @click='set_has_ai()'>AI?</button>
		<button id='start-btn' v-if="accept_bounds" @click='set_game_state(GameState.Gameplay)'>Start</button>
	</div>
	<div v-if="current_state === GameState.Gameplay">
		<board-comp ref="board" v-bind:rows="rowinput" v-bind:cols="colinput" v-bind:cellsize="celldim"></board-comp>
		<ai v-if="has_ai"></ai>
	</div>
	<div v-if="current_state === GameState.Fin">
		<span class="instructions" id="endcredits" v-if='instructions'>{{instructions.replace('{end}', victory)}}</span>
	</div>
</div>`

class TopComponent extends Component {
	GameState = GameState
	
	static get tag() { return 'top-comp'; }
	static get template() { return template; }
	static get props() { return {}; }
	
	current_state = GameState.SizeSelect;
	rowinput = 6;
	colinput = 6;
	has_ai = app.hasAI;
	instructions = instructions[this.current_state];
	victory = "";
	
	watch_rowinput() {
		this.rowinput = parseInt(this.rowinput);
		app.rowCount = this.rowinput;
	}
	
	watch_colinput() {
		this.colinput = parseInt(this.colinput);
		app.colCount = this.colinput;
	}
	
	watch_current_state() {
		this.instructions = instructions[this.current_state];
	}
	
	compute_celldim() {
		let height = parseInt((window.screen.height - 150) / this.rowinput);
		let width = parseInt(window.screen.width / this.colinput);
		return Math.min(width, height);
	}
	
	compute_accept_bounds() {
		return this.rowinput > 5 && this.colinput > 5 && (!(this.rowinput % 2) || !(this.colinput % 2));
	}
	
	set_game_state(state) {
		this.current_state = state;
		app.current_state = state;
	}
	
	set_has_ai() {
		app.hasAI = !app.hasAI;
		this.has_ai = app.hasAI;
	}
	
	on_create() {
		app.rowCount = this.rowinput;
		app.colCount = this.colinput;
		this.current_state = app.get_current_state();
		
		app.tester(async (state,victory) => {
			this.current_state = state;
			this.instructions = instructions[this.current_state];
			if (victory) this.victory = 'win';
			else this.victory = 'lose';
		})
	}
}

export default TopComponent;