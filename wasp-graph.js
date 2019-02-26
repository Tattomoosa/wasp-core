/* Wasp Graph
 *
 * The Web Audio API does not allow you to query its connections. This makes
 * operations such as UNDO impossible. Even if it did, Wasp manages 'control'
 * signals that aren't directly related to any connection in the Web Audio API.
 *
 * The Wasp Graph takes care of making sure that we know the state of all of
 * our nodes at all times and don't lose references to any of them.
*/


// TODO: ditch this for something similar from wasp
const connectionTypes = {
	audio : 1,
	control : 2,
}

class Graph {
	constructor()
	{
		this.nodes = {}
		this.newID = 0
	}

	ADD_NODE (node) {
		this.nodes[this.newID] = node
		
		// syntax is probably wrong
		// undoStack.push(() => REMOVE_NODE(id))
		this.newID++
	}

	REMOVE_NODE (node) {
		let id = node.id
		// undoStack.push(() => ADD_NODE(node))
		this.nodes[id] = null
		// This is potentially slow
		delete this.nodes[id]

	}

	LIST_NODES () {
		let list = ''
		let nodes = this.nodes

		for (let key in nodes)
			if (nodes.hasOwnProperty(key))
				list += key + ': ' + nodes[key].name
	}

	CONNECT (fromNode, toNode, prop) {
		fromNode.validateProp(prop);
	}

	/*
	function LIST_CONNECTIONS () {
		let list = ''
		for (let i; i < connections.length; ++i)
			list += i + ': ' + connections[i].from_node +
				' to ' + connections[i].to_nodel
	}
	*/

}

export default new Graph()

/*
	nodes = {
		0 : master,
		1 : oscillator,
		2 : eq,
		// must be able to handle missing ids
		4 : control
	}

	connections = [
		{
			from_node : NODE_ID,
			from_prop : NODE_PROPERTY,
			to_node : NODE_ID,
			to_prop : NODE_PROPERTY
		},
	]
 */
