var QuestionModel = Backbone.Model.extend({
	
	defaults: {
		id: 0,
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