// Filename: models/admin/add/InfoModel
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/add/ArrayModel',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone, ArrayModel){

	var InfoModel = ArrayModel.extend({

		initialize: function(){
			this.defaults['info'] = null;
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