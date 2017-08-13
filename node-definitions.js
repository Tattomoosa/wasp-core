import WaspTree from './wasp-tree'

let logprefix = '[   WASP-TREE   ]\n'

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
	}

	// deletes the node and it's attached audio node(s)
	remove() {
		WaspTree.removeNode(this)
		delete this
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

	// takes a connection - takes either a node object or an id
	connect(node,prop) {
		WaspTree.connect({from: this, to: node, prop: prop}) 
	}

	// deletes a connection - takes either a node object or an id
	disconnect(node,prop) {
		WaspTree.disconnect({from: this, to: node, prop: prop})
	}

	// loops through all connections and deletes them
	disconnectAll() {

	}

}

class _Gain_ extends WaspNode {
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

class _Oscillator_ extends WaspNode {
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
		}

		console.error ('cannot set unknown prop')
	}

}

class _Analyzer_ extends WaspNode {
	constructor(ctx,id) {
		super(ctx,id)
		this.node = ctx.createAnalyser()
	}
}

class _Destination_ extends WaspNode {
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

export {
	_Gain_ as Gain
	,_Oscillator_ as Oscillator
	,_Analyzer_ as Analyzer
	,_Destination_ as Destination 
}
