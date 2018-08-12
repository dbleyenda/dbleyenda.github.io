// Filename: views/game/GameView
define([
	'jquery',
	'underscore',
	'backbone',
	'models/game/GameModel',
	'collections/game/AnswersCollection',
	'views/game/QuestionView',
	'text!templates/game/resultsTemplate.html',
	'bootstrap',
	'backbone_epoxy'
], function($, _, Backbone, GameModel, AnswersCollection, QuestionView, resultsTemplate){

	var GameView = Backbone.Epoxy.View.extend({

		el: "#id_appContainer",

		bindings: {
			"#id_actualQuestion": "text:actual",
			"#id_correctAnswers": "text:correct",
			"#id_totalQuestions": "text:total",
			"#id_wrongAnswers": "text:wrong"
		},

		events: {
			"click #id_nextButton": "nextQuestion",
			"click #id_tryAgain": "reloadPage",
			"click #id_quitButton": "finishGame"
		},

		initialize: function(){

			// Toggle footer nav link
			$('#footer-nav .study').show();
			$('#footer-nav .game').hide();

			// Show Loading
			this.mask('#id_loadingMask', 'show');

			// Init model
			this.model = new GameModel;

			// Init Answers Collection
			this.collection = new AnswersCollection;

			// Fetch Data
			this.collection.fetch({ 

				// On Success
				success: _.bind(function(collection, response, options){

					// Shuffle Answers to give some complexity
					var shuffledAnswers = _.shuffle( this.collection.toJSON() );

					// Change id from shuffled answers to reset collection properly.
					_.each( shuffledAnswers, function(value, index){ 

						// Keep DB id for reference
						value.db_id = value.id; 

						// Set new ID in order to shuffle
						value.id = index; 
						
					});

					// Reset collection with shuffled answers
					this.collection.reset( shuffledAnswers, {silent:true} );

					// FOR TEST PURPOUSES: Shift collection and leave 1 model.
					//this.collection.reset( this.collection.shift(), {silent:true} );
					//console.log(this.collection.toJSON());

					// Set Total Questions
					this.model.set('total', collection.length);

					// Render first question
					this.render();

					// Hide Loading
					this.mask('#id_loadingMask', 'hide');

				}, this), 

				// On error
				error: function(){

					console.log('error pidiendo datos');

				}

			});

		},

		render: function(){

			// Show question
			this.showQuestion( this.model.get('actual') );

		},

		showQuestion: function( position ){
			var actualModel = this.collection.at( position );

			actualModel.set( 'actual', this.model.get('actual') );
			actualModel.set( 'wrong', this.model.get('wrong') );
			actualModel.set( 'correct', this.model.get('correct') );
			actualModel.set( 'total', this.model.get('total') );

			var questionView = new QuestionView({ 
				model: actualModel,
				parentView: this
			});
		},

		nextQuestion: function(event){

			var self = this;

			// Added setTimeOut to prevent wrong focus when using "enter" on "Continue" Button
			setTimeout(function(){

				// If next question available
				if( self.model.get('actual') < self.collection.length ){
					
					self.render();

				// Else, go to results
				}else{
					
					self.finishGame();

				}

			}, 150);

		},

		finishGame: function(){

			mixpanel.track("Finish Game", {
				"answered": this.model.get('actual'),
				"total": this.model.get('total'),
				"total_perc": Math.round( ((this.model.get('actual')*100)/this.model.get('total')) * 10) / 10 +'%',
				"correct": this.model.get('correct'),
				"wrong": this.model.get('wrong')
			});

			// Compile template
			var compiledTemplate = _.template( resultsTemplate );
			
			// Render template
			this.$el.append( compiledTemplate( this.model.toJSON() ) );

			// Open Results Modal
			this.$el.find('#id_resultsModal').modal({
				backdrop: 'static',
				keyboard: false,
				show: true
			});

		},

		reloadPage: function(){
			mixpanel.track("Try Again");
			location.reload();
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

	return GameView;

});