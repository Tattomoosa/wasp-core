import { WaspNode } from WaspNode

class Delay extends WaspNode {

	constructor(ctx, id) {
		super(ctx,id)
		this.node = ctx.createDelay()
	}

	set(prop, value) {
		// allows you to set delay value with
		// simply `node.set( 0.5 )` since  delay
		// has no other settable values
		if (arguments.length == 1) {
			value = prop;
			prop = 'delayTime';
			}
		//

		this.node.delayTime.value = value;
	}

}

export { Delay as Delay }
