'use strict';
var GiftList = require("../models/giftList");
var Order = require("../models/order");
var Gift = require("../models/gift");
/**
 * Create a Order
 * put - /api/order/:id/giftList
 * send: {id : string}
 * receive: {name: String}
 */
exports.create = function(req, res) {
    var giftList = new GiftList;
    giftList.name = req.body.name;

    giftList.save(function(err, giftList){
    	//if(err) res.send({error: err});
    	var conditions = { _id: req.params.id }
		, update = { $push: { giftLists: giftList._id }}
		, options = { multi: false };

		Order.update(conditions, update, options, callback);
		function callback (err, numAffected) {
	  		// numAffected is the number of updated documents
	  		    	res.send(giftList);
	  	}
    });
};


/*
 * Get all orders:
 * - Get- /api/order/:id/giftList
 * - send: offset
 * - receive: [order]
*/
exports.getGiftLists = function(req, res){
	//infinite scroll or paging
	//var offset = req.query.offset ? req.query.offset : 0;

	//Order.find({}).sort({dateCreated:-1}).skip(offset).limit(10).exec(function(err, orders){
	Order.findOne({_id: req.params.id}).exec(function(err, order){
		if(err) res.send({error: err});

		GiftList.find({_id: { $in: order.giftLists}}).exec(function(err, giftLists){
			res.send(giftLists);
		});
	});
}

/*
 * Get all orders:
 * - Get- /api/order/:orderId/giftList/:giftListId
 * - send: {}
 * - receive: List
*/
exports.getGiftListById = function(req, res){
	var id = req.params.giftListId;
	GiftList.findOne({_id: id}, function(err, giftList){
		if (err) res.send({error:err});
		Gift.find({_id: { $in: giftList.gifts}}).exec(function(err, gifts){
			res.send({gifts:gifts, name: giftList.name});
		});
	});
}

exports.addGift = function(req, res){
	var id = req.params.id;
	var gift = new Gift;
    gift.name = req.body.name;
    gift.asin = req.body.asin;
    gift.url = req.body.url;
    gift.thumbnail = req.body.thumbnail;
    gift.price = req.body.price;

    gift.save(function(err, gift){
    	//if(err) res.send({error: err});
    	var conditions = { _id: id }
		, update = { $push: { gifts: gift._id }}
		, options = { multi: false };

		GiftList.update(conditions, update, options, callback);
		function callback (err, numAffected) {
			console.log(numAffected)
	  		// numAffected is the number of updated documents
	  		res.send(gift);
	  	}
    });


}
