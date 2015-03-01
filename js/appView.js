var AppView = Backbone.Epoxy.View.extend({

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

		// Set Total Questions
		this.model.set('total', this.collection.length);

		// Render first question
		this.render();

	},

	render: function(){

		// Show question
		this.showQuestion( this.model.get('actual') );

		return this;
	},

	showQuestion: function( position ){
		var actualModel = this.collection.at( position );

		actualModel.set( 'correct', this.model.get('correct') );
		actualModel.set( 'total', this.model.get('total') );

		new QuestionView({ 
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
	}

});