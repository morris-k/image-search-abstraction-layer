var express = require("express");
var mongoose = require("mongoose");
var Item = require("./query_model")
var request = require("request");

var base = "https://www.googleapis.com/customsearch/v1?" + 
			"key="+process.env.ISAPI_KEY + 
			"&cx="+process.env.ISCX +
			"&q="
var router = express.Router();

function processResults(body, cb) {
	var items = body.items;
	var results = []
	for (var i = 0; i < items.length; i++) {
		results.push({
			url: items[i].link, 
			snippet: items[i].snippet,
			thumbnail: items[i].image.thumbnailLink,
			context: items[i].image.contextLink
		});
	}
	cb(results);
}

function search(rparams, offset, cb) {
	var params = [];
	for (var i in rparams) {
		params.push(rparams[i]);
	}
	var terms = params.join(" ");
	var qs = encodeURIComponent(terms);
	
	qs += "&searchType=image"
	if (offset > 0) {
		qs += "&start=" + 10*parseInt(offset);
	}
	console.log(qs)
	request(base + qs, function(err, sp, body) {
		if (err) {
			cb(err, "Error in search");
		} else {
			processResults(JSON.parse(body), function(data) {
				cb(null, data, terms);
			});
		}
	})
}

function getLatest(cb) {
	Item.find({})
	.select('term when')
	.exec(cb);
}

router.get('/imagesearch/(*)', function(req, res) {
	var offset = 0;
	if (req.query.offset) {
		offset = req.query.offset;
	}
	 search(req.params, offset, function(err, data, terms) {
	 	if (err) {
	 		res.json({error: err})
	 	} else {
	 		var query = new Item({term: terms, when: Date.now()});
	 		console.log("saving query:\n\tterms:" + terms + "\n\twhen:" + query.when);
	 		query.save(function(err, q) {
	 			if (err) {
	 				console.log("QUERY SAVE ERROR:", err);
	 			} else {
	 				console.log("Query saved", q);
	 			}
	 			res.json(data);
	 		});
	 	}
	 })
})

router.post('/imagesearch', function(req, res) {
	res.send(req.body);
})

router.get('/latest', function(req, res) {
 	getLatest(function(err, queries) {
		if (err) {
			res.json(err);
			return;
		}
		res.json(queries);
	});
})


module.exports = router;