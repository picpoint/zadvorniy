const mongoose = require('mongoose');
const zadvorniySchema = mongoose.Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	cover: Buffer,
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