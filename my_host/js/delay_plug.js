(function() {
    
	// Creates an object based in the HTML Element prototype
    var delay_component = Object.create(HTMLElement.prototype);
    console.log('Delay plugin loaded');

    //Retrieving the current document and not the host (index.html) document
    var currentDoc = document.currentScript.ownerDocument;

    // Fires when an instance of the element is created
    delay_component.createdCallback = function() 
    {
        var shadowRoot = this.createShadowRoot();
		var template = currentDoc.querySelector('#delay_template'); // on cherche #template directement dans le DOM du plugin
		var clone = document.importNode(template.content, true);
		
		var idComponent = this.id;
		shadowRoot.appendChild(clone);

		this.registerButtonsCallbacks(shadowRoot);
    };

    // Fires when an instance was inserted into the document
    delay_component.attachedCallback = function(){ 
		//Envoi d'evenement
		var evt = currentDoc.createEvent("CustomEvent");
		evt.initCustomEvent("add_plugin", true, true, this);
		this.dispatchEvent(evt);
    };

    // Fires when an instance was removed from the document
    delay_component.detachedCallback = function(){
		this.audioCtx.close();
    };

    delay_component.attributeChangedCallback = function(attr, oldVal, newVal) {};   
	
	//Add Event listners on elements of the component
    delay_component.registerButtonsCallbacks = function(rootElement) { 
        var slider_delay = rootElement.querySelector('#delay_slider');
        var activate = rootElement.querySelector('#activate');  
        var disable = rootElement.querySelector('#disable');  
        var self = this;
        
        slider_delay.addEventListener('input', function(){
            self.setParam('delay', slider_delay.value);
        });
        
        activate.addEventListener('click', function(){
            self.activate();
        });
		
		disable.addEventListener('click', function(){
            self.bypass();
        });
    };
	
	delay_component.connect = function(ctx, src, dest){
		this.audioCtx = ctx;
		this.delayFilterNode = this.audioCtx.createDelay();
		this.delayFilterNode.type = "delay";
		this.gainNode = this.audioCtx.createGain();
		src.connect(this.delayFilterNode);
		this.delayFilterNode.connect(this.gainNode);
		this.gainNode.connect(dest);
	}
	
	delay_component.disconnect = function(src, dest){
		this.delayFilterNode.disconnect(src);
		this.delayFilterNode.disconnect(dest);
		src.connect(dest);
	}
	
	delay_component.getRender = function(){}
		
	delay_component.getParams = function(){}
		
	delay_component.getPluginName = function(){
		return "delay-plugin";
	}

	delay_component.setParam = function(param, val) {
		switch(param){
			case "delay":
				this.delayFilterNode.delayTime.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#delay_val').innerHTML = parseFloat(val);
			break;
			default:
				console.log("Le parametre specifie est inconnu.");
			break;
		};
	}

	delay_component.activate = function(){
		if(this.gainNode.gain != 1){
			this.gainNode.gain.setValueAtTime(1, null);
		}
	}
		
	delay_component.bypass = function(){
		if(this.gainNode.gain != 0){
			this.gainNode.gain.setValueAtTime(0, null);
		}
	}
	
    // Registers custom element
    document.registerElement('delay-plugin', {
        prototype: delay_component
    });
}());

