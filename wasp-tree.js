//wasptree does all the state management
//wasptree is a singleton and should be included in wasp.js

import NodeFactory from './node-factory'
import check from './util/check.js'
import Log from './util/log'

const WaspTree = (function() {

	const history = []
	const store = {}
	const undoSize = 20
	let undoStep = 0
	let id = -1
	let logg = new Log()

	function log () {
		logger('Log')
		console.log ('STORE:\n',store,'\nHISTORY:\n',history)
		console.log ('undo step is '+undoStep)
		console.log ( logg.event ( { operation : 'Add' } ) )
	}

	function addNode (node, options) {
		options = options || {}
		let {
			undo : undoOp = false
			, redo : redoOp = false
			, noUndo = false
		} = options

		let success = true
		let message = ''

		// default, for undo/redo
		let localId = node.id

		if (!undoOp) {
			if (redoOp) {
					node.changeId(localId)
			} else {
				id += 1
				localId = id
				undo.reset()
				//if we got passed a string, make a new node
				if (typeof node === 'string') {
					makeNewNode(this.audioContext)
				} else {
					//if we got passed an existing node
					//we perform a deep copy
					node = node.copy()
				}
			}
			//node.id = id
			//history.push({op: addNode, node: node})
			if (!redoOp && !undoOp && !noUndo) {
				history.push(
					(doUndo) => {
						if (doUndo) {
							removeNode(node, {undo: true})
							}
						else {
							addNode (node, {redo: true})
							}
						}
					)
				}
			}

		if (store.localId) {
			console.log('shit - we got duplicate ids\nyou should find out why')
			success = false
		}

		//debug
		logger('Add', {
			node: node
			, undoOp: undoOp
			, redoOp: redoOp
			, step: undoStep
			, success: success
			, message: message
		})
		if (!success) {
			return
		}

		store[localId] = node

		return node

		function makeNewNode (ctx) {
				let nodestr = node
				//make a new node of type
				node = NodeFactory.create( {
					type: node
					, audioContext: ctx
					, id: id})
				//if we fail
				if (!node) {
					success = false
					node = {name: nodestr}
					message = 'Cannot create node: ' + nodestr + ' is not a valid type\n'
				}
		}
	}

	function removeNode (node, options) {
		options = options || {}
		let {
			undo : undoOp = false
			,redo : redoOp = false
		} = options

		let {success,message} = nodeExists(node)

		if (typeof node === 'number') {
			node = store[node]
		}

		if (node.id <=0) {
				success = false
				message += 'Cannot remove reserved node!'
		}

		//debug
		logger('Remove', {
			node: node
			,undoOp: undoOp
			,redoOp: redoOp
			,step: undoStep
			,success: success
			,message: message
		})

		if (!success) {
			return false
		}

		if (!undoOp && !redoOp) {
				undo.reset()
			//history.push({op: removeNode, node: node})
			history.push(
				(doUndo) => {
					doUndo ?
						addNode(node, {undo: true}) :
						removeNode(node, {redo: true})
					}
			)
		}

		delete store[node.id]

	}

	function connect ({from,to,prop},options) {

		options = options || {}
		prop = prop || false
		let {
			undo : undoOp = false
			, redo : redoOp = false
		} = options

		let {
			success: success1
			,message: message1
		} = nodeExists(from)
		if (!success1) from = {name: 'INVALID NODE.' + (from.id || from) }
		let {
			success: success2
			,message: message2
		} = nodeExists(to)
		if (!success2) to = {name: 'INVALID NODE.' + (to.id || to) }

		//in case we got ID numbers
		if (typeof from === 'number') from = store[from]
		if (typeof to === 'number') to = store[to]

		let success = success1 && success2
		let message = message1 + message2

		if (success2 && prop) {
			let {
				success: success3
				,message: message3
			} = propExists(to,prop)
			success = success && success3
			message = message + message3
		}

		if (
			success &&
			check.connection(from,to,prop)
		) {
			success = false
			message += 'Connection already exists \n'
		}

		//sends a log of the action
		logger('Connect', {
			from: from
			,to: to
			,prop: prop
			,undoOp: undoOp
			,redoOp: redoOp
			,step: undoStep
			,success: success
			,message: message
		})

		if (!success) {
			return false
		}

		{
			let output = from.io.outputs
			let input = to.io.inputs
			
			//ok now do the magic
			output.push({
				toNode: to
				,toProp: prop
			})
			input.push({
				fromNode: from
				,toProp: prop
			})

			//the audionode connection
			prop ?
				from.node.connect(to.node[prop]) :
				from.node.connect(to.node)
		}

		//we don't do these things during an undo/redo
		if (!undoOp && !redoOp) {
			undo.reset()
			//push the opposite function
			history.push((doUndo) =>
				doUndo ?
					disconnect({
						from: from
						, to: to
						, prop: prop},
						{undo: true}) :
						connect({
							from: from
							, to: to
							, prop: prop
							},
							{redo: true})

				)
			}
	}

	function disconnect ( { from, to, prop }, options ) {
		options = options || {}
		let {
			undo : undoOp = false
			,redo : redoOp = false
			} = options

		prop = prop || false


		let {
			success: success1
			, message: message1
		} = nodeExists(from)
		if (!success1) from = { name: 'INVALID NODE.' + (from.id || from) }
		let {
			success: success2
			, message: message2
		} = nodeExists(to)
		if (!success2) to = { name: 'INVALID NODE.' + (to.id || to) }

		//in case we got ID numbers
		if (typeof from === 'number') from = store[from]
		if (typeof to === 'number') to = store[to]


		let success = success1 && success2
		let message = message1 + message2

		if (!check.connection(from,to,prop)) {
			success = false
			message += 'Connection does not exist \n'
		}

		logger('Disconnect', {
			from: from
			,to: to
			,prop: prop
			,undoOp: undoOp
			,redoOp: redoOp
			,step: undoStep
			,success: success
			,message: message
		})

		if (!success) {return}

		let outputs = from.io.outputs

		for (let i in outputs) {
			if (outputs[i].toNode == to &&
					outputs[i].toProp == prop)
			{
				outputs.splice(i,1)
			}
		}

		prop ?
			from.node.disconnect(to.node[prop]) :
			from.node.disconnect(to.node)

		//we don't do these things during an undo
		if (!undoOp && !redoOp) {
			undo.reset()
			//push the opposite function
			history.push((doUndo) =>
				doUndo ?
				connect(
					{
						from: from
						,to: to
						,prop: prop
					}
						,{undo: true}
					) :
				disconnect(
					{
						from: from
						, to: to
						}
						,{redo: true}
					)
			)
		}
	}

	function undo () {

		//console.log(undoStep)
		if (undoStep < history.length) {
				undoStep+=1
				history.slice(-undoStep)[0](true)
			} else {
				logger('Undo', { 
					undoOp: true
					, success: false
					, message: 'Bottom of undo stack, nothing to undo'
					})
			}
		}

	function redo () {
		//can't redo if we're at the very first undo step
		if (undoStep > 0) {
			history.slice(-undoStep)[0](false)
			undoStep -= 1
			} else {
				logger('Redo', {
					redoOp: true
					, success: false
					, message: 'Top of redo stack, nothing to redo'
					})
			}
		}

	//undo step is reset to zero after new actions
	undo.reset = function () {
		let cut = history.splice(history.length-undoStep)
		//console.log("Undo Reset")
		undoStep = 0
	}

	//makes sure a node exists in the tree
	//takes an ID or a whole waspNode object
	function nodeExists (node) {
		//if we were passed an object
		//we gotta check for id numbers here
		if (typeof node === 'object') node = node.id
		// let node = store[id] || node
		if (store[node]) {
			return {success: true, message: ''}
		}
		return {
			success: false
			,message: 'Node ID:"' + node + '" does not exist\n'
		}
	}

	function propExists (node,prop) {
		if (typeof node === 'number') node = store[node]
		if (node.validateProp(prop)) return {success: true, message: ''}
		return {
			success: false
			,message: 'Prop "' + prop + '" does not exist on node "' + node.name + '"\n'
		}
	}

	return ({
		addNode: addNode
		, removeNode: removeNode
		, log: log
		, connect: connect
		, disconnect: disconnect
		, undo: undo
		, redo: redo
	})
})()

//hehe treelogger
let logger = function(op, options) {
	options = options || {}
	let {
		node
		,to
		,from
		,prop=false
		,step=-1
		,lineLength=180
		,undoOp = false
		,redoOp = false
		,success = true
		,message = ''
	} = options

	let icon
	let header=''
	let iconStyle =''
	let normalStyle = 'background: white; color: #333;'
	let toOrFrom = ''
	let errorStyle = 'background: #f22; color: white;'

	switch (op) {
		case 'Add' :
			iconStyle='background: #46e; color: white;'
			icon='+'
			break
		case 'Remove' :
			iconStyle='background: #c34; color: white;'
			icon='-'
			break
		case 'Connect' :
			iconStyle='background: #295; color: white;'
			icon='&'
			toOrFrom = 'to'
			break
		case 'Disconnect' :
			iconStyle='background: #bc2; color: white;'
			icon='/'
			toOrFrom = 'from'
			break
		case 'Log' :
			iconStyle='background: #c77; color: white;'
			icon='"'
			break
		//unused
		case 'ERROR!!' :
			iconStyle='background: #f00; color: white'
			icon='!'
			break
		default :
			icon=''
	}

	if (undoOp==true) {
		if (success) {
			op = 'Undo ' + step + ' : '+ op
			icon='< ' + icon
			iconStyle='background: #555; color: white;'
		} else {
			icon='<'
		}
	}

	if (redoOp==true) {
		if (success) {
			op = 'Redo ' + step + ' : ' + op
			iconStyle='background: #999; color: white;'
			icon='> ' + icon
		} else {
			icon='>'
		}
	}

	if (!success) {
		op += ' Failed'
		message = '\n\n' + message
		icon = 'X ' + icon
		iconStyle='background: #f22; color: white;'
		// message = '%c[  X  ]%c ' + message 
	}

	if (icon.length == 1) {
		icon = '[ ' + icon + ' ]'
		} else {
			icon = '[' + icon + ']'
			}

	header = op

	node = node || from

	if (typeof node != 'undefined') {
		header += ' ' + node.name
		if (typeof to != 'undefined') {
			header += ' ' + toOrFrom + ' ' + to.name
		}
		if (prop != false) {
			header += ':' + prop
		}
	} else {
	}

	header = pad(header)


	console.log(
		'%c'+ icon
		+ '%c'+ header
		+ message
		, iconStyle
		, normalStyle
		// , errorStyle
		// , normalStyle
	)

	function pad(string,length) {
		length = length || lineLength
		string= ' ' + string
		while (string.length<length) {
			string = string + ' '
		}
		return string
	}

}

export default WaspTree
