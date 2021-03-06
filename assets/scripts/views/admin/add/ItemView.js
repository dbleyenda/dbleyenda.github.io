// Filename: views/admin/add/ItemView
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/admin/add/itemTemplate.html',
	'bootstrap',
	'backbone_validation',
	'backbone_epoxy'
], function($, _, Backbone, itemTemplate){

	var ItemView = Backbone.Epoxy.View.extend({

		className: "item",

		events: {
			'click .removeButton': 'onRemoveButtonClicked'
		},

		render: function(){
			// Compile template
			var compiledTemplate = _.template( itemTemplate );

			// Render template
			this.$el.html( compiledTemplate( this.model.toJSON() ) );

			return this;
		},

		onRemoveButtonClicked: function(event){

			// Remove from DOM
			$(event.currentTarget).parents('.'+this.className).remove();

			// Remove from colelction
			this.collection.remove( this.collection.get( this.model.cid ) );

		}

	});

	return ItemView;

});