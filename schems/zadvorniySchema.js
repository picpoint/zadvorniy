const mongoose = require('mongoose');
const zadvorniySchema = mongoose.Schema({	
	title: String,
	yearsOfIssue: Date,
	duration: String,
	source: String,	
	created: {
		type: Date,
		default: Date.now
	}	
});


const Zadvorniy = mongoose.model('Zadvorniy', zadvorniySchema);
module.exports = Zadvorniy;