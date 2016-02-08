// Filename: models/admin/InfoModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone){

	var InfoModel = Backbone.Epoxy.Model.extend({

		defaults: {
			info: null
		},

		validation: {
			info: [
				{
					required: true,
					msg: "Campo obligatorio. No puede agregar un item vacío."
				},
			],
		},


	});

	return InfoModel;

});