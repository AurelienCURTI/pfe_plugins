var delayDoc = document.currentScript.ownerDocument; 
var delay_plugin = document.registerElement('delay-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		audioCtx: {
			value: null,        // valeur par défaut de l'attribut
			writable: true,
			enumerable: true,
			configurable: true
		},
		delayFilter: {
			value: null,        // valeur par défaut de l'attribut
			writable: true,
			enumerable: true,
			configurable: true
		},
		
		container: {                 // optionnel si on n'a pas besoin de valeur par défaut
			value: "body",        // valeur par défaut de l'attribut name
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
				this.delayFilter = this.audioCtx.createDelay();
				this.delayFilter.type = "delay";
				src.connect(this.delayFilter);
				this.delayFilter.connect(dest);
			}
		},
		disconnect: {
			value: function(src, dest){
				this.delayFilter.disconnect(dest);
				this.delayFilter.disconnect(dest);
				src.connect(dest);
			}
		},
		getRender: {
			value: function(obj, id_div_to_append){
				var template_component = delayDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
				//Set listeners to sliders
				document.querySelector('#delay_feedback').oninput = function (){
					var val = parseFloat(document.querySelector('#delay_feedback').value);
					obj.setParam('delay', val);
					document.querySelector("#feedback_val").innerText = val;
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
						this.delayFilter.delayTime.setValueAtTime(parseFloat(val), null);
					break;
					default:
						console.log("Le parametre specifie est inconnu.");
					break;
				};
			}
		}
	})
  });

