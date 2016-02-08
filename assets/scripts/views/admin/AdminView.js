// Filename: views/admin/AdminView
define([
	'jquery',
	'underscore',
	'backbone',
	'models/admin/AdminModel',
	'models/admin/InfoModel',
	'models/admin/LinksModel',
	'models/admin/ExtraModel',
	'views/admin/ArrayView',
	'collections/admin/ArrayCollection',
	'text!templates/admin/adminTemplate.html',
	'firebase',
	'bootstrap',
	'backbone_epoxy',
	'backbone_validation',
], function($, _, Backbone, AdminModel, InfoModel, LinksModel, ExtraModel, ArrayView, ArrayCollection, adminTemplate){

	var AdminView = Backbone.Epoxy.View.extend({

		el: "#id_sectionContainer",

		events: {
			'click #id_saveButton': 'onSaveButtonClicked',
		},

		initialize: function(){

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init model
			this.model = new AdminModel;

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// render
			this.render();

			// Get All answers
			var ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/");
			ref.once("value", _.bind(function(snapshot) {

				// Set id as Answers Length
				this.model.set( 'id', snapshot.numChildren());

				// Hide Loading
				this.mask('#id_loadingMask', 'hide');

			}, this));

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( adminTemplate, this.model.toJSON() );

			// Render template
			this.$el.html( compiledTemplate );

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
			this.InfoCollection = new ArrayCollection({
				model: new InfoModel
			});
			this.LinksCollection = new ArrayCollection({
				model: new LinksModel
			});
			this.ExtraCollection = new ArrayCollection({
				model: new ExtraModel
			});

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

			// prevent default
			event.preventDefault();

			console.log(this.model.toJSON());

			// If Model id valid
			if(this.model.isValid(true)){

				this.model.set( 'info', this.InfoCollection.prepareArray() );	
				this.model.set( 'links', this.LinksCollection.prepareArray() );
				this.model.set( 'extra', this.ExtraCollection.prepareArray() );

				this.mask('#id_savingMask', 'show');

				var answerSaveRef = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/");

				answerSaveRef.authWithCustomToken("K2IIPKYNYXORvW9qVOXpLAu5uBIJFuPSXujJP6in", _.bind(function(error, result) {
					this.mask('#id_savingMask', 'hide');
					if(error){
						console.log("Authentication Failed!", error);
					}else{
						answerSaveRef.push(this.model.toJSON(), _.bind(function(){
							alert('Pieza ' + this.model.get('id') + ' guardada')
							this.model.set('id', ( parseFloat( this.model.get('id') ) + 1 ) );
						}, this));
					}
				}, this));

			}
		},

		mask: function(id, action){
			if( action == 'show' ){
				$(id).css('display','table');
			}else if( action == 'hide' ){
				$(id).css('display','none');
			}
		},

	});

	return AdminView;

});