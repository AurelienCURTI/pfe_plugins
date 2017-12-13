(function() {
    
	// Creates an object based in the HTML Element prototype
    var oscillator_component = Object.create(HTMLElement.prototype);
    //console.log('Oscillator plugin loaded');

    //Retrieving the current document and not the host (index.html) document
    var currentDoc = document.currentScript.ownerDocument;
	
    // Fires when an instance of the element is created
    oscillator_component.createdCallback = function() 
    {
        var shadowRoot = this.createShadowRoot();
		var template = currentDoc.querySelector('#oscillator_template'); // on cherche #template directement dans le DOM du plugin
		var clone = document.importNode(template.content, true);
		
		var idComponent = this.id;
		shadowRoot.appendChild(clone);

		this.registerButtonsCallbacks(shadowRoot);
    };

    // Fires when an instance was inserted into the document
    oscillator_component.attachedCallback = function(){ 
		//Envoi d'evenement
		var evt = currentDoc.createEvent("CustomEvent");
		evt.initCustomEvent("add_plugin", true, true, this);
		this.dispatchEvent(evt);
    };

    // Fires when an instance was removed from the document
    oscillator_component.detachedCallback = function(){
		this.audioCtx.close();
    };

    oscillator_component.attributeChangedCallback = function(attr, oldVal, newVal) {};   
	
	//Add Event listners on elements of the component
    oscillator_component.registerButtonsCallbacks = function(rootElement) { 
        var slider_freq = rootElement.querySelector('#freq_slider');
        var slider_detune = rootElement.querySelector('#detune_slider');
        var activate = rootElement.querySelector('#activate');  
        var disable = rootElement.querySelector('#disable');  
        var self = this;
        
        slider_freq.addEventListener('input', function(){
            self.setParam('freq', slider_freq.value);
        });
		
		slider_detune.addEventListener('input', function(){
            self.setParam('detune', slider_detune.value);
        });
        
        activate.addEventListener('click', function(){
            self.activate();
        });
		
		disable.addEventListener('click', function(){
            self.bypass();
        });
    };
	
	oscillator_component.init = function(ctx, bufsize){
		this.audioCtx = ctx;
		this.bufferSize = bufsize;
		
		this.oscillatorNode = ctxAudio.createOscillator();
		this.gainNode = this.audioCtx.createGain();
		this.oscillatorNode.connect(this.gainNode);
		this.oscillatorNode.start();
		
		console.log("oscillator initialized");
	}
	
	oscillator_component.connect = function(dest){
		this.gainNode.connect(dest);
	}
	
	oscillator_component.getOutput = function(){
		return this.gainNode;
	}
	
	oscillator_component.disconnect = function(src, dest){
		this.oscillatorNode.disconnect(src);
		this.oscillatorNode.disconnect(dest);
		src.connect(dest);
	}
	
	oscillator_component.getRender = function(){}
	
	oscillator_component.getParam = function(param){}
		
	oscillator_component.getDatas = function(){
		var slider_freq = {'id':'freq', 'min_value': 20, 'max_value':20000};
		var slider_detune = {'id':'detune', 'min_value': 0, 'max_value':100};
		var activate_btn = {'id':'activate'};
		var disable_btn = {'id':'disable'};
		return {'name':'oscillator-plugin', 'input':1, 'output': 1, 'slider1':slider_freq, 'slider2': slider_detune, 'button1':activate_btn, 'button2':disable_btn};
	}

	oscillator_component.setParam = function(param, val) {
		switch(param){
			case "freq":
				this.oscillatorNode.frequency.setValueAtTime(parseInt(val), null);
				this.shadowRoot.querySelector('#freq_val').innerHTML = parseInt(val);
			break;
			case "detune":
				this.oscillatorNode.detune.setValueAtTime(parseInt(val), null);
				this.shadowRoot.querySelector('#detune_val').innerHTML = parseInt(val);
			break;
			default:
				console.log("Le parametre specifie est inconnu.");
			break;
		};
	}

	oscillator_component.activate = function(){
		if(this.gainNode.gain != 1){
			this.gainNode.gain.setValueAtTime(1, null);
			this.shadowRoot.querySelector('#component_state').setAttribute("class", "enable"); 
		}
	}
		
	oscillator_component.bypass = function(){
		if(this.gainNode.gain != 0){
			this.gainNode.gain.setValueAtTime(0, null);
			this.shadowRoot.querySelector('#component_state').setAttribute("class", "disable"); 
		}
	}
	
    // Registers custom element
    document.registerElement('oscillator-plugin', {
        prototype: oscillator_component
    });
}());

