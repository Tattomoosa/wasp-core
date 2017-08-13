let Check = {}

Check.connection = function (from,to,prop) {

	let outputs = from.io ?
		from.io.outputs : null

	for (let i in outputs) { 
		if (
			outputs[i].toNode == to &&
			outputs[i].toProp == prop
		) {
			return true
		}
	}

	return false

}

export default Check
