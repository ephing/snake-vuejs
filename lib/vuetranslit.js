export default class Transliterator {
	constructor(components) {
		this.components = components;
		this.execute();
	}
	
	execute() {
		for (const Comp of this.components) {
		
			const method_list = Object.getOwnPropertyNames(Comp.prototype);
			
			const watch = {}
			const methods = {}
			const computed = {}
			
			for (let x of method_list) {
				if (x.startsWith("watch_")) {
					let name = x.substr(6);
					const handler = function(...args) {
						return Comp.prototype[x].bind(this)(...args);
					}
					watch[name] = handler;
				} else if (x.startsWith("compute_")) {
					let name = x.substr(8);
					const handler = function(...args) {
						return Comp.prototype[x].bind(this)(...args);
					}
					computed[name] = handler;
				} else {
					const handler = function(...args) {
						return Comp.prototype[x].bind(this)(...args);
					}
					methods[x] = handler;
				}
			}
		
			Vue.component(Comp.tag,{
				props: Comp.props,
				template: Comp.template,
				data: () => {
					return new Comp();
				},
				watch,
				computed,
				methods,
				created: function() {
					if (typeof this.on_create === 'function') this.on_create();
				},
				updated: function() {
					if (typeof this.on_update === 'function') this.on_update();
				},
				mounted: function() {
					if (typeof this.on_mount === 'function') this.on_mount();
				},
				destroyed: function() {
					if (typeof this.on_destroy === 'function') this.on_destroy();
				},
			});
		}
	}
}

export class Component {
	static get tag() { return ""; }
	static get props() { return {} }
	static get template() { return ""; }
	
	on_create() {}
	on_update() {}
	on_mount() {}
	on_destroy() {}
}