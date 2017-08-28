import { WaspNode } from './WaspNode'

class Destination extends WaspNode {
	constructor(ctx,id) {
		super(ctx,id)
		this.outputs = null
		this.node = ctx.destination
	}

	remove() {
		console.error(logprefix + 'ERROR: Cannot remove MASTER')
	}

	//destination is a special, un-deletable node
	disconnect() {
		console.error(logprefix + 'ERROR: Cannot disconnect MASTER')
	}

	disconnectAll() {
		this.disconnect()
	}

}


export { Destination as Destination }
