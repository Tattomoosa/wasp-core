import WaspTree from '../wasp-tree'

class WaspNode {

	constructor(ctx, id) {
		this.io = {
			inputs : []
			,outputs : []
		}
		this.id = id
		//clean up name for debugging sake
		this.name = this.constructor.name.replace ( /_/g, '' )
		//and add id to it
		this.name += '.' + id
	}

	// gives the node a new ID
	changeId(newId) {
		let name = this.name
		this.id = newId
		//now we clear existing id
		name = name.substring(0, name.indexOf('.'))
		//and add new id
		name += '.' + newId
		//and set it
		this.name = name
		return this
	}

	// deletes the node and it's attached audio node(s)
	remove() {
		WaspTree.removeNode(this)
		delete this
		return null
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

	log() {
		for (let i = 0; i < arguments.length; i++) {
			console.log(arguments[i])
		}
		return this
	}

	// takes a connection - takes either a node object or an id
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

}

export { WaspNode as WaspNode }
