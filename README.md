#WASP-CORE

This is a framework to facilitate interacting with the Web Audio API.
It is lower level and more customizable than most other javascript audio frameworks.
Basically, WASP-CORE adds
an interface to make complex WASP nodes from several AudioNodes,
makes the node tree navigable,
connect 'control signals' a la Max/MSP,
save and load-able format, and undo/redo functionality.

It is useful for complex audio synthesis but if you just want to play and manipulate sounds easily, you may want to look at another library.
After Wasp-Core is mostly feature complete I will move on to a GUI editor 

##USAGE

```
let wasp = new Wasp ();
let osc = wasp.create ( 'oscillator' );
let osc2 = wasp.create ( 'oscillator' );
let gain = wasp.create ( 'gain' );

let gains = wasp.create ( 'gain', 5 ); //not implemented like this yet

gain.set('value')
wasp.connect( osc, gain ); //osc.connect ( gain ) is the same thing
gain.connect(); 

wasp.connect ( osc, { osc2, 'frequency' } ) //not implemented like this yet

//nothing that follows is implemented really
let val = wasp.create( 'value', { value : .5 } ); //simple control node //not implemented like this yet 
val.connect ( { gain, 'gain' } );
val.set({value : .7});
gain.get('gain') // .7;

let synth = wasp.load( json );
synth.get('inputs') // ['pitch', 'LFO', 'EQ Band 1'] CUSTOM PARAMS

//how shouuld creating a complex node work?

```

##TO DO
* Complex Node Interface
* Control signals
* Save format
