var delayDoc = document.currentScript.ownerDocument; 
var delay_plugin = document.registerElement('delay-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		audioCtx: {
			value: null,
			writable: true,
			enumerable: true,
			configurable: true
		},
		delayFilterNode: {
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
		container: {
			value: "body",
			writable: true,
			enumerable: true,
			configurable: true
		},
		createdCallback: { // exécuté à chaque création d'un élément 
			value: function() {
				var root = this.createShadowRoot();
				var template = delayDoc.querySelector('#delay_template'); // on cherche #template directement dans le DOM du plugin
				var clone = document.importNode(template.content, true);
				var container = this.getAttribute("container"); //Data binding de la variable container
				
				//Envoi d'evenement
				var evt = delayDoc.createEvent("CustomEvent");
				evt.initCustomEvent("add_plugin", true, true, this);
				this.dispatchEvent(evt);

				root.appendChild(clone);
			}	
		},
		connect: {
			value: function(ctx, src, dest){
				this.audioCtx = ctx;
				this.delayFilterNode = this.audioCtx.createDelay();
				this.delayFilterNode.type = "delay";
				this.gainNode = this.audioCtx.createGain();
				src.connect(this.delayFilterNode);
				this.delayFilterNode.connect(this.gainNode);
				this.gainNode.connect(dest);
			}
		},
		disconnect: {
			value: function(src, dest){
				this.delayFilterNode.disconnect(dest);
				this.delayFilterNode.disconnect(dest);
				src.connect(dest);
			}
		},
		getRender: {
			value: function(){}
		},
		getParams: {
			value: function(){}
		},
		getPluginName:	{
			value: function(){
				return "delay-plugin";
			}
		},
		setParam: {
			value: function(param, val) {
				switch(param){
					case "delay":
						this.delayFilterNode.delayTime.setValueAtTime(parseFloat(val), null);
						document.querySelector('delay-plugin').shadowRoot.querySelector('#delay_val').innerHTML = parseFloat(val);
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

