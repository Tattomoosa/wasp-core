import Graph from '../wasp-graph'
// TODO make undo a thing later
// import undo from '../wasp-undo'

class WaspNode {
	constructor(ctx, id) {
		this.io = {
			inputs : []
			,outputs : []
		}
		this.setID(id)
	}

	setID(id) {
		this.id = id
		//clean up name for debugging sake
		this.name = this.constructor.name.replace ( /_/g, '' )
		//and add id to it
		this.name += '.' + id
	}

	// We can't always rely on actually being able to delete
	// a node since there may be a reference to it stored
	// in external code. So, we just set everything to invalid
	// values.
	// TODO: Make any functions called on a destroyed node
	// print an error to the console!
	destroy() {
		// TODO remove all connections first
		// graph.REMOVE_NODE(this)
		// delete this
		this.io = null
		this.id = -1
		this.name = 'Deleted'
		this.node = null
	}

	// eventually this will need to work a little harder
	getType() {
		return 'audio'
	}

	//checks if prop exists
	validateProp(prop) {
		if (this.node[prop]) return true
		if (prop == false) return true
		return false
	}

	connect(toNode, toProp) {
	}
	disconnect() {}

}

	// takes a connection - takes either a node object or an id
	/* DEPRECATED (READ: BROKEN)
	connect(node,prop) {
		WaspTree.connect({from: this, to: node, prop: prop}) 
		//connect returns the node you connected to!!
		return node
	}

	// deletes a connection - takes either a node object or an id
	disconnect(node,prop) {
		WaspTree.disconnect({from: this, to: node, prop: prop})
		return this
	}

	// loops through all connections and deletes them
	disconnectAll() {
		let o = this.io.outputs
		console.log(o)
		for (let i=o.length-1; i >= 0; i--) {
			this.disconnect(o[i].toNode, o[i].toProp)
			}
		return this
	}

	copy() {
		console.error ('WaspNode.copy does not exist yet. Or maybe you passed an object to Wasp.create, which will eventually be a copy operation but right now it is nothing')
		//return new node
		}
	*/

export { WaspNode as WaspNode }
