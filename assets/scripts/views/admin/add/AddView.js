// Filename: views/admin/add/AddView
define([
	'jquery',
	'underscore',
	'backbone',
	'models/QuestionModel',
	'models/admin/add/InfoModel',
	'models/admin/add/LinksModel',
	'models/admin/add/ExtraModel',
	'views/admin/add/ArrayView',
	'collections/admin/add/ArrayCollection',
	'text!templates/admin/add/addTemplate.html',
	'firebase',
	'bootstrap',
	'backbone_epoxy',
	'backbone_validation',
], function($, _, Backbone, QuestionModel, InfoModel, LinksModel, ExtraModel, ArrayView, ArrayCollection, addTemplate){

	var AddView = Backbone.Epoxy.View.extend({

		el: "#id_sectionContainer",

		editMode: false,

		events: {
			'click #id_saveButton': 'onSaveButtonClicked',
		},

		initialize: function(options){

			// If `id` on `options`, set `editMode` to true
			if( !_.isUndefined( options ) ){
				if( !_.isUndefined( options.id ) ){
					this.editMode = true;
				}
			}

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init model
			this.model = new QuestionModel;

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// If Edit
			if( this.editMode ){

				// Get All answers
				var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/"+options.id+"/");

				ref.once("value", _.bind(function(snapshot) {

					// Set values
					this.model.set( snapshot.val() );

					// Hide Loading
					this.mask('#id_loadingMask', 'hide');

					// render
					this.render();

				}, this));

			// Else new question
			}else{

				// Hide Loading
				this.mask('#id_loadingMask', 'hide');

				// render
				this.render();

			}

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( addTemplate );

			// Render template
			this.$el.html( compiledTemplate(this.model.toJSON()) );

			// Init Arrays Fields
			this.initArraysFields();

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

		initArraysFields: function(){

			// Init Collections
			this.InfoCollection = new ArrayCollection(null,{
				model: InfoModel
			});
			this.LinksCollection = new ArrayCollection(null,{
				model: LinksModel
			});
			this.ExtraCollection = new ArrayCollection(null,{
				model: ExtraModel
			});

			// If edit mode
			if( this.editMode ){

				var infoArray = [];
				_.each(this.model.get('info'), function(value, index){
					infoArray.push({
						'item': value
					})
				});

				var linksArray = [];
				_.each(this.model.get('links'), function(value, index){
					linksArray.push({
						'item': value
					})
				});

				var extraArray = [];
				_.each(this.model.get('extra'), function(value, index){
					extraArray.push({
						'item': value
					})
				});
				
				// Set Info collection
				this.InfoCollection.reset( infoArray, {silent:true} );

				// Set Links collection
				this.LinksCollection.reset( linksArray,  {silent:true} );

				// Set Extra collection
				this.ExtraCollection.reset( extraArray, {silent:true} );
			}

			// Init Views
			this.InfoView = new ArrayView({
				el: "#id_infoContainer", 
				model: new InfoModel,
				collection: this.InfoCollection,
				bindings: {
					"#info": "value:info,events:['keyup']"
				}
			});
			this.LinksView = new ArrayView({
				el: "#id_linksContainer", 
				model: new LinksModel, 
				collection: this.LinksCollection,
				bindings: {
					"#links": "value:links,events:['keyup']"
				}
			});
			this.ExtraView = new ArrayView({
				el: "#id_extraContainer", 
				model: new ExtraModel,
				collection: this.ExtraCollection,
				bindings: {
					"#extra": "value:extra,events:['keyup']"
				}
			});

			// Reset Collections
			this.InfoCollection.reset();
			this.LinksCollection.reset();
			this.ExtraCollection.reset();

		},
		
		onSaveButtonClicked: function(event){

			//TODO: No pude hacer que en el edit, se actualice el model usando Epoxy. Hay algo que se me esta escapando de las manos. Por eso hago esto que debo quitar en algun futuro
			if( this.editMode ){
				this.model.set({
					answer: this.$el.find('input[name=answer]').val(),
					filename: this.$el.find('input[name=filename]').val(),
					birth_death: this.$el.find('input[name=birth_death]').val(),
					name: this.$el.find('input[name=name]').val(),
					year: this.$el.find('input[name=year]').val(),
					type: this.$el.find('input[name=type]').val(),
				})	
			}

			// If Model id valid
			if(this.model.isValid(true)){

				this.model.set( 'info', this.InfoCollection.prepareArray() );	
				this.model.set( 'links', this.LinksCollection.prepareArray() );
				this.model.set( 'extra', this.ExtraCollection.prepareArray() );

				this.mask('#id_savingMask', 'show');

				// If edit mode
				if( this.editMode ){

					// Update
					this.update();

				}else{

					// Get All answers to set ID
					var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/");
					ref.once("value", _.bind(function(snapshot) {

						// Set id as Answers Length
						this.model.set( 'id', snapshot.numChildren() );

						// Save
						this.save();

					}, this));

				}

			}
		},

		save: function(){

			var answerSaveRef = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/");

			answerSaveRef.authWithCustomToken("K2IIPKYNYXORvW9qVOXpLAu5uBIJFuPSXujJP6in", _.bind(function(error, result) {
				this.mask('#id_savingMask', 'hide');
				if(error){
					console.log("Authentication Failed!", error);
				}else{
					answerSaveRef.push( this.model.toJSON(), this.finish() );
				}
			}, this));

		},

		update: function(){

			var answerUpdateRef = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/"+this.model.get('id')+"/");

			answerUpdateRef.authWithCustomToken("K2IIPKYNYXORvW9qVOXpLAu5uBIJFuPSXujJP6in", _.bind(function(error, result) {
				this.mask('#id_savingMask', 'hide');
				if(error){
					console.log("Authentication Failed!", error);
				}else{
					answerUpdateRef.update( this.model.toJSON(), this.finish() );
				}
			}, this));

		},

		finish: function(){

			// Mensaje de OK
			alert('Pieza ' + this.model.get('id') + ' guardada');

			// TODO: Ver si esto hay una mejor manera de hacerlo.
			// Redirijo a la Lista
			window.location.href = '#list';

			// Destruyo esta vista.
			this.destroy();

		},

		mask: function(id, action){
			if( action == 'show' ){
				$(id).css('display','table');
			}else if( action == 'hide' ){
				$(id).css('display','none');
			}
		},

		destroy: function(){

			// TODO: Necesito entender mejor como manejar estas cosas. Por ahora dejo lo que encontre en internet. Algunas cosas las comente porque me rompian la App.

			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			//this.remove();
			//Backbone.View.prototype.remove.call(this);

		}

	});

	return AddView;

});