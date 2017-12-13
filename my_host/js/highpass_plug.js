(function() {
    
	// Creates an object based in the HTML Element prototype
    var highpass_component = Object.create(HTMLElement.prototype);
    //console.log('Highpass plugin loaded');

    //Retrieving the current document and not the host (index.html) document
    var currentDoc = document.currentScript.ownerDocument;

    // Fires when an instance of the element is created
    highpass_component.createdCallback = function() 
    {
        var shadowRoot = this.createShadowRoot();
		var template = currentDoc.querySelector('#highpass_template'); // on cherche #template directement dans le DOM du plugin
		var clone = document.importNode(template.content, true);
		
		var idComponent = this.id;
		shadowRoot.appendChild(clone);

		this.registerButtonsCallbacks(shadowRoot);
    };

    // Fires when an instance was inserted into the document
    highpass_component.attachedCallback = function(){ 
		//Envoi d'evenement
		var evt = currentDoc.createEvent("CustomEvent");
		evt.initCustomEvent("add_plugin", true, true, this);
		this.dispatchEvent(evt);
    };

    // Fires when an instance was removed from the document
    highpass_component.detachedCallback = function(){
		this.audioCtx.close();
    };

    highpass_component.attributeChangedCallback = function(attr, oldVal, newVal) {};   
	
	//Add Event listners on elements of the component
    highpass_component.registerButtonsCallbacks = function(rootElement) { 
        var slider_freq = rootElement.querySelector('#hpass_freq');
        var slider_detune = rootElement.querySelector('#hpass_detune');
        var slider_Q = rootElement.querySelector('#hpass_q');
        var slider_gain = rootElement.querySelector('#hpass_gain');
        var activate_btn = rootElement.querySelector('#activate');  
        var disable_btn = rootElement.querySelector('#disable');  
        var self = this;
        
        slider_freq.addEventListener('input', function(){
            self.setParam('freq', slider_freq.value);
        });
		
		slider_detune.addEventListener('input', function(){
            self.setParam('detune', slider_detune.value);
        });
		
		slider_Q.addEventListener('input', function(){
            self.setParam('Q', slider_Q.value);
        });
		
		slider_gain.addEventListener('input', function(){
            self.setParam('gain', slider_gain.value);
        });
        
        activate_btn.addEventListener('click', function(){
            self.activate();
        });
		
		disable_btn.addEventListener('click', function(){
			self.bypass();
        });
    };
	
	highpass_component.init = function(ctx, bufsize){
		this.audioCtx = ctx;
		this.bufferSize = bufsize;
		
		this.highpassFilterNode = this.audioCtx.createBiquadFilter();
		this.highpassFilterNode.type = "highpass";
		this.gainNode = this.audioCtx.createGain();
		this.highpassFilterNode.connect(this.gainNode);
		console.log("highpass initialized");
	}
	
	highpass_component.connect = function(dest){
		this.gainNode.connect(dest);
	}
	
	highpass_component.getInput = function(){
		return this.highpassFilterNode;
	}
	
	highpass_component.getOutput = function(){
		return this.gainNode;
	}
	
	highpass_component.disconnect = function(src, dest){
		this.highpassFilterNode.disconnect(src);
		this.highpassFilterNode.disconnect(dest);
		src.connect(dest);
	}
	
	highpass_component.getRender = function(){}
	
	highpass_component.getDatas = function(){
		var slider_freq = {'id':'freq', 'min_value':0, 'max_value':1000};
		var slider_detune = {'id':'detune', 'min_value':0, 'max_value':100};
		var slider_q = {'id':'Q', 'min_value':0, 'max_value':100};
		var slider_gain = {'id':'gain', 'min_value':0, 'max_value':1};
		var activate_btn = {'id':'activate'};
		var disable_btn = {'id':'disable'};
		return {'name': 'highpass-plugin', 'input':1, 'output': 1, 'slider1':slider_freq, 'slider2':slider_detune, 'slider3':slider_q, 'slider4':slider_gain, 'button1':activate_btn, 'button2':disable_btn};
	}
		
	highpass_component.getParam = function(param){}

	highpass_component.setParam = function(param, val) {
		switch(param){
			case "freq":
				this.highpassFilterNode.frequency.setValueAtTime(parseInt(val), null);
				this.shadowRoot.querySelector('#freq_val').innerHTML = parseInt(val);
			break;
			case "detune":
				this.highpassFilterNode.detune.setValueAtTime(parseInt(val), null);
				this.shadowRoot.querySelector('#detune_val').innerHTML = parseInt(val);
			break;
			case "Q":
				this.highpassFilterNode.Q.setValueAtTime(parseInt(val), null);
				this.shadowRoot.querySelector('#Q_val').innerHTML = parseInt(val);
			break;
			case "gain":
				this.highpassFilterNode.gain.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#gain_val').innerHTML = parseFloat(val);
			break;
			default:
				console.log("Le parametre specifie est inconnu.");
			break;
		};
	}

	highpass_component.activate = function(){
		if(this.gainNode.gain != 1){
			this.gainNode.gain.setValueAtTime(1, null);
			this.shadowRoot.querySelector('#component_state').setAttribute("class", "enable"); 
		}
	}
		
	highpass_component.bypass = function(){
		if(this.gainNode.gain != 0){
			this.gainNode.gain.setValueAtTime(0, null);
			this.shadowRoot.querySelector('#component_state').setAttribute("class", "disable"); 
		}
	}
	
    // Registers custom element
    document.registerElement('highpass-plugin', {
        prototype: highpass_component
    });
}());