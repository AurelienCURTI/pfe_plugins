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
				var template = delayDoc.querySelector('#hp_template'); // on cherche #template directement dans le DOM du plugin
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
			value: function(obj, id_div_to_append){
				var template_component = delayDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
				//Set listeners on buttons et sliders
				document.querySelector('#delay_feedback').oninput = function (){
					var val = parseFloat(document.querySelector('#delay_feedback').value);
					obj.setParam('delay', val);
					document.querySelector("#feedback_val").innerText = val;
				}
				document.querySelector('#activate').onclick = function (){
					obj.activate();
				}
				document.querySelector('#disable').onclick = function (){
					obj.bypass();
				}
				
			}
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

