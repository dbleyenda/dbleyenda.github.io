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

		prepareList: function(list, propertyName){

			var newList = '';

			if(list[0] != ''){
				for(var i=0;i<list.length;i++){
					newList += '<li>' + list[i] + '</li>';
				}
			}

			this.set(propertyName, newList);

		},

		prepareLinks: function(list, propertyName){

			var newList = '';

			if(list[0] != ''){
				for(var i=0;i<list.length;i++){
					newList += '<li><a href="' + list[i] + '" target="_blank">' + list[i] + '</a></li>';
				}
			}

			this.set(propertyName, newList);

		},


	});

	return QuestionModel;

});