//variables globales 
var delayFilter;

var delayDoc = document.currentScript.ownerDocument; 
var delay_plugin = document.registerElement('delay-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		container: {                 // optionnel si on n'a pas besoin de valeur par défaut
			value: "body",        // valeur par défaut de l'attribut name
			writable: true,
			enumerable: true,
			configurable: true
		},
		getRender: {
			value: function(id_div_to_append){
				var template_component = delayDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
			}
		},
		createdCallback: { // exécuté à chaque création d'un élément 
			value: function() {
				var root = this.createShadowRoot();
				var template = delayDoc.querySelector('#hp_template'); // on cherche #template directement dans le DOM du plugin
				var clone = document.importNode(template.content, true);
				var container = this.getAttribute("container"); //Data binding de la variable container

				//clone.querySelector('#show_component').onclick = function() {this.getRender(container)};

				//Envoi d'evenement
				var evt = highpassDoc.createEvent("CustomEvent");
				evt.initCustomEvent("add_plugin", true, true, this);
				this.dispatchEvent(evt);

				root.appendChild(clone);
			}	
		},
		connect: {
			value: function(ctx, nodeIn, nodeOut){
				delayFilter = ctx.createDelay();
				delayFilter.type = "delay";
				nodeIn.connect(delayFilter);
				delayFilter.connect(nodeOut);
			}
		},
		disconnect: {
			value: function(nodeIn, nodeOut){
				delayFilter.disconnect(nodeIn);
				delayFilter.disconnect(nodeOut);
				nodeIn.connect(nodeOut);
			}
		},
		getParams: {
			value: function(){}
		},
		getPluginName:	{
			value: function(){
				return "delay-plugin";
			}
		}
	})
  });

/*function getRender(id_div_to_append){
	var template_component = delayDoc.querySelector("#content_component").innerHTML;
	document.querySelector(id_div_to_append).innerHTML += template_component;
}*/

function setDelay(val){
	delayFilter.delayTime.value = parseFloat(val);
	document.querySelector("#feedback_val").innerText = parseFloat(val);
}

