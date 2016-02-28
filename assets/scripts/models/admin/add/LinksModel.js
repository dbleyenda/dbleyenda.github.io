// Filename: models/admin/add/LinksModel
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/add/ArrayModel',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone, ArrayModel){

	var LinksModel = ArrayModel.extend({

		defaults: {
			links: null
		},

		validation: {
			links: [{
				required: true,
				msg: "Campo obligatorio. No puede agregar un link vacío."
			},{
				pattern: "url",
				msg: "El texto ingresado debe ser una url"
			}]
		},

	});

	return LinksModel;

});