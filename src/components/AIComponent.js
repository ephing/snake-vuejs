import {Component} from '../../lib/vuetranslit.js'
import app from '../application.js'
import {GameState, snakeDirection} from '../util/util.js'

const template = `<div></div>`

class AIComponent extends Component {
	static get tag() { return 'ai'; }
	static get template() { return template; }
	static get props() { return {}; }
	
	ready = app;
	hamiltonCircuit = [];
	move_snake = null;
	set_sD = null;
	
	async play() {
		const start = parseInt(app.rowCount / 2);
		
		this.createHamiltonCircuit(app.rowCount, app.colCount, start + ',2');
		let currInstruction = this.hamiltonCircuit.length - 1;
		
		while (app.get_current_state() === GameState.Gameplay) {
			let nextLoc;
			if (currInstruction === this.hamiltonCircuit.length - 1) nextLoc = 0;
			else nextLoc = currInstruction + 1;
			
			this.travel(currInstruction,nextLoc);
			
			currInstruction = nextLoc;
			await this.sleep(Math.ceil(5000/(app.rowCount * app.colCount)));
		}
	}
	
	travel(point1,point2) {
		const p1 = this.hamiltonCircuit[point1].split(',');
		const p2 = this.hamiltonCircuit[point2].split(',');
		
		if (parseInt(p1[0]) < parseInt(p2[0])) {
			this.set_sD(snakeDirection.Down);
		} else if (parseInt(p1[0]) > parseInt(p2[0])) {
			this.set_sD(snakeDirection.Up);
		} else if (parseInt(p1[1]) < parseInt(p2[1])) {
			this.set_sD(snakeDirection.Right);
		} else if (parseInt(p1[1]) > parseInt(p2[1])) {
			this.set_sD(snakeDirection.Left);
		}
		this.move_snake();
	}
	
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve,ms));
	}
		
	createHamiltonCircuit(rows,cols,start) {
		const getLast = () => { return this.hamiltonCircuit[this.hamiltonCircuit.length - 1]; }
		this.move_hor(1,start);
		if (cols % 2) {
			/*
			10x7: top zigzag, vertical zigzag, full bottom zigzag
			10x9: top zigzag, vertical zigzag, full bottom zigzag
			*/
			if (rows % 4) {
				while (true) {
					if (parseInt(getLast().split(',')[0]) === 1) break;
					this.move_hor_until(1,cols - 3,getLast());
					this.move_vert(-1,getLast());
					if (parseInt(getLast().split(',')[0]) === 1) break;
					this.move_hor_until(-1,0,getLast());
					this.move_vert(-1,getLast());
				}
				while (true) {
					if (parseInt(getLast().split(',')[1]) === cols - 2) break;
					this.move_vert(-1,getLast());
					this.move_hor(1,getLast());
					if (parseInt(getLast().split(',')[1]) === cols - 2) break;
					this.move_vert(1,getLast());
					this.move_hor(1,getLast());
				}
				while (true) {
					if (!this.move_hor(1,getLast())) break;
					if (!this.move_vert(1,getLast())) break;
					if (!this.move_hor(-1,getLast())) break;
					if (!this.move_vert(1,getLast())) break;
				}
				while (true) {
					this.move_hor(-1,getLast());
					if (parseInt(getLast().split(',')[1]) === 0) break;
					this.move_vert_until(-1,parseInt(start.split(',')[0]) + 1, getLast());
					this.move_hor(-1,getLast());
					if (parseInt(getLast().split(',')[1]) === 0) break;
					this.move_vert_until(1,rows - 1, getLast());
				}
			} 
			else {
				if ((cols - 1) % 4) {
					while (true) {
						if (parseInt(getLast().split(',')[0]) === 0) break;
						this.move_hor_until(1,cols - 3, getLast());
						this.move_vert(-1,getLast());
						if (parseInt(getLast().split(',')[0]) === 0) break;
						this.move_hor_until(-1,0, getLast());
						this.move_vert(-1,getLast());
					}
					this.move_hor_until(1,cols - 1,getLast());
					while (true) {
						this.move_vert(1,getLast());
						if (parseInt(getLast().split(',')[0]) === parseInt(start.split(',')[0]) + 1) break;
						this.move_hor(-1,getLast());
						this.move_vert(1,getLast());
						if (parseInt(getLast().split(',')[0]) === parseInt(start.split(',')[0]) + 1) break;
						this.move_hor(1,getLast());
					}
				}
				else {
					while (true) {
						if (parseInt(getLast().split(',')[0]) === 0) break;
						this.move_hor_until(1,cols - 2, getLast());
						this.move_vert(-1,getLast());
						if (parseInt(getLast().split(',')[0]) === 0) break;
						this.move_hor_until(-1,0, getLast());
						this.move_vert(-1,getLast());
					}
					this.move_hor_until(1,cols-1,getLast());
					this.move_vert_until(1,parseInt(start.split(',')[0]) + 1, getLast());
				}
				while (true) {
					if (parseInt(getLast().split(',')[0]) === rows - 1) break;
					this.move_hor_until(-1,1,getLast());
					this.move_vert(1,getLast());
					if (parseInt(getLast().split(',')[0]) === rows - 1) break;
					this.move_hor_until(1,cols-1,getLast());
					this.move_vert(1,getLast());
				}
				this.move_hor_until(-1,0,getLast());
			}
			this.move_vert_until(-1,parseInt(start.split(',')[0]),getLast());
			this.move_hor_until(1,parseInt(start.split(',')[1]),getLast());
		}
		else {
			if ((rows - parseInt(start.split(',')[0]) - (rows % 2)) % 2) {
				while (true) {
					if (parseInt(getLast().split(',')[0]) === 1) break;
					this.move_hor_until(1,cols - 2,getLast());
					this.move_vert(-1,getLast());
					if (parseInt(getLast().split(',')[0]) === 1) break;
					this.move_hor_until(-1,0, getLast());
					this.move_vert(-1,getLast());
				}
				while (true) {
					if (!this.move_vert(-1,getLast())) break;
					if (!this.move_hor(1,getLast())) break;
					if (!this.move_vert(1,getLast())) break;
					if (!this.move_hor(1,getLast())) break;
				}
			} 
			else {
				while (true) {
					if (parseInt(getLast().split(',')[0]) === 0) break;
					this.move_hor_until(1,cols - 2,getLast());
					this.move_vert(-1,getLast());
					if (parseInt(getLast().split(',')[0]) === 0) break;
					this.move_hor_until(-1,0, getLast());
					this.move_vert(-1,getLast());
				}
				this.move_hor_until(1,cols - 1, getLast());
			}
			this.move_vert_until(1,parseInt(start.split(',')[0]) + 1,getLast());
			
			if ((rows - parseInt(start.split(',')[0]) - 1) % 2) {
				while (true) {
					if (parseInt(getLast().split(',')[0]) === rows - 1) break;
					this.move_hor_until(-1,1,getLast());
					this.move_vert(1,getLast());
					if (parseInt(getLast().split(',')[0]) === rows - 1) break;
					this.move_hor_until(1,cols - 1,getLast());
					this.move_vert(1,getLast());
				}
				this.move_hor_until(-1,0,getLast());
			}
			else {
				while (true) {
					if (parseInt(getLast().split(',')[0]) === rows - 2) break;
					this.move_hor_until(-1,1,getLast());
					this.move_vert(1,getLast());
					if (parseInt(getLast().split(',')[0]) === rows - 2) break;
					this.move_hor_until(1,cols - 1,getLast());
					this.move_vert(1,getLast());
				}
				while (true) {
					if (!this.move_vert(1,getLast())) break;
					if (!this.move_hor(-1,getLast())) break;
					if (!this.move_vert(-1,getLast())) break;
					if (!this.move_hor(-1,getLast())) break;
				}
			}
			this.move_vert_until(-1,parseInt(start.split(',')[0]),getLast());
			this.move_hor_until(1,parseInt(start.split(',')[1]),getLast());
		}
	}
	
	move_vert_until(dir,row,start) {
		let lastLoc = start.split(',');
		while (parseInt(lastLoc[0]) != row) {
			let nextLoc = (parseInt(lastLoc[0]) + dir) + ',' + lastLoc[1];
			this.hamiltonCircuit.push(nextLoc);
			lastLoc = nextLoc.split(',');
		}
	}
	
	move_hor_until(dir, col, start) {
		let lastLoc = start.split(',');
		while (parseInt(lastLoc[1]) != col) {
			let nextLoc = lastLoc[0] + ',' + (parseInt(lastLoc[1]) + dir);
			this.hamiltonCircuit.push(nextLoc);
			lastLoc = nextLoc.split(',');
		}
	}
	
	move_vert(dir,start) {
		const currLoc = start.split(',');
		if (parseInt(currLoc[0]) + dir > -1 && parseInt(currLoc[0]) + dir < app.rowCount) {
			const newLoc = (parseInt(currLoc[0]) + dir) + ',' + currLoc[1];
			if (this.hamiltonCircuit.filter(x => x === newLoc).length === 0) {
				this.hamiltonCircuit.push(newLoc);
				return true;
			}
		}
		return false;
	}
	
	move_hor(dir,start) {
		const currLoc = start.split(',');
		if (parseInt(currLoc[1]) + dir > -1 && parseInt(currLoc[1]) + dir < app.colCount) {
			const newLoc = currLoc[0] + ',' + (parseInt(currLoc[1]) + dir);
			if (this.hamiltonCircuit.filter(x => x === newLoc).length === 0) {
				this.hamiltonCircuit.push(newLoc);
				return true;
			}
		}
		return false;
	}
	
	on_create() {
		this.set_sD = app.passFunction[1];
		this.move_snake = app.passFunction[0];
		this.play();
	}
}

export default AIComponent;