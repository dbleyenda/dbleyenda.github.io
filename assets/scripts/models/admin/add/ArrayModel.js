// Filename: models/admin/add/ArrayModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
	'backbone_epoxy',
], function($, _, Backbone){

	var ArrayModel = Backbone.Epoxy.Model.extend({

		defaults: {
			item: null
		},

		checkValue: function(){
			
		}

	});

	return ArrayModel;

});