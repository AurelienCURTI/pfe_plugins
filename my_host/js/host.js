var ctxAudio = new (window.AudioContext || window.webkitAudioContext)();

var audio_input, source;
var lastPlugin;
window.onload = init;

function init() {
	audio_input = document.querySelector("audio");
	source = ctxAudio.createMediaElementSource(audio_input);
	source.connect(ctxAudio.destination);
}

function addPlugin(plugin_name){
	lastPlugin = document.querySelector('#pedalboard').lastChild;
	switch(plugin_name){
		case 'delay':
			var count = document.querySelectorAll('delay-plugin').length;
			var delay = document.createElement("delay-plugin");
			delay.setAttribute("id", 'delay-plugin-'+count);
			delay.init(ctxAudio, 256);
			interconnect_plugins(lastPlugin, delay);
			console.log(delay.getDatas());
			document.querySelector('#pedalboard').appendChild(delay);
		break;
		case 'highpass':
			var count = document.querySelectorAll('highpass-plugin').length;
			var highpass = document.createElement("highpass-plugin");
			highpass.setAttribute("id", 'highpass-plugin-'+count);
			highpass.init(ctxAudio, 256);
			interconnect_plugins(lastPlugin, highpass);
			console.log(highpass.getDatas());
			document.querySelector('#pedalboard').appendChild(highpass);
		break;
		case 'lowpass':
			var count = document.querySelectorAll('lowpass-plugin').length;
			var lowpass = document.createElement("lowpass-plugin");
			lowpass.setAttribute("id", 'lowpass-plugin-'+count);
			lowpass.init(ctxAudio, 256);
			interconnect_plugins(lastPlugin, lowpass);
			console.log(lowpass.getDatas());
			document.querySelector('#pedalboard').appendChild(lowpass);
		break;
		case 'flanger':
			var count = document.querySelectorAll('flanger-plugin').length;
			var flanger = document.createElement("flanger-plugin");
			flanger.setAttribute("id", 'flanger-plugin-'+count);
			flanger.init(ctxAudio, 256);
			interconnect_plugins(lastPlugin, flanger);
			console.log(flanger.getDatas());
			document.querySelector('#pedalboard').appendChild(flanger);
		break;
		case 'oscillator':
			var count = document.querySelectorAll('oscillator-plugin').length;
			var oscillator = document.createElement("oscillator-plugin");
			oscillator.setAttribute("id", 'oscillator-plugin-'+count);
			oscillator.init(ctxAudio, 256);
			oscillator.connect(ctxAudio.destination);
			console.log(oscillator.getDatas());
			document.querySelector('#pedalboard').appendChild(oscillator);
		break;
		case 'webdx7':
			var count = document.querySelectorAll('wam-webdx7').length;
			var webdx7 = document.createElement("wam-webdx7");
			webdx7.setAttribute("id", 'wam-webdx7-'+count);
			webdx7.init(ctxAudio, 256).then( function(controller)
			{
			  controller.connect(ctxAudio.destination);
			});
			document.querySelector('#pedalboard').appendChild(webdx7);
		break;
		
		default:
			console.log('Plugin inconnu.');
		break;
		
	}
}

function interconnect_plugins(plug1, plug2){
	if(plug1 !== undefined && plug1 != null){
		plug1.getOutput().disconnect();
		plug1.getOutput().connect(plug2.getInput());
		plug2.connect(ctxAudio.destination);
	}
	else{
		source.disconnect();
		source.connect(plug2.getInput());
		plug2.connect(ctxAudio.destination);
	}
}