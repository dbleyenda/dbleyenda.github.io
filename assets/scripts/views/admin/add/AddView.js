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
			'click #id_saveButton, #id_updateButton': 'onSaveButtonClicked',
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
				this.ref = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/"+options.id+"/");

				this.ref.once("value", _.bind(function(snapshot) {

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

			// Init Arrays
			var infoArray = null;
			if( this.model.get('info').length > 0 ){
				infoArray = [];
				_.each(this.model.get('info'), function(value, index){
					infoArray.push({
						'item': value
					})
				});
			}

			var linksArray = null;
			if( this.model.get('links').length > 0 ){
				linksArray = [];
				_.each(this.model.get('links'), function(value, index){
					linksArray.push({
						'item': value
					})
				});
			}

			var extraArray = null;
			if( this.model.get('extra').length > 0 ){
				extraArray = [];
				_.each(this.model.get('extra'), function(value, index){
					extraArray.push({
						'item': value
					})
				});
			}

			// Init Collections
			this.InfoCollection = new ArrayCollection(infoArray,{
				model: InfoModel
			});
			this.LinksCollection = new ArrayCollection(linksArray,{
				model: LinksModel
			});
			this.ExtraCollection = new ArrayCollection(extraArray,{
				model: ExtraModel
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

						// Set id = ( Last answer id + 1 )
						this.model.set( 'id', ( ( snapshot.val()[ (snapshot.val().length - 1) ].id ) + 1 ) );

						// Save
						this.save();

					}, this));

				}

			}
		},

		save: function(){

			var answerSaveRef = new Firebase("https://luminous-inferno-7458.firebaseio.com/answers/"+this.model.get('id')+"/");

			answerSaveRef.authWithCustomToken("K2IIPKYNYXORvW9qVOXpLAu5uBIJFuPSXujJP6in", _.bind(function(error, result) {
				this.mask('#id_savingMask', 'hide');
				if(error){
					console.log("Authentication Failed!", error);
				}else{
					// answerSaveRef.push( this.model.toJSON(), this.finish() );
					answerSaveRef.set( this.model.toJSON(), this.finish() );
				}
			}, this));

		},

		update: function(){

			this.ref.authWithCustomToken("K2IIPKYNYXORvW9qVOXpLAu5uBIJFuPSXujJP6in", _.bind(function(error, result) {
				this.mask('#id_savingMask', 'hide');
				if(error){
					console.log("Authentication Failed!", error);
				}else{

					this.ref.update( this.model.toJSON(), this.finish() );
					//answerUpdateRef.set( this.model.toJSON(), this.finish() );
				}
			}, this));

		},

		finish: function(error){

			if(error){
				console.log("Save Error: ", error);
			}else{

				//Mensaje de OK
				var text = 'Pieza ';
				text += this.model.get('id');
				text += ': "';
				text += this.model.get('answer');
				if( 
					!_.isUndefined( this.model.get('name') ) && 
					this.model.get('name') != '' 
				){
					text += ' - ';
					text += this.model.get('name');
				}
				var saveText = 'guardada';
				if(this.editMode){
					saveText = 'actualizada';
				}
				text += '" '+ saveText +'.';

				// Muestro el mensaje
				alert(text);

				// TODO: Ver si esto hay una mejor manera de hacerlo.
				// Redirijo a la Lista
				window.location.href = '#list';

				// Destruyo esta vista.
				this.destroy();
			}

		},

		mask: function(id, action){
			if( action == 'show' ){
				$(id).css('display','table');
			}else if( action == 'hide' ){
				$(id).css('display','none');
			}
		},

		close: function(){
			this.destroy();
		},

		destroy: function(){

			// UndelegateEvents
			this.undelegateEvents();

			// TODO checkear como remover la view

		}

	});

	return AddView;

});