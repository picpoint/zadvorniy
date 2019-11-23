const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const port = process.env.port || 4000;
const jsonParser = express.json();

const urlMongoDB = 'mongodb+srv://rmtar:rmtar@cluster0-nw44p.mongodb.net/zadvorniydb?retryWrites=true&w=majority';
const Zadvorniy = require('./schems/zadvorniySchema.js');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});


app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));




mongoose.connect(urlMongoDB, {useNewUrlParser: true}, (err) => {
	if(err) {
		throw new Error('***ERR TO CONNECT DB***');
	}	else {
		console.log('connect successfully');		
	}

	app.listen(port, () => {
		console.log(`---server start on port ${port}---`);
	});

});


app.get('/records', async (req, res) => {      
  const mass = await Zadvorniy.find({}, (err, docs) => {    
    if(err) {
      throw new Error('Err to find records');
    } else {                  
      //console.log(docs);
    }    
  });
    
  res.render('records', {
    title: 'Records page',
    mass
  });  
});


app.get('/', (req, res) => {        
  res.render('index');  
});


app.post('/', (req, res) => {  
  const newzadvorniyobj = new Zadvorniy({
		title: req.body.titlemultfilm,
		yearsOfIssue: req.body.dateofissue,
		duration: req.body.duration,
    source: req.body.source    
	});

	newzadvorniyobj.save((err) => {    
		if(err) {
			throw new Error('***ERR TO SAVE OBJ***');
		} else {
			console.log(`save successfully`);
    }        
  });
  
  res.redirect('/');  

});

