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

//so control signals update any values they are connected to
//whenever their value changes. they do not send audio
//signals and cannot recieve them as input
class _Control_ extends WaspNode {

	constructor(ctx,id) {
		super(ctx,id)
		this.node = {
			value : 1
			, connect : (to, prop) => {
				//this just needs to exist
				//it doesn't actually need to do anything
				this.propogate()
				}
		}
		this._transformFunction = (n) => n
		}
	
	get value() {
		return this.node.value
	}

	set value(n) {
		this.node._naturalValue = n 
		this.node.value = this._transformFunction (n)
		this.propogate()
	}

	set transformFunction (fn) {
		this._transformFunction = fn
		this.value = this.node._naturalValue
	}

	//propogate updates all connected wasp-nodes whenever the control node is updated
	propogate() {
		let o = this.io.outputs
		//console.log('outputs', o)
		for (let i=0; i < o.length; i++) {
			let {
				toNode,
				toProp
				} = o[i]
			//console.log('propogation event')
			//console.log(i, o, o[i])
			toNode.set(toProp, this.node.value)
		}
	}

}

// everything below is a default audioNode
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

		prop = prop.toLowerCase()
		if ( typeof value == 'string' ) {
			value = value.toLowerCase
		}

		//error check before?

		//is this better or worse than the long switch?
		prop = prop == 'freq' ? 'frequency' : prop
		value = value == 'saw' ? 'sawtooth' : value
		console.log(prop)

		//this.node[prop] = value
		//console.log(this.node.prop, this.node.prop.value)

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
			default:
				console.error ('prop not recognized')
		}

		//console.error ('cannot set unknown prop')
		return this
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
	,_Control_ as Control
	,_Destination_ as Destination 
	, WaspNode as WaspNode
}
