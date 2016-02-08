// Filename: models/admin/ExtraModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone){

	var ExtraModel = Backbone.Epoxy.Model.extend({

		defaults: {
			extra: null
		},

		validation: {
			extra: [
				{
					required: true,
					msg: "Campo obligatorio. No puede agregar más información vacía."
				},
			],
		},


	});

	return ExtraModel;

});