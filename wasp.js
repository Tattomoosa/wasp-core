// u is a utility shorthand
//import u from './util/Util.js'
//import WaspNode from './wasp-node'
// import NodeFactory from './node-factory'
// import WaspTree from './wasp-tree'
import nodes from './nodes/index';
import Graph from './wasp-graph'

let graph = Graph

let AudioContext = window.AudioContext ||
	window.webkitAudioContext

let log = false

let version = '0.0.1'

export default class Wasp {

	constructor(options) {
		options = options || {}
		 let {
			 inputs = 1
			 ,outputs = 'max'
			 ,log = true
		 } = options

		this.audioContext = new AudioContext()
		this.log = log
		this.nodes = nodes
		// this.graph = Graph

		this.master = this.create(nodes.Destination)
	}

	create(node) {
		let n = new node(this.audioContext, graph.newID)
		// this.graph.ADD_NODE(n)
		graph.ADD_NODE(n)
		return n
	}

	destroy(node) {
		// this.graph.REMOVE_NODE(node)
		graph.REMOVE_NODE(node)
		node.destroy()
	}

	connect(from, to, prop) {
		// WaspTree.connect({from: from, to: to, prop: prop})
	}
	
	disconnect(from, to, prop) {
		// WaspTree.disconnect({from: from, to: to, prop: prop})
	}

	disconnectAll(node) {
		// node.disconnectAll()
	}


	undo() {
		WaspTree.undo()
	}

	redo() {
		WaspTree.redo()
	}

	logTree() {
		WaspTree.log()
	}

}
