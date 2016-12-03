// Filename: collections/study/list/StudyListCollection
define([
	'jquery',
	'underscore',
	'backbone',
	'models/QuestionModel',
	'firebase',
	'backbonefire'
], function($, _, Backbone, QuestionModel){

	var StudyListCollection = Backbone.Firebase.Collection.extend({
		model: QuestionModel,
		url: 'https://luminous-inferno-7458.firebaseio.com/answers/',
		autoSync: false
	});

	return StudyListCollection;

});