import { 
	Gain
	, Oscillator
	, Analyzer
	, Destination

 , Control
} from './node-definitions'

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
	,'destination' : Destination
}

export default NodeFactory
