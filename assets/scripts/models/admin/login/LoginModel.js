// Filename: models/admin/login/LoginModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation',
], function($, _, Backbone){

	var LoginModel = Backbone.Model.extend({

		defaults: {
			email: null,
			password: null
		},

		validation: {
			email: [
				{
					required: true,
					msg: "Campo obligatorio."
				},{
					pattern: 'email',
					msg: "Ingrese un e-mail válido."
				}
			],
			password: [
				{
					required: true,
					msg: "Campo obligatorio."
				},
			],
		}

	});

	return LoginModel;

});