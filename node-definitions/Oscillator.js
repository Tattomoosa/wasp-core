import { WaspNode } from './WaspNode.js'

class Oscillator extends WaspNode {
	constructor(ctx,id) {
		super(ctx,id)
		this.node = ctx.createOscillator()
	}

	start() {
		this.node.start()
	}

	stop () {
		this.node.stop()
		this.remove()
		}

	set(prop,value) {

		prop = prop.toLowerCase()
		if ( typeof value == 'string' ) {
			value = value.toLowerCase
		}

		//this.node[prop] = value
		//console.log(this.node.prop, this.node.prop.value)

		 switch (prop) {
		 	case 'frequency':
		 	case 'freq':
		 		this.node.frequency.value = value;
		 		return this
		 	case 'detune':
		 		this.node.detune.value = value;
		 		return this
		 	case 'type':
		 	case 'waveform':
		 		switch (value) {
		 			case 'custom':
		 				//function
		 				return this
		 			case 'sine':
		 			case 'square':
		 			case 'sawtooth':
		 			case 'triangle':
		 				this.node.type = value
		 				return this
		 			case 'saw':
		 				this.node.type = 'sawtooth'
		 				return this
		 			default:
		 				console.error ('waveform type not recognized')
		 		}
			default:
				console.error ('prop not recognized')
		}

		//console.error ('cannot set unknown prop')
		return this
	}

}

export { Oscillator as Oscillator }
