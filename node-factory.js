// import { 
// 	//web audio nodes
// 	Gain
// 	, Oscillator
// 	, Analyzer
// 	, Destination

// 	//custom control node
//   , Control
// } from './node-definitions.js'

//Web Audio API Nodes
import { Analyzer } from './node-definitions/Analyzer.js'
import { BiquadFilter } from './node-definitions/BiquadFilter.js'
import { Destination } from './node-definitions/Destination.js'
import { Gain } from './node-definitions/Gain.js'
import { Oscillator } from './node-definitions/Oscillator.js'

//Custom WASP Nodes
import { Control } from './node-definitions/Control.js'



const NodeFactory = {}
NodeFactory.create = function(options) {

	let {
		type
		,audioContext
		,id
	} = options

	//we don't care if the letters are right,
	//this lets us use node's natural names to
	//clone them later
	type = type.toLowerCase()

	let nodeType = nodeLookup[type]
	let waspNode
	if (nodeType) {
		waspNode = new nodeType(audioContext, id)
	} else {
		waspNode = false
	}

	return (
		waspNode
	)
}


let nodeLookup = {
	'gain' : Gain
	,'osc' : Oscillator
	,'oscillator' : Oscillator
	,'analyzer' : Analyzer
	,'analyser' : Analyzer
	,'control' : Control
	,'biquad filter' : BiquadFilter
	,'destination' : Destination
}

export default NodeFactory
