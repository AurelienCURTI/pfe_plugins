//variables globales 
var flangerFilter;

// The flanger produces a swirling effect by delaying a "copy" of the sound by a small, 
//gradually changing period

var flangerDoc = document.currentScript.ownerDocument; 
var flanger_plugin = document.registerElement('flanger-plugin', {
    prototype: Object.create(HTMLElement.prototype, {

    	plugin_name: {
			value: "flanger-plugin",
			writable: false,
			enumerable: true,
			configurable: true
		},
		audioCtx: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerInput: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerWetGainFilter: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerDelayFilter: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerGainFilter: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerFeedbackFilter: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		flangerOscilFilter: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		
		createdCallback: { // exécuté à chaque création d'un élément <hello-world>
			value: function() {
				var root = this.createShadowRoot();
				var template = flangerDoc.querySelector('#hp_template'); // on cherche #template directement dans le DOM de hello-world.html
				var clone = document.importNode(template.content, true);
				var container = this.getAttribute("container"); //Data binding de la variable container
				var idComponent = this.id;
				//Envoi d'evenement
				var evt = flangerDoc.createEvent("CustomEvent");
				evt.initCustomEvent("add_plugin", true, true, this);
				this.dispatchEvent(evt);
			  
				root.appendChild(clone);

				root.querySelector('#flanger_time').oninput = function(){
					document.querySelector('flanger-plugin#'+idComponent).setParam('time', root.querySelector('#flanger_time').value);
				};
				root.querySelector('#flanger_speed').oninput = function(){
					document.querySelector('flanger-plugin#'+idComponent).setParam('speed', root.querySelector('#flanger_speed').value);
				};
				root.querySelector('#flanger_depth').oninput = function(){
					document.querySelector('flanger-plugin#'+idComponent).setParam('depth', root.querySelector('#flanger_depth').value);
				};
				root.querySelector('#flanger_feedback').oninput = function(){
					document.querySelector('flanger-plugin#'+idComponent).setParam('feedback', root.querySelector('#flanger_feedback').value);
				};
				root.querySelector('#activate').onclick = function(){
					document.querySelector('flanger-plugin#'+idComponent).activate();
				};
				root.querySelector('#disable').onclick = function(){
					document.querySelector('flanger-plugin#'+idComponent).bypass();
				};
			}	
		},
		connect: {
			value: function(ctx, src, dest){
				this.audioCtx = ctx; 
				//input
				this.flangerInput = this.audioCtx.createGain();
				//noeud du wetGain
				this.flangerWetGainFilter = this.audioCtx.createGain();
				this.flangerWetGainFilter.type = "flanger";
				//noeud du delay
				this.flangerDelayFilter = this.audioCtx.createDelay();
				this.flangerDelayFilter.type = "flanger";
				//noeud du gain
				this.flangerGainFilter = this.audioCtx.createGain();
				this.flangerGainFilter.type = "flanger";
				//noeud du feedback
				this.flangerFeedbackFilter = this.audioCtx.createGain();
				//noeud de l'oscillateur
				this.flangerOscilFilter = this.audioCtx.createOscillator();

				//on connecte tout
				src.connect(this.flangerInput);
				this.flangerOscilFilter.connect(this.flangerGainFilter);
				this.flangerGainFilter.connect(this.flangerDelayFilter.delayTime);
				this.flangerInput.connect(this.flangerWetGainFilter);
				this.flangerInput.connect(this.flangerDelayFilter);
				this.flangerDelayFilter.connect(this.flangerWetGainFilter);
				this.flangerDelayFilter.connect(this.flangerFeedbackFilter);
				this.flangerFeedbackFilter.connect(this.flangerInput);
				this.flangerWetGainFilter.connect(dest);
			}
		},
		disconnect: {
			value: function(src, dest){
				this.flangerInput.disconnect(src);
				this.flangerInput.disconnect(this.flangerWetGainFilter);
				this.flangerInput.disconnect(this.flangerDelayFilter);

				this.flangerDelayFilter.disconnect(this.flangerWetGainFilter);
				this.flangerDelayFilter.disconnect(this.flangerFeedbackFilter);

				this.flangerGainFilter.disconnect(this.flangerDelayFilter.delayTime);

				this.flangerFeedbackFilter.disconnect(this.flangerInput);

				this.flangerOscilFilter.disconnect(this.flangerGainFilter);

				this.flangerWetGainFilter.disconnect(dest);
				

				src.connect(dest);
			}
		},
		getParams: {
			value: function(){}
		},
		getRender: {
			value: function(id_div_to_append){
				var template_component = flangerDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
			}
		},
		getPluginName:	{
			value: function(){
				return "flanger-plugin";
			}
		},
		setParam: {
			value: function(param, val) {
				switch(param){
					case "time":
						this.flangerDelayFilter.delayTime.setValueAtTime(parseFloat(val), null);
						document.querySelector('flanger-plugin#'+this.id).shadowRoot.querySelector('#time_val').innerHTML = parseFloat(val);
					break;
					case "speed":
						this.flangerOscilFilter.frequency.setValueAtTime(parseFloat(val), null);
						document.querySelector('flanger-plugin#'+this.id).shadowRoot.querySelector('#speed_val').innerHTML = parseFloat(val);
					break;
					case "depth":
						this.flangerGainFilter.gain.setValueAtTime(parseFloat(val), null);
						document.querySelector('flanger-plugin#'+this.id).shadowRoot.querySelector('#depth_val').innerHTML = parseFloat(val);
					break;
					case "feedback":
						this.flangerFeedbackFilter.gain.setValueAtTime(parseFloat(val), null);
						document.querySelector('flanger-plugin#'+this.id).shadowRoot.querySelector('#feedback_val').innerHTML = parseFloat(val);
					break;
					default:
						console.log("Le parametre specifie est inconnu.");
					break;
				};
			}
		},
		activate: {
			value: function(){
				if(this.flangerInput.gain != 1){
					this.flangerInput.gain.setValueAtTime(1, null);
				}
			}
		},
		bypass : {
			value: function(){
				if(this.flangerInput.gain != 0){
					this.flangerInput.gain.setValueAtTime(0, null);
				}
			}
		}

	})
  });

// // Changes the small delay time applied to the copied signal.
// // fonctionne avec le delay
// function setTime(val){
// 	flangerDelayFilter.delayTime.value = parseFloat(val);
// 	document.querySelector("#time_val").innerText = parseFloat(val);
// }

// // Changes the speed at which the flanging occurs.
// //fonctionne avec l'oscillateur
// function setSpeed(val){
// 	flangerOscilFilter.frequency.value = parseFloat(val);
// 	document.querySelector("#speed_val").innerText = parseFloat(val);
// }

// // Changes the depth/intensity of the swirling effect.
// function setDepth(val){
// 	flangerGainFilter.gain.value = parseFloat(val);
// 	document.querySelector("#depth_val").innerText = parseFloat(val);
// }

// // Changes the volume of the delayed sound.
// function setFeedback(val){
// 	flangerFeedbackFilter.gain.value = parseFloat(val);
// 	document.querySelector("#feedback_val").innerText = parseFloat(val);
// }

// Volume balance between the original audio and the effected output.
// function setMix(val){
// 	flangerGainFilter.gain.value = parseFloat(val);
// 	document.querySelector("#mix_val").innerText = parseFloat(val);
// }