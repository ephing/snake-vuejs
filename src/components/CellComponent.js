import {Component} from '../../lib/vuetranslit.js'
import {CellState, clone} from '../util/util.js'

const template = `
<div 
class='cell-component' 
v-bind:class='{ emptycell: state === CellState.Empty, snakecell: state === CellState.Snake, foodcell: state === CellState.Food }'
:style="{width: size + 'px', height: size + 'px'}">

</div>
`

class CellComponent extends Component {
	CellState = CellState;
	
	static get tag() { return 'cell-comp'; }
	static get template() { return template; }
	static get props() { 
		return {
			size: {
				type: Number,
				default: 30
			}
		}
	}
	
	state = CellState.Empty;
	
	set_current_state(stateVar) {
		this.state = stateVar;
	}
	
	get_current_state() {
		return clone(this.state);
	}
}

export default CellComponent;