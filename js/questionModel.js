var QuestionModel = Backbone.Model.extend({
	
	defaults: {
		answer: "",
		filename: "",
		userAnswer: ""
	},

	validation: {
		userAnswer: [
			{
				required: true,
				msg: "No te olvides de responder!"
			}
		]
	}

});