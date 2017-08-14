// u is a utility shorthand
import u from './util/Util.js'
//import WaspNode from './wasp-node'
import NodeFactory from './node-factory'
import WaspTree from './wasp-tree'

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

		console.log('W E B A U D I O S I G N A L ' +
								'P R O C E S S O R\n\n'
								,'v.'+ version)

		this.audioContext = new AudioContext
		WaspTree.audioContext = this.audioContext
		this.log = log
		//this.master = this.create('DESTINATION')
		this.master = WaspTree.addNode('DESTINATION', {noUndo: true})
	}

	create(type) {
		let node = WaspTree.addNode(type)
		return node
	}

	connect(from, to, prop) {
		WaspTree.connect({from: from, to: to, prop: prop})
	}
	
	disconnect(from, to, prop) {
		WaspTree.disconnect({from: from, to: to, prop: prop})
	}

	disconnectAll(node) {
		node.disconnectAll()
	}

	// remove takes either a node object or an id #
	remove(node) {
		WaspTree.removeNode(node)
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
