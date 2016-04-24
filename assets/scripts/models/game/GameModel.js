// Filename: models/game/GameModel
define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var GameModel = Backbone.Model.extend({

		defaults: {
			actual: 0,
			correct: 0,
			total: 0,
			wrong: 0
		}

	});

	return GameModel;

});