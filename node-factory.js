import { Gain
				 , Oscillator
				 , Analyzer
				 , Destination
			 } from './node-definitions'

const NodeFactory = {}
NodeFactory.create = function(options) {

	let {
		type
		,audioContext
		,id
	} = options

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
	,'DESTINATION' : Destination
}

export default NodeFactory
