import { WaspNode } from './WaspNode'

//so control signals update any values they are connected to
//whenever their value changes. they do not send audio
//signals and cannot recieve them as input
class Control extends WaspNode {

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

export { Control as Control }
