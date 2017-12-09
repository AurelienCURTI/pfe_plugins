

var ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
//Tableau contenant tous les plugins
var plugins = new Array();

var oscillateur = ctxAudio.createOscillator();

var gainNode = ctxAudio.createGain();
var lowpassFilter = ctxAudio.createBiquadFilter();
var HEIGHT, CurY;
var audio_input, source;

window.onload = init;

function init() {
//Source audio oscillateur
//Source audio musique
audio_input = document.querySelector("audio");
source = ctxAudio.createMediaElementSource(audio_input);

  source.connect(gainNode);
oscillateur.connect(gainNode);
gainNode.connect(lowpassFilter);
lowpassFilter.connect(ctxAudio.destination);


// Create variables to store mouse pointer Y coordinate
// and HEIGHT of screen
CurY;
  HEIGHT = window.innerHeight;
// Get new mouse pointer coordinates when mouse is moved
// then set new gain value
//document.onmousemove = updatePage;
  
}

function updatePage(e) {
	CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	lowpassFilter.detune.value = CurY/HEIGHT;
	source.volume = CurY/HEIGHT;
}
// connect the AudioBufferSourceNode to the gainNode
// and the gainNode to the destination, so we can play the
// music and adjust the volume using the mouse cursor



function set_oscillator_freq(){
	oscillateur.frequency.value = document.querySelector("#oscillator_frequency").value;
}

function start_oscil(){
	oscillateur.start();
}

function stop_oscil(){
	oscillateur.stop();
}

function changeLPfreq(val) {
  val = parseInt(val);
  
  lowpassFilter.frequency.value = val;
}

function addPlugin(plugin_name){
	switch(plugin_name){
		case 'delay':
			var count = document.querySelectorAll('delay-plugin').length;
			document.querySelector('#pedalboard').innerHTML += '<delay-plugin id="delay-plugin-'+count+'"></delay-plugin>';
		break;
		case 'highpass':
			document.querySelector('#pedalboard').innerHTML += '<highpass-plugin></highpass-plugin>';
		break;
		
		default:
			console.log('Plugin inconnu.');
		break;
		
	}
}

/********************************************************************/
/********************************************************************/

//Ecouteurs d'evenement
document.addEventListener('add_plugin', function (event){
	var plugin_name = event.target.getPluginName();
	plugins.push(event.target);
	
	event.detail.connect(ctxAudio, source, ctxAudio.destination);
}, true);