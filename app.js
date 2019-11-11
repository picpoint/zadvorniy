const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const GridFS = require('gridfs-stream');
const port = process.env.port || 4000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = express.json();

const urlMongoDB = 'mongodb+srv://rmtar:rmtar@cluster0-nw44p.mongodb.net/zadvorniydb?retryWrites=true&w=majority';
const Zadvorniy = require('./schems/zadvorniySchema.js');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  extname: 'hbs'
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET');
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});



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
    source: req.body.source,
    uploadimg: req.body.uploadimg    
	});

	newzadvorniyobj.save((err) => {    
		if(err) {
			throw new Error('***ERR TO SAVE OBJ***');
		} else {
			console.log(`save successfully`);
    }        
  });

  let read = fs.createReadStream(req.body.uploadimg);
  console.log(read);



  
  res.redirect('/');  

});

