// Filename: views/game/AdminView
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/admin/adminTemplate.html',
	'bootstrap',
	'backbone_epoxy',
	'backbone_validation'
], function($, _, Backbone, adminTemplate){

	var AdminView = Backbone.Epoxy.View.extend({

		el: "#id_sectionContainer",

		initialize: function(){
			this.render()
		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( adminTemplate, {} );

			// Render template
			this.$el.html( compiledTemplate );

		},

	});

	return AdminView;

});