// Filename: models/admin/login/LoginModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
], function($, _, Backbone){

	var LoginModel = Backbone.Model.extend({

		defaults: {
			username: null,
			password: null
		},

		// validation: {

		// }

	});

	return LoginModel;

});