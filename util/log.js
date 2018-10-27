export default class Log {

	constructor( options ) {
		options = options || {}
		let {
			__console__ = console
		} = options
		//Log is a singleton
		if ( typeof Log.__instance__ === 'object' ) {
			return Log.__instance__
		} else {
			Log.__instance__ = this
		}
		this.log = console.log.bind(window.console)
	}

	event ( options ) {
		options = options || {}
		let {
			op = 'NoOp'
			, toNode = 'null'
			, fromNode = 'null'
			, prop = 'null'
			, step = -1
			, undoOp = false
			, redoOp = false
			, success = false
			, message = ''
		} = options

		this.options = options

		let icon = this.generateIcon ()
		let header = this.generateHeader ()

		return ( 'message' )
	}

	generateHeader (  ) {
	}

	generateIcon () {
		let op = this.options.op
		let icon = { glyph: ':(', style: 'background: black; color: grey' }
		switch (op) {
			case 'Add' :
				icon.glyph = '+'
				icon.style = 'background: #46e; ' +
					'color: white;'
				break
			case 'Remove' :
				icon.style = 'background: #c34; ' +
					'color: white;'
				icon.glyph = '-'
				break
			case 'Connect' :
				icon.style = 'background: #295; ' +
					'color: white;'
				icon.glyph = '&'
				toOrFrom = 'to'
				break
			case 'Disconnect' :
				icon.style = 'background: #bc2; ' +
					'color: white;'
				icon.glyph = '/'
				toOrFrom = 'from'
				break
			case 'Log' :
				icon.style = 'background: #c77; ' +
					'color: white;'
				icon.glyph = '"'
				break
			//unused
			case 'ERROR!!' :
				icon.style = 'background: #f00; ' +
					'color: white'
				icon.glyph = '!'
				break
			default :
				icon.glyph = ''
		}

		if (this.options.undoOp==true) {
			if (success) {
				op = 'Undo ' + step + ' : '+ op
				icon.glyph = '< ' + icon
				icon.style = 'background: #555; ' +
					'color: white;'
			} else {
				icon.glyph = '<'
			}
		}

		if (this.options.redoOp==true) {
			if (success) {
				op = 'Redo ' + step + ' : ' + op
				icon.style = 'background: #999; ' +
					'color: white;'
				icon.glyph = '> ' + icon
			} else {
				icon.glyph = '>'
			}
		}

		if (!this.options.success) {
			icon.glyph = 'X ' + icon.glyph
			icon.style = 'background: #f22; ' +
				'color: white;'
			// message = '%c[  X  ]%c ' + message 
		}

		if (icon.glyph.length == 1) {
			icon.glyph = '[ ' + icon + ' ]'
		} else {
			icon.glyph = '[' + icon + ']'
		}

		return icon;

	}
}
