import {Component} from '../../lib/vuetranslit.js'
import {snakeDirection as sD, CellState, GameState} from '../util/util.js'
import app from '../application.js'

const template = `
<div class="grid-container">
	<div class='gridrow' v-for="i in rows">
		<cell-comp v-for="j in cols" :key="(i-1) + ',' + (j-1)" :ref="(i-1) + ',' + (j-1)" :size='cellsize'></cell-comp>
	</div>
</div>`

class BoardComponent extends Component {
	static get tag() { return 'board-comp'; }
	static get template() { return template; }
	static get props() { 
		return {
			rows: Number,
			cols: Number,
			cellsize: Number,
		}; 
	}
	
	bound_listener = null;
	
	snake = [];
	snakeDirection = sD.Right;
	ateFood = false;
	
	async on_create() {
		const start = parseInt(app.rowCount / 2);
		this.snake = [start + ",2", start + ",1", start + ",0"];
		
		const keydown_fn = this.on_keydown.bind(this);
		this.bound_listener = keydown_fn;
		
		window.addEventListener('keydown', keydown_fn);
		app.passFunction = [this.move_snake,this.set_snake_direction];
		app.ready = true;
	}
	
	async on_destroy() {
		const keydown_fn = this.bound_listener;
		window.removeEventListener('keydown', keydown_fn);
	}
		
	async on_mount() {
		for (let i of this.snake) {
			this.$refs[i][0].set_current_state(CellState.Snake);
		}
		this.place_food();
	}
		
	move_snake() {
		if ((this.snakeDirection === sD.Up && this.snake[0].split(',')[0] === '0') || 
		(this.snakeDirection === sD.Down && this.snake[0].split(',')[0] == app.rowCount - 1) || 
		(this.snakeDirection === sD.Left && this.snake[0].split(',')[1] === '0') || 
		(this.snakeDirection === sD.Right && this.snake[0].split(',')[1] == app.colCount - 1)) {
			app.current_state = GameState.Fin;
			console.log("wall")
			app.initEnd(this.test_for_win());
			return;
		}
		let nextSpace = this.snake[0].split(',');
		if (this.snakeDirection === sD.Up) {
			nextSpace[0] = parseInt(nextSpace[0]) - 1;
		} else if (this.snakeDirection === sD.Down) {
			nextSpace[0] = parseInt(nextSpace[0]) + 1;
		} else if (this.snakeDirection === sD.Left) {
			nextSpace[1] = parseInt(nextSpace[1]) - 1;;
		} else if (this.snakeDirection === sD.Right) {
			nextSpace[1] = parseInt(nextSpace[1]) + 1;;
		}
		nextSpace = nextSpace[0] + ',' + nextSpace[1];
		if (this.snake.some(x => x === nextSpace)) {
			app.current_state = GameState.Fin;
			app.initEnd(this.test_for_win());
			return;
		}
		if (this.$refs[nextSpace][0].get_current_state() === "food") {
			this.ateFood = true;
		}
		this.snake.unshift(nextSpace);
		this.$refs[nextSpace][0].set_current_state(CellState.Snake);
		if (!this.ateFood) {
			this.$refs[this.snake[this.snake.length - 1]][0].set_current_state(CellState.Empty);
			this.snake.pop();
		} else {
			this.place_food();
			this.ateFood = false;
		}
	}
	
	place_food() {
		if (this.test_for_win()) return;
		let loc = Math.floor(Math.random() * app.rowCount) + ',' + Math.floor(Math.random() * app.colCount);
		while (this.$refs[loc][0].get_current_state() !== CellState.Empty) {
			loc = Math.floor(Math.random() * app.rowCount) + ',' + Math.floor(Math.random() * app.colCount);
		}
		this.$refs[loc][0].set_current_state(CellState.Food);
	}
	
	set_snake_direction(dir) {
		this.snakeDirection = dir;
	}
	
	test_for_win() {
		return this.snake.length == app.rowCount * app.colCount;
	}
	
	on_keydown(e) {
		if (!app.hasAI) {
			if (e.key === 'ArrowUp' && this.snakeDirection !== sD.Down) {
				this.snakeDirection = sD.Up;
			} else if (e.key === 'ArrowDown' && this.snakeDirection !== sD.Up) {
				this.snakeDirection = sD.Down;
			} else if (e.key === 'ArrowLeft' && this.snakeDirection !== sD.Right) {
				this.snakeDirection = sD.Left;
			} else if (e.key === 'ArrowRight' && this.snakeDirection !== sD.Left) {
				this.snakeDirection = sD.Right;
			} else return;
			this.move_snake();
		}
	}
}

export default BoardComponent;