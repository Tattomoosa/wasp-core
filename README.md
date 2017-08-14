# Wasp-Core

This is a framework to facilitate interacting with the Web Audio API.
It is lower level and more customizable than most other javascript audio frameworks.
Basically, WASP-CORE adds
an interface to make complex WASP nodes from several AudioNodes,
a navigable node tree,
'control signals' a la Max/MSP,
save and load-able JSON format to facilitate re-use across projects, and undo/redo functionality.

It is useful for complex audio synthesis
but if you just want to play and manipulate sounds easily, you may want to look for another library.

## Usage

```javascript
let wasp = new Wasp ();
let osc = wasp.create ( 'oscillator' );
let gain = wasp.create ( 'gain' );

//run actions either through wasp
wasp.connect( osc, gain );

//or the node itself
gain.connect( wasp.master ); 

```

most actions can be chained:

```javascript
let osc2 = wasp.create ( 'oscillator' )
	.set('frequency', 200)
	.set('waveform', 'square')
	.connect(gain)
```

Watch out for the setters.
```javascript
// TODO DOES THIS WORK with the setter?
control.value = 50
control.transformFunction = (n) => {return n*80}
```

```javascript
wasp.connect ( osc, osc2, 'frequency'})

let val = wasp.create( 'control' );
val.connect ( { gain, 'gain' } );
val.value = .7;
console.log( gain.node.value ) // .7;

//nothing that follows is implemented really, but this is how
//complex nodes will be handled soon.
let synth = wasp.load( json );
synth.get('inputs') // ['pitch', 'LFO', 'EQ Band 1'] CUSTOM PARAMS

```
## API

The Wasp object is a singleton and contains the following methods:
```javascript
wasp.create( 'node type' )
wasp.remove( node || id )
wasp.connect( from, to, prop ) //no prop means connect to input
wasp.disconnect( from, to, prop )
wasp.undo()
wasp.redo()

```

### AudioNodes

These are wrappers around existing Web Audio Node APIs.

### ControlNode

Control Nodes have no associated audio node. They do not send signals
like an Audio Node would, but instead propogate their value on to all their
connections. Take the following:
```
let ctrl = wasp.create('control');
let osc = wasp.create('oscillator');
ctrl.value = 500;
ctrl.connect(osc, 'frequency');
osc.log('frequency'); // 500
ctrl.value = 900;
osc.log('frequency'); // 900

```

Control Nodes can also be supplied with a transform function:
```
ctrl.value = 10;
ctrl.transformFunction = (n) => {return n*2};
console.log(ctrl.value); // 20
```
And connected to each other:
```
let ctrl = wasp.create('control');
let ctrl2 = wasp.create('control');
ctrl.value = 1;
ctrl2.transformFunction = (n) => {return n+1}
ctrl.connect(ctrl2);
console.log(ctrl2.value); // 2
```

### Racks

Racks are not implemented yet. This is a plan for how they will work.

Racks allow you encapsulate a complex series of nodes into one 'rack', to use a hardware analogy.
A Rack could be a synth sound or a compressor or a whole mastering chain.
Racks are really arbitrary configurations of WASP Nodes with certain user-specified IO.
Racks can be exported as JSON, and even loaded to work without Wasp for performance critical situations.

Initializing a Rack:

```
let osc = wasp.create( 'oscillator' )
let gain = wasp.create( 'gain' )
osc.connect(gain)

let rack = new wasp.rack ( [osc, gain] )
```

Upon initialization, `rack` will have no inputs and no outputs. To interact with a rack, you have to
`expose` it's I/O:

```
rack.expose( osc.frequency, 'oscillator 1 frequency' );
let control = wasp.create( 'control' );
control.value = 50;
control.connect( rack, 'oscillator 1 frequency' );
```

Note that any I/O connected to external nodes upon initialization of the rack will be exposed:
```
let osc = wasp.create( 'oscillator' );
let gain = wasp.create( 'gain' );
let control = wasp.create( 'control' );
control.set(800).connect( osc, 'frequency' )
osc.connect(gain)
gain.connect( wasp.master );

let rack = new wasp.rack ( [osc, gain] );
```

## To Do
* Racks
* Save/Load
* Export as VanillaJS
* Clone

### Contributing
