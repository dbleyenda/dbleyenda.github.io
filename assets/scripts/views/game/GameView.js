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
			"#id_correctAnswers": "text:correct",
			"#id_totalQuestions": "text:total"
		},

		events: {
			"click #id_nextButton": "nextQuestion",
			"click #id_tryAgain": "reloadPage",
		},

		initialize: function(){

			// Init Answers Collection
			this.collection = new AnswersCollection;

			// Fetch Data
			this.collection.fetch({ 

				//reset: true,

				// On Success
				success: _.bind(function (collection, response, options) {

					//console.log(collection, response, options);

					//console.log(collection.toJSON());

					//console.log( this.collection.toJSON()[0].answer );

					// SHUFFLE DIDN'T WORK WITH FIREBASE IMPLEMENTATION =(
					// KEEP SEARCHING FOR SOLUTION
					//collection.reset( collection.shuffle(), {silent:true} );

					//console.log( this.collection.toJSON()[0].answer );

					// Init model
					this.model = new GameModel;

					// Set Total Questions
					this.model.set('total', collection.length);

					// Render first question
					this.render();

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

			// Compile template
			var compiledTemplate = _.template( resultsTemplate, this.model.toJSON() );
			
			// Render template
			this.$el.append( compiledTemplate );

		},

		showQuestion: function( position ){
			var actualModel = this.collection.at( position );

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
				
				// Get next ID
				var next = self.model.get('actual') + 1;

				// If next question available
				if( next < self.collection.length ){
					
					self.model.set('actual', next);
					self.render();

				// Else, go to results
				}else{
					
					self.finishGame();

				}

			}, 150);

		},

		finishGame: function(){

			// Open Results Modal
			this.$el.find('#id_resultsModal').modal({
				backdrop: 'static',
				keyboard: false,
				show: true
			});

		},

		reloadPage: function(){
			location.reload();
		},

	});

	return GameView;

});