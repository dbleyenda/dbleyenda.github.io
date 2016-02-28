// Filename: collections/admin/add/ArrayCollection
define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){

	var ArrayCollection = Backbone.Collection.extend({

		prepareArray: function(){

			var collectionArray = []

			_.each( this.toJSON(), function(value, key, list){
				var item = value.item
				collectionArray.push(item);
			});

			return collectionArray;

		}

	});

	return ArrayCollection;

});