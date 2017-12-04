//Interface standard
this.prototype =
{
	connect : function (ctx, nodeIn, nodeOut){},
	disconnect : function disconnect(nodeIn, nodeOut){},
	getParams : function getParams(){}
};

//variables globales 
var highpassFilter;

//Fonctions implementes
function connect(ctx, nodeIn, nodeOut){
	highpassFilter = ctx.createBiquadFilter();
	highpassFilter.type = "highpass";
	highpassFilter.connect(nodeIn);
	highpassFilter.connect(nodeOut);
}

function disconnect(nodeIn, nodeOut){
	highpassFilter.connect(nodeIn);
	highpassFilter.connect(nodeOut);
}

function getParams(){
	
}

function setFreq(val){
	highpassFilter.frequency.value = parseInt(val);
}

function setDetune(val){
	highpassFilter.detune.value = parseInt(val);
}

function setGain(val){
	highpassFilter.gain.value = parseInt(val);
}

function setQ(val){
	highpassFilter.Q.value = parseInt(val);
}