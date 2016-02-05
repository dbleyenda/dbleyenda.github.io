// Filename: collections/game/AnswerCollection
define([
	'jquery',
	'underscore',
	'backbone',
	'models/game/QuestionModel',
	'firebase',
	'backbonefire'
], function($, _, Backbone, QuestionModel){

	var AnswersCollection = Backbone.Firebase.Collection.extend({
		model: QuestionModel,
		url: 'https://luminous-inferno-7458.firebaseio.com/answers',
		autoSync: false
	});

	return AnswersCollection;

});