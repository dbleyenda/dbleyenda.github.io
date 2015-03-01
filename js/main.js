$(document).ready(function(){

	// Answers Collection
	var answersCollection = new AnswersCollection( Answers ); // "Answers" variable is the array with answers located in js/answers.js

	// Shuffle Collection
	// answersCollection.reset( answersCollection.shuffle(), {silent:true} );

	// Instance of App View
	var appView = new AppView({ 
		model: new AppModel,
		collection: answersCollection
	});

});