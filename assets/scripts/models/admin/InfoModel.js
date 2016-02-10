// Filename: models/admin/InfoModel
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/ArrayModel',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone, ArrayModel){

	var InfoModel = ArrayModel.extend({

		defaults: {
			info: null
		},

		validation: {
			info: [{
				required: true,
				msg: "Campo obligatorio. No puede agregar un item vacío."
			}]
		},

	});

	return InfoModel;

});