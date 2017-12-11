(function() {
    
	// Creates an object based in the HTML Element prototype
    var flanger_component = Object.create(HTMLElement.prototype);
    console.log('Flanger plugin loaded');

    //Retrieving the current document and not the host (index.html) document
    var currentDoc = document.currentScript.ownerDocument;

    // Fires when an instance of the element is created
    flanger_component.createdCallback = function() 
    {
        var shadowRoot = this.createShadowRoot();
		var template = currentDoc.querySelector('#flanger_template'); // on cherche #template directement dans le DOM du plugin
		var clone = document.importNode(template.content, true);
		
		var idComponent = this.id;
		shadowRoot.appendChild(clone);

		this.registerButtonsCallbacks(shadowRoot);
    };

    // Fires when an instance was inserted into the document
    flanger_component.attachedCallback = function(){ 
		var evt = currentDoc.createEvent("CustomEvent");
		evt.initCustomEvent("add_plugin", true, true, this);
		this.dispatchEvent(evt);
    };

    // Fires when an instance was removed from the document
    flanger_component.detachedCallback = function(){
		this.audioCtx.close();
    };

    flanger_component.attributeChangedCallback = function(attr, oldVal, newVal) {};   
	
	//Add Event listners on elements of the component
    flanger_component.registerButtonsCallbacks = function(rootElement) { 
        var slider_time = rootElement.querySelector('#flanger_time');
        var slider_speed = rootElement.querySelector('#flanger_speed');
        var slider_depth = rootElement.querySelector('#flanger_depth');
        var slider_feedback = rootElement.querySelector('#flanger_feedback');
        var activate_btn = rootElement.querySelector('#activate');  
        var disable_btn = rootElement.querySelector('#disable');  
        var self = this;
        
        slider_time.addEventListener('input', function(){
            self.setParam('time', slider_time.value);
        });
		
		slider_speed.addEventListener('input', function(){
            self.setParam('speed', slider_speed.value);
        });
		
		slider_depth.addEventListener('input', function(){
            self.setParam('depth', slider_depth.value);
        });
		
		slider_feedback.addEventListener('input', function(){
            self.setParam('feedback', slider_feedback.value);
        });
        
        activate_btn.addEventListener('click', function(){
            self.activate();
        });
		
		disable_btn.addEventListener('click', function(){
			self.bypass();
        });
    };
	
	flanger_component.connect = function(ctx, src, dest){
		this.audioCtx = ctx; 
		//input
		this.flangerInput = this.audioCtx.createGain();
		//noeud du wetGain
		this.flangerWetGainFilter = this.audioCtx.createGain();
		this.flangerWetGainFilter.type = "flanger";
		//noeud du delay
		this.flangerDelayFilter = this.audioCtx.createDelay();
		this.flangerDelayFilter.type = "flanger";
		//noeud du gain
		this.flangerGainFilter = this.audioCtx.createGain();
		this.flangerGainFilter.type = "flanger";
		//noeud du feedback
		this.flangerFeedbackFilter = this.audioCtx.createGain();
		//noeud de l'oscillateur
		this.flangerOscilFilter = this.audioCtx.createOscillator();

		//on connecte tout
		src.connect(this.flangerInput);
		this.flangerOscilFilter.connect(this.flangerGainFilter);
		this.flangerGainFilter.connect(this.flangerDelayFilter.delayTime);
		this.flangerInput.connect(this.flangerWetGainFilter);
		this.flangerInput.connect(this.flangerDelayFilter);
		this.flangerDelayFilter.connect(this.flangerWetGainFilter);
		this.flangerDelayFilter.connect(this.flangerFeedbackFilter);
		this.flangerFeedbackFilter.connect(this.flangerInput);
		this.flangerWetGainFilter.connect(dest);
	}
	
	flanger_component.disconnect = function(src, dest){
		this.flangerInput.disconnect(src);
		this.flangerInput.disconnect(this.flangerWetGainFilter);
		this.flangerInput.disconnect(this.flangerDelayFilter);
		this.flangerDelayFilter.disconnect(this.flangerWetGainFilter);
		this.flangerDelayFilter.disconnect(this.flangerFeedbackFilter);
		this.flangerGainFilter.disconnect(this.flangerDelayFilter.delayTime);
		this.flangerFeedbackFilter.disconnect(this.flangerInput);
		this.flangerOscilFilter.disconnect(this.flangerGainFilter);
		this.flangerWetGainFilter.disconnect(dest);
		src.connect(dest);
	}
	
	flanger_component.getRender = function(){}
		
	flanger_component.getParams = function(){}
		
	flanger_component.getPluginName = function(){
		return "flanger-plugin";
	}

	flanger_component.setParam = function(param, val) {
		switch(param){
			case "time":
				this.flangerDelayFilter.delayTime.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#time_val').innerHTML = parseFloat(val);
			break;
			case "speed":
				this.flangerOscilFilter.frequency.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#speed_val').innerHTML = parseFloat(val);
			break;
			case "depth":
				this.flangerGainFilter.gain.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#depth_val').innerHTML = parseFloat(val);
			break;
			case "feedback":
				this.flangerFeedbackFilter.gain.setValueAtTime(parseFloat(val), null);
				this.shadowRoot.querySelector('#feedback_val').innerHTML = parseFloat(val);
			break;
			default:
				console.log("Le parametre specifie est inconnu.");
			break;
		};
	}

	flanger_component.activate = function(){
		if(this.flangerInput.gain != 1){
			this.flangerInput.gain.setValueAtTime(1, null);
		}
	}
		
	flanger_component.bypass = function(){
		if(this.flangerInput.gain != 0){
			this.flangerInput.gain.setValueAtTime(0, null);
		}
	}
	
    // Registers custom element
    document.registerElement('flanger-plugin', {
        prototype: flanger_component
    });
}());

// // Changes the small delay time applied to the copied signal.
// // fonctionne avec le delay
// function setTime(val){
// 	flangerDelayFilter.delayTime.value = parseFloat(val);
// 	document.querySelector("#time_val").innerText = parseFloat(val);
// }

// // Changes the speed at which the flanging occurs.
// //fonctionne avec l'oscillateur
// function setSpeed(val){
// 	flangerOscilFilter.frequency.value = parseFloat(val);
// 	document.querySelector("#speed_val").innerText = parseFloat(val);
// }

// // Changes the depth/intensity of the swirling effect.
// function setDepth(val){
// 	flangerGainFilter.gain.value = parseFloat(val);
// 	document.querySelector("#depth_val").innerText = parseFloat(val);
// }

// // Changes the volume of the delayed sound.
// function setFeedback(val){
// 	flangerFeedbackFilter.gain.value = parseFloat(val);
// 	document.querySelector("#feedback_val").innerText = parseFloat(val);
// }

// Volume balance between the original audio and the effected output.
// function setMix(val){
// 	flangerGainFilter.gain.value = parseFloat(val);
// 	document.querySelector("#mix_val").innerText = parseFloat(val);
// }