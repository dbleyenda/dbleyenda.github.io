// Filename: models/admin/add/ExtraModel
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/add/ArrayModel',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone, ArrayModel){

	var ExtraModel = ArrayModel.extend({

		initialize: function(){
			this.defaults['extra'] = null;
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