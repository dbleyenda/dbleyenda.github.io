// Filename: models/admin/list/ListModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_epoxy',
], function($, _, Backbone){

	var ListModel = Backbone.Epoxy.Model.extend({

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
		},

	});

	return ListModel;

});