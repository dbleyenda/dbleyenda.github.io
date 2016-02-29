// Filename: views/admin/add/ArrayView
define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/add/ItemView',
	'bootstrap',
	'backbone_validation',
], function($, _, Backbone, ItemView){

	var ArrayView = Backbone.View.extend({

		events: {
			'click .addButton': 'onAddButtonClicked',
			'keyup #info, #links, #extra': 'checkKeyUp',
		},

		initialize: function(){

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// Add / remove events
			this.listenTo(this.collection, 'add', this.addItem);
			//this.listenTo(this.collection, 'remove', this.removeItem);

			// render
			this.render();
		},

		render: function(){

			if( this.collection.length > 0 ){
				this.collection.forEach(this.addItem, this);
			}

			// Bind custom model validation callbacks
			Backbone.Validation.bind(this, {
				valid: _.bind(function (view, attr, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, '');
				}, this),
				invalid: _.bind(function (view, attr, error, selector) {
					this.setIndividualError(view.$('[name=' + attr + ']'), attr, error);
				}, this),
			});

			return this;

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

			// TODO: revisar. Tuve que hacer lo siguiente para setear el modelo, porque epoxy se queja. No pude entender porque y tuve que sacarlo de la vista.

			// Capture input value
			var item = $(event.currentTarget).parents('.form-group').find('input').val();

			// INTENTAR CAMBIAR ESTO A UN LISTEN ONCHANGE

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

			// Set Model
			this.setModel();

		},

		checkKeyUp: function(event){

			// If "Enter" or "Comma" keys
			if(event.keyCode == 13 || event.keyCode == 188){

				var item = this.$el.find('.field').val();

				if( event.keyCode == 188 ){

					// Remove comma from field
					item = item.slice(0,-1);

					// Set again in field without comma
					this.$el.find('.field').val(item);

				}

				// INTENTAR CAMBIAR ESTO A UN LISTEN ONCHANGE

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

				// Set Model
				this.setModel();

			}
		},

		setModel: function(){

			this.model.unset('item');

			// If Model id valid
			if(this.model.isValid(true)){

				if( !_.isUndefined(this.model.get('info')) ){
					item = this.model.get('info');
					this.model.set('info', null);
					this.model.set('item', item);
				}

				if( !_.isUndefined(this.model.get('links')) ){
					item = this.model.get('links');
					this.model.set('links', null);
					this.model.set('item', item);
				}

				if( !_.isUndefined(this.model.get('extra')) ){
					item = this.model.get('extra');
					this.model.set('extra',null);
					this.model.set('item', item);
				}

				this.collection.add( this.model.toJSON() );

				this.$el.find('.field').val('');

			}

		},

		addItem: function(model){

			// Add new item to DOM
			var itemView = new ItemView({ 
				model: model,
				collection: this.collection
			});
			this.$el.find('.itemsAdded').append( itemView.render().el );
		},

	});

	return ArrayView;

});