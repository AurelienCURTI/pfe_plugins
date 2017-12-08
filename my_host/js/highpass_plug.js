var highpassDoc = document.currentScript.ownerDocument; // Ici, la variable document correspond au document de index.html. Avec helloDoc, on s'assure de bien accéder le document de highpass.html
var highpass_plugin = document.registerElement('highpass-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		audioCtx: {
			value: null,        // valeur par défaut de l'attribut
			writable: true,
			enumerable: true,
			configurable: true
		},
		highpassFilterNode: {
			value: null,        // valeur par défaut de l'attribut
			writable: true,
			enumerable: true,
			configurable: true
		},
		gainNode: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		createdCallback: { // exécuté à chaque création d'un élément <hello-world>
			value: function() {
				var root = this.createShadowRoot();
				var template = highpassDoc.querySelector('#hp_template'); // on cherche #template directement dans le DOM de hello-world.html
				var clone = document.importNode(template.content, true);
				var container = this.getAttribute("container"); //Data binding de la variable container

				//Envoi d'evenement
				var evt = highpassDoc.createEvent("CustomEvent");
				evt.initCustomEvent("add_plugin", true, true, this);
				this.dispatchEvent(evt);
			  
				root.appendChild(clone);
			}	
		},
		connect: {
			value: function(ctx, src, dest){
				this.audioCtx = ctx;
				this.highpassFilterNode = this.audioCtx.createBiquadFilter();
				this.highpassFilterNode.type = "highpass";
				this.gainNode = this.audioCtx.createGain();
				src.connect(this.highpassFilterNode);
				this.highpassFilterNode.connect(this.gainNode);
				this.gainNode.connect(dest);
			}
		},
		disconnect: {
			value: function(src, dest){
				this.highpassFilterNode.disconnect(src);
				this.highpassFilterNode.disconnect(dest);
				src.connect(dest);
			}
		},
		getParams: {
			value: function(){}
		},
		getRender: {
			value: function(obj, id_div_to_append){
				var template_component = highpassDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
				//Set listeners on buttons and sliders
				document.querySelector('#hpass_freq').oninput = function (){
					var val = parseInt(document.querySelector('#hpass_freq').value);
					obj.setParam('freq', val);
					document.querySelector("#freq_val").innerText = val;
				}
				document.querySelector('#hpass_detune').oninput = function (){
					var val = parseInt(document.querySelector('#hpass_detune').value);
					obj.setParam('detune', val);
					document.querySelector("#detune_val").innerText = val;
				}
				document.querySelector('#hpass_q').oninput = function (){
					var val = parseInt(document.querySelector('#hpass_q').value);
					obj.setParam('Q', val);
					document.querySelector("#Q_val").innerText = val;
				}
				document.querySelector('#hpass_gain').oninput = function (){
					var val = parseFloat(document.querySelector('#hpass_gain').value);
					obj.setParam('gain', val);
					document.querySelector("#gain_val").innerText = val;
				}
				document.querySelector('#activate').onclick = function (){
					obj.activate();
				}
				document.querySelector('#disable').onclick = function (){
					obj.bypass();
				}
			}
		},
		getPluginName:	{
			value: function(){
				return "highpass-plugin";
			}
		},
		setParam: {
			value: function(param, val) {
				switch(param){
					case "freq":
						this.highpassFilterNode.frequency.setValueAtTime(parseInt(val), null);
					break;
					case "detune":
						this.highpassFilterNode.detune.setValueAtTime(parseInt(val), null);
					break;
					case "gain":
						this.highpassFilterNode.gain.setValueAtTime(parseFloat(val), null);
					break;
					case "Q":
						this.highpassFilterNode.Q.setValueAtTime(parseInt(val), null);
					break;
					default:
						console.log("Le parametre specifie est inconnu.");
					break;
				};
			}
		},
		activate: {
			value: function(){
				if(this.gainNode.gain != 1){
					this.gainNode.gain.setValueAtTime(1, null);
				}
			}
		},
		bypass : {
			value: function(){
				if(this.gainNode.gain != 0){
					this.gainNode.gain.setValueAtTime(0, null);
				}
			}
		}
	})
  });