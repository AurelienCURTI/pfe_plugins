var ctxAudio = new (window.AudioContext || window.webkitAudioContext)();

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
			var delay = document.createElement("delay-plugin");
			delay.setAttribute("id", 'delay-plugin-'+count);
			delay.init(ctxAudio, 256);
			delay.connect(source, ctxAudio.destination);
			console.log(delay.getDatas());
			document.querySelector('#pedalboard').appendChild(delay);
		break;
		case 'highpass':
			var count = document.querySelectorAll('highpass-plugin').length;
			var highpass = document.createElement("highpass-plugin");
			highpass.setAttribute("id", 'highpass-plugin-'+count);
			highpass.init(ctxAudio, 256);
			highpass.connect(source, ctxAudio.destination);
			console.log(highpass.getDatas());
			document.querySelector('#pedalboard').appendChild(highpass);
		break;
		case 'flanger':
			var count = document.querySelectorAll('flanger-plugin').length;
			var flanger = document.createElement("flanger-plugin");
			flanger.setAttribute("id", 'flanger-plugin-'+count);
			flanger.init(ctxAudio, 256);
			flanger.connect(source, ctxAudio.destination);
			console.log(flanger.getDatas());
			document.querySelector('#pedalboard').appendChild(flanger);
		break;
		case 'webdx7':
			var count = document.querySelectorAll('wam-webdx7').length;
			var webdx7 = document.createElement("wam-webdx7");
			webdx7.setAttribute("id", 'wam-webdx7-'+count);
			webdx7.init(ctxAudio, 256).then( function(controller)
			{
			  controller.connect(gainNode);
			});
			document.querySelector('#pedalboard').appendChild(webdx7);
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
	
}, true);