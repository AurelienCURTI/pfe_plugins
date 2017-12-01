var ctxAudio = new (window.AudioContext || window.webkitAudioContext)();

//Source audio oscillateur
var oscillateur = ctxAudio.createOscillator();

var gainNode = ctxAudio.createGain();
var lowpassFilter = 0;
lowpassFilter = ctxAudio.createBiquadFilter();

//Source audio musique
var audio_input = new Audio();
var source = ctxAudio.createMediaElementSource(audio_input);

// Create variables to store mouse pointer Y coordinate
// and HEIGHT of screen
var CurY;
var HEIGHT = window.innerHeight;
// Get new mouse pointer coordinates when mouse is moved
// then set new gain value
document.onmousemove = updatePage;
function updatePage(e) {
	CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	gainNode.gain.value = CurY/HEIGHT;
	audio_input.volume = CurY/HEIGHT;
}
// connect the AudioBufferSourceNode to the gainNode
// and the gainNode to the destination, so we can play the
// music and adjust the volume using the mouse cursor


source.connect(gainNode);
oscillateur.connect(gainNode);
gainNode.connect(lowpassFilter);
lowpassFilter.connect(ctxAudio.destination);


function set_oscillator_freq(){
	oscillateur.frequency.value = document.querySelector("#oscillator_frequency").value;
}

function start_oscil(){
	oscillateur.start();
}

function stop_oscil(){
	oscillateur.stop();
}

