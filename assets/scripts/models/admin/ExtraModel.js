// Filename: models/admin/ExtraModel
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/ArrayModel',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone, ArrayModel){

	var ExtraModel = ArrayModel.extend({

		defaults: {
			extra: null
		},

		validation: {
			extra: [
				{
					required: true,
					msg: "Campo obligatorio. No puede agregar más información vacía."
				}
			]
		},

	});

	return ExtraModel;

});