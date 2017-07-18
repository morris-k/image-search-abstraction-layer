var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://main:pass@ds147872.mlab.com:47872/shorten", { useMongoClient: true});


var api = require("./api");

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/js', express.static(__dirname + '/node_modules/foundation-sites/dist/js'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/css', express.static(__dirname + '/node_modules/foundation-sites/dist/css'))
app.use('/api', api);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.get("/", function(req, res) {
	res.render("index", {base: req.headers.host});
});

app.listen(8000);
console.log("Now listening on port 8000.")