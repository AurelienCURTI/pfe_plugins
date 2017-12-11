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
			value: function(ctx, nodeIn, nodeOut){
				//input
				flangerInput = ctx.createGain();
				//noeud du wetGain
				flangerWetGainFilter = ctx.createGain();
				flangerWetGainFilter.type = "flanger";
				//noeud du delay
				flangerDelayFilter = ctx.createDelay();
				flangerDelayFilter.type = "flanger";
				//noeud du gain
				flangerGainFilter = ctx.createGain();
				flangerGainFilter.type = "flanger";
				//noeud du feedback
				flangerFeedbackFilter = ctx.createGain();
				//noeud de l'oscillateur
				flangerOscilFilter = ctx.createOscillator();

				//on connecte tout
				nodeIn.connect(flangerInput);
				flangerOscilFilter.connect(flangerGainFilter);
				flangerGainFilter.connect(flangerDelayFilter.delayTime);
				flangerInput.connect(flangerWetGainFilter);
				flangerInput.connect(flangerDelayFilter);
				flangerDelayFilter.connect(flangerWetGainFilter);
				flangerDelayFilter.connect(flangerFeedbackFilter);
				flangerFeedbackFilter.connect(flangerInput);
				flangerWetGainFilter.connect(nodeOut);
			}
		},
		disconnect: {
			value: function(nodeIn, nodeOut){
				flangerInput.disconnect(nodeIn);
				flangerInput.disconnect(nodeOut);

				flangerDelayFilter.disconnect(nodeIn);
				flangerDelayFilter.disconnect(nodeOut);

				flangerGainFilter.disconnect(nodeIn);
				flangerGainFilter.disconnect(nodeOut);

				flangerWetGainFilter.disconnect(nodeIn);
				flangerWetGainFilter.disconnect(nodeOut);

				flangerFeedbackFilter.disconnect(nodeIn);
				flangerFeedbackFilter.disconnect(nodeOut);

				flangerOscilFilter.disconnect(nodeIn);
				flangerOscilFilter.disconnect(nodeOut);

				nodeIn.connect(nodeOut);
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