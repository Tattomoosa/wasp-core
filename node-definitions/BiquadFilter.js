import { WaspNode } from './WaspNode'

class BiquadFilter extends WaspNode {

	constructor(ctx, id) {
		super(ctx, id)
		this.node=ctx.createBiquadFilter()
	}

	set ( prop, value ) {

		prop = prop.toLowerCase()
		if ( typeof value == 'string' ) {
			value = value.toLowerCase
		}

		prop = prop == 'q' ? 'Q' : prop

		//this.node[prop] = value;

		switch ( prop ) {
			case 'frequency' :
			case 'freq' :
				this.node.frequency.value = value
				return this
			case 'detune' :
				this.node.detune.value = value
				return this
			case 'q' :
				this.node.q.value = value
				return this
			case 'gain' :
				this.node.gain.value = value
				return this
			case 'type' :
				switch ( value ) {
						case 'lowpass' :
						case 'highpass' :
						case 'bandpass' :
						case 'lowshelf' :
						case 'highshelf' :
						case 'peaking' :
						case 'notch' :
						case 'allpass' :
							this.node.type = value
						default :
							console.error('biquad filter type not recognized')
				}
				default:
					console.error ( 'prop not recognized' )
		}
	}
}

export { BiquadFilter as BiquadFilter }
