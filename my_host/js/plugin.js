var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
var oscillateur = contexteAudio.createOscillator();
var noeudGain = contexteAudio.createGain();
var lowpassFilter = 0;
lowpassFilter = contexteAudio.createBiquadFilter();
oscillateur.connect(noeudGain);
oscillateur.connect(lowpassFilter);
noeudGain.connect(contexteAudio.destination);
lowpassFilter.connect(contexteAudio.destination);

function set_oscillator_freq(){
	oscillateur.frequency.value = document.querySelector("#oscillator_frequency").value;
}

function start(){
	oscillateur.start();
}

function stop(){
	oscillateur.stop();
}