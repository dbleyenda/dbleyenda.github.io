// Filename: views/game/QuestionView
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/game/questionTemplate.html',
	'bootstrap',
	'backbone_validation',
	'backbone_epoxy'
], function($, _, Backbone, questionTemplate){

	var QuestionView = Backbone.Epoxy.View.extend({

		el: "#id_sectionContainer",

		template: null,
		parentView: null,

		events: {
			"click #id_getAnswerButton": "onGetAnswerButtonClicked", 
			"click #id_noAnswerButton": "onNoAnswerButtonClicked",
			"keyup #id_userAnswer": "checkKeyUp",
		},

		initialize: function(options){

			this.parentView = options.parentView;

			// Bind model validation to view
			Backbone.Validation.bind(this);	

			// Render
			this.render();

		},

		render: function(){

			// Compile template
			var compiledTemplate = _.template( questionTemplate );

			// Render template
			this.$el.html( compiledTemplate( this.model.toJSON() ) );

			// Make Focus con first Input
			this.$el.find('#id_userAnswer').focus();

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

		checkKeyUp: function(event){
		
			// If "Enter" key
			if(event.keyCode == 13){
				this.onGetAnswerButtonClicked();
			}

		},

		onGetAnswerButtonClicked: function(){

			// If Model id valid
			if(this.model.isValid(true)){

				// Remove Click of Next button
				this.undelegateEvents();

				// Check Answer
				this.checkAnswer();

			}

		},

		onNoAnswerButtonClicked: function(){
			this.model.set('userAnswer','=(');

			this.onGetAnswerButtonClicked();
		},

		showAnswer: function(){

			// Show / Hide / Disable things
			this.$el.find('#id_noAnswerButton').hide();
			this.$el.find('#id_getAnswerButton').hide();
			this.$el.find('#id_userAnswer').attr('disabled', 'disabled');
			this.$el.find('#id_answerContainer').show();

			// Make Focus on Continue button
			this.$el.find('#id_nextButton').focus();

		},

		checkAnswer: function(){

			// Compare Real Answer with User Answer
			var answer = this.model.get('answer').toLowerCase(),
				userAnswer = $.trim( this.model.get('userAnswer').toLowerCase() ),
				valid = false;

			// Check if partial terms are valid
			var A = answer.split(' '),
				UA = userAnswer.split(' ');

			for(var i=0;i<UA.length;i++){
				for( var j=0;j<A.length;j++ ){
					if( UA[i] === A[j] ){
						valid = true;
						break;	
					}					
				}
			}

			// If "answer" is equal to "userAnswer" or if "valid" is true, User Answer is OK.
			if( answer === userAnswer || valid ){

				// Update Correct Answer
				var updateCorrectAnswer = this.parentView.model.get('correct') + 1;
				this.model.set('correct', updateCorrectAnswer);
				this.parentView.model.set('correct', updateCorrectAnswer);

				// Show Ok Message
				this.$el.find("#id_answerContainer .ok").show();

			// Else, User Answer is wrong.
			}else{

				// Update Wrong Answer
				var updateWrongAnswer = this.parentView.model.get('wrong') + 1;
				this.model.set('wrong', updateWrongAnswer);
				this.parentView.model.set('wrong', updateWrongAnswer);
				
				// Show Wrong Message
				this.$el.find("#id_answerContainer .wrong").show();

			}

			// Update Actual Question
			var updateActualQuestion = this.parentView.model.get('actual') + 1;
			this.model.set('actual', updateActualQuestion);
			this.parentView.model.set('actual', updateActualQuestion);
			
			// Show Answer
			this.showAnswer();

		},

	});

	return QuestionView;

});