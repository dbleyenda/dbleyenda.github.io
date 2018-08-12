// Filename: views/game/FooterView
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/footerTemplate.html',
	'bootstrap'
], function($, _, Backbone, footerTemplate){

	var FooterView = Backbone.View.extend({

		el: "#id_footer",

		events: {
			'click #portfolio': 'trackPortfolio'
		},

		initialize: function(){
			this.render()
		},

		render: function(){
			
			// Compile template
			var compiledTemplate = _.template( footerTemplate, {} );
			
			// Render template
			this.$el.html( compiledTemplate );

		},

		trackPortfolio: function(){
			mixpanel.track("Portfolio");
		}

	});
	
	return FooterView;

});