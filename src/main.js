import componentlist from './componentlist.js'
import Transliterator from '../lib/vuetranslit.js'

const translit = new Transliterator(componentlist);

const vueapp = new Vue({
	el: '#vuewrapper',
	data: {},
});

export {vueapp, translit};