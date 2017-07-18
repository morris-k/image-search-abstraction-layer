var mongoose = require("mongoose");

var querySchema = mongoose.Schema({
	term: String,
	when: { type: Date, default: Date.now }
}, {
	collection: "queries"
});

module.exports = mongoose.model("Query", querySchema);