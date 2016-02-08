// Filename: models/admin/LinksModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone){

	var LinksModel = Backbone.Epoxy.Model.extend({

		defaults: {
			links: null
		},

		validation: {
			links: [
				{
					required: true,
					msg: "Campo obligatorio. No puede agregar un link vacío."
				},{
					pattern: "url",
					msg: "El texto ingresado debe ser una url"
				}
			],
		},


	});

	return LinksModel;

});