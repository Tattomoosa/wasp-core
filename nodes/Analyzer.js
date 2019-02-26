import { WaspNode } from './WaspNode'

class Analyzer extends WaspNode {
	constructor(ctx,id) {
		super(ctx,id)
		this.node = ctx.createAnalyser()
	}
}

export { Analyzer as Analyzer }
