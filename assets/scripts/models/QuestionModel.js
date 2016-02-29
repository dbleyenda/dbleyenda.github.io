// Filename: models/QuestionModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
], function($, _, Backbone){

	var QuestionModel = Backbone.Model.extend({

		defaults: {
			answer: "",
			filename: "",
			birth_death: "",
			name: "",
			year: "",
			type: "",
			info: [],
			links: [],
			extra: [],
			id: null
		},

		validation: {
			answer: [
				{
					required: true,
					msg: "No puede dejar la respuesta vacía."
				},
			],
			filename: [
				{
					required: true,
					msg: "Coloque la referencia al nombre del archivo de imagen."
				},
			],
		},


	});

	return QuestionModel;

});