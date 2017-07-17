var express = require("express");

var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://main:pass@ds147872.mlab.com:47872/shorten", { useMongoClient: true});

var querySchema = mongoose.Schema({
	term: String,
	when: { type: Date, default: Date.now }
}, {
	collection: "queries"
});
var Query = mongoose.model("Query", querySchema);

var app = express();
app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'pug');


app.get("/", function(req, res) {
	res.render("index");
});

app.listen(8000);
console.log("Now listening on port 8000.")