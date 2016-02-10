// Filename: views/admin/ArrayView
define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/ItemView',
	'bootstrap',
	'backbone_validation',
	'backbone_epoxy'
], function($, _, Backbone, ItemView){

	var ArrayView = Backbone.Epoxy.View.extend({

		events: {
			'click .addButton': 'onAddButtonClicked',
			'keyup #info, #links, #extra': 'checkKeyUp',
		},

		initialize: function(){

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// Add / remove events
			this.listenTo(this.collection, 'add', this.addItem);
			this.listenTo(this.collection, 'remove', this.removeItem);

			// render
			this.render();
		},

		render: function(){

			// Bind custom model validation callbacks
			Backbone.Validation.bind(this, {
				valid: _.bind(function (view, attr, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, '');
				}, this),
				invalid: _.bind(function (view, attr, error, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, error);
				}, this),
			});

		},

		setIndividualError: function(element, name, error){

			// If not valid
			if( error != ''){
				element.parents('.form-group').addClass('has-error');
				element.next('p.text-danger').remove();
				element.after('<p class="text-danger">'+error+'</p>');

			// If valid
			}else{
				element.parents('.form-group').removeClass('has-error');
				element.next('p.text-danger').remove();
			}

		},
		
		onAddButtonClicked: function(event){

			this.model.unset('item');

			// If Model id valid
			if(this.model.isValid(true)){

				if( !_.isUndefined(this.model.get('info')) ){
					item = this.model.get('info');
					this.model.unset('info');
					this.model.set('item', item);
				}

				if( !_.isUndefined(this.model.get('links')) ){
					item = this.model.get('links');
					this.model.unset('links');
					this.model.set('item', item);
				}

				if( !_.isUndefined(this.model.get('extra')) ){
					item = this.model.get('extra');
					this.model.unset('extra');
					this.model.set('item', item);
				}

				this.collection.add( this.model.toJSON() );

				this.$el.find('.field').val('');

			}

		},

		addItem: function(model){

			// Add new item to DOM
			var itemView = new ItemView({ 
				model: model
			});
			this.$el.find('.itemsAdded').append( itemView.render().el );
		},

		checkKeyUp: function(event){

			// If "Enter" or "Comma" keys
			if(event.keyCode == 13 || event.keyCode == 188){

				if( event.keyCode == 188 ){

					// Remove comma from field
					var item = this.$el.find('.field').val().slice(0,-1);

					// Set again in field without comma
					this.$el.find('.field').val(item);

					// If info, set model
					if( !_.isUndefined(this.model.get('info')) ){
						this.model.set('info', item);
					}

					// If links, set model
					if( !_.isUndefined(this.model.get('links')) ){
						this.model.set('links', item);
					}

					// If extra, set model
					if( !_.isUndefined(this.model.get('extra')) ){
						this.model.set('extra', item);
					}

				}

				this.onAddButtonClicked();
			}
		}

	});

	return ArrayView;

});