$(document).ready(function(){

	// Init App
	var appView = new AppView({ 
		model: new AppModel,
		collection: new AnswersCollection( Answers ), // "Answers" variable is the array with answers located in js/answers.js
	});

});