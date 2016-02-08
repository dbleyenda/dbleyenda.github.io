// Filename: models/game/QuestionModel
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone_validation'
], function($, _, Backbone){

	var QuestionModel = Backbone.Model.extend({
		
		defaults: {
			userAnswer: "",
			answer: "",
			filename: "",
			birth_death: "",
			name: "",
			year: "",
			type: "",
			info: [],
			links: [],
			extra: [],
		},

		validation: {
			userAnswer: [
				{
					required: true,
					msg: "No te olvides de responder!"
				}
			]
		},

		initialize: function(){
			
			// Prepare Info
			if( !_.isUndefined( this.get('info') ) ){
				this.prepareList( this.get('info'), 'info' );
			}

			// Prepare Extra
			if( !_.isUndefined( this.get('extra') ) ){
				this.prepareList( this.get('extra'), 'extra' );
			}

			// Prepare Links
			if( !_.isUndefined( this.get('links') ) ){
				this.prepareLinks( this.get('links'), 'links' );
			}
		},

		prepareInfo: function(){

			var info = this.get('info').split(';'),
				newInfo = '';

			for(var i=0;i<info.length;i++){
				newInfo += '<li>' + info[i] + '</li>';
			}

			this.set('info', newInfo);

		},

		prepareList: function(list, propertyName){

			var newList = '';

			if(list[0] != ''){
				for(var i=0;i<list.length;i++){
					newList += '<li>' + list[i] + '</li>';
				}
			}

			this.set(propertyName, newList);

		},

		prepareLinks: function(list, propertyName){

			var newList = '';

			if(list[0] != ''){
				for(var i=0;i<list.length;i++){
					newList += '<li><a href="' + list[i] + '" target="_blank">' + list[i] + '</a></li>';
				}
			}

			this.set(propertyName, newList);

		},

	});

	return QuestionModel;

});