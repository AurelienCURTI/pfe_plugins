var highpassDoc = document.currentScript.ownerDocument; // Ici, la variable document correspond au document de index.html. Avec helloDoc, on s'assure de bien accéder le document de highpass.html
var highpass_plugin = document.registerElement('highpass-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		plugin_name: {
			value: "highpass-plugin",
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
		highpassFilterNode: {
			value: null,
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
		createdCallback: { // exécuté à chaque création d'un élément
			value: function() {
				var root = this.createShadowRoot();
				var template = highpassDoc.querySelector('#hp_template'); // on cherche #template directement dans le DOM de hello-world.html
				var clone = document.importNode(template.content, true);
				var idComponent = this.id;
				//Envoi d'evenement
				var evt = highpassDoc.createEvent("CustomEvent");
				evt.initCustomEvent("add_plugin", true, true, this);
				this.dispatchEvent(evt);
			  
				root.appendChild(clone);
				//Set listeners
				root.querySelector('#hpass_freq').oninput = function(){
					document.querySelector('highpass-plugin#'+idComponent).setParam('freq', root.querySelector('#hpass_freq').value);
				};
				root.querySelector('#hpass_detune').oninput = function(){
					document.querySelector('highpass-plugin#'+idComponent).setParam('detune', root.querySelector('#hpass_detune').value);
				};
				root.querySelector('#hpass_q').oninput = function(){
					document.querySelector('highpass-plugin#'+idComponent).setParam('Q', root.querySelector('#hpass_q').value);
				};
				root.querySelector('#hpass_gain').oninput = function(){
					document.querySelector('highpass-plugin#'+idComponent).setParam('gain', root.querySelector('#hpass_gain').value);
				};
				root.querySelector('#activate').onclick = function(){
					document.querySelector('highpass-plugin#'+idComponent).activate();
				};
				root.querySelector('#disable').onclick = function(){
					document.querySelector('highpass-plugin#'+idComponent).bypass();
				};
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
			value: function(){}
		},
		getPluginName:	{
			value: function(){
				return this.plugin_name;
			}
		},
		setParam: {
			value: function(param, val) {
				switch(param){
					case "freq":
						this.highpassFilterNode.frequency.setValueAtTime(parseInt(val), null);
						document.querySelector('highpass-plugin#'+this.id).shadowRoot.querySelector('#freq_val').innerHTML = parseInt(val);
					break;
					case "detune":
						this.highpassFilterNode.detune.setValueAtTime(parseInt(val), null);
						document.querySelector('highpass-plugin#'+this.id).shadowRoot.querySelector('#detune_val').innerHTML = parseInt(val);
					break;
					case "Q":
						this.highpassFilterNode.Q.setValueAtTime(parseInt(val), null);
						document.querySelector('highpass-plugin#'+this.id).shadowRoot.querySelector('#Q_val').innerHTML = parseInt(val);
					break;
					case "gain":
						this.highpassFilterNode.gain.setValueAtTime(parseFloat(val), null);
						document.querySelector('highpass-plugin#'+this.id).shadowRoot.querySelector('#gain_val').innerHTML = parseFloat(val);
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