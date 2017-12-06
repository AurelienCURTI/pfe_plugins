//variables globales 
var highpassFilter;

var highpassDoc = document.currentScript.ownerDocument; // Ici, la variable document correspond au document de index.html. Avec helloDoc, on s'assure de bien accéder le document de highpass.html
var highpass_plugin = document.registerElement('highpass-plugin', {
    prototype: Object.create(HTMLElement.prototype, {
		
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
			value: function(ctx, nodeIn, nodeOut){
				highpassFilter = ctx.createBiquadFilter();
				highpassFilter.type = "highpass";
				nodeIn.connect(highpassFilter);
				highpassFilter.connect(nodeOut);
			}
		},
		disconnect: {
			value: function(nodeIn, nodeOut){
				highpassFilter.disconnect(nodeIn);
				highpassFilter.disconnect(nodeOut);
				nodeIn.connect(nodeOut);
			}
		},
		getParams: {
			value: function(){}
		},
		getRender: {
			value: function(id_div_to_append){
				var template_component = highpassDoc.querySelector("#content_component").innerHTML;
				document.querySelector(id_div_to_append).innerHTML += template_component;
			}
		},
		getPluginName:	{
			value: function(){
				return "highpass-plugin";
			}
		}
	})
  });

function setFreq(val){
	highpassFilter.frequency.value = parseInt(val);
	document.querySelector("#freq_val").innerText = parseInt(val);
}

function setDetune(val){
	highpassFilter.detune.value = parseInt(val);
	document.querySelector("#detune_val").innerText = parseInt(val);
}

function setGain(val){
	highpassFilter.gain.value = parseInt(val);
	document.querySelector("#gain_val").innerText = parseInt(val);
}

function setQ(val){
	highpassFilter.Q.value = parseInt(val);
	document.querySelector("#Q_val").innerText = parseInt(val);
}