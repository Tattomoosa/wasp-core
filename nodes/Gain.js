import { WaspNode } from './WaspNode'

class Gain extends WaspNode {

	constructor(ctx, id) {
		super(ctx,id)
		this.node = ctx.createGain()
	}

	set(prop, value) {
		// allows you to set gain value with
		// simply `node.set( 0.5 )` since gain
		// has no other settable values
		if (arguments.length == 1) {
			value = prop;
			prop = 'gain';
			}
		//

		this.node.gain.value = value;
	}

}

export { Gain as Gain }
