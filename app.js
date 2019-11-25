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


let gfs;

const conn = mongoose.createConnection(urlMongoDB, {useNewUrlParser: true});

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


conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
});


const storage = new GridFsStorage({
  url: urlMongoDB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err) {
          reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketname: 'fs'
        };
        resolve(fileInfo);
      });
    });
  }
});

const uploads = multer({storage});



app.get('/records', async (req, res) => {      
  const mass = await Zadvorniy.find({}, (err, docs) => {    
    if(err) {
      throw new Error('Err to find records');
    } else {                  
      //console.log(docs);
    }    
  });

  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      res.render('records', {files: false});
    } else {
      
      files.map(file => {
        if(file.contentType == 'image/jpeg' || file.contentType == 'image/jpg' || file.contentType == 'image/png') {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });

      res.render('records', {
        files: files,
        mass: mass
      });      
      
    }    
  });
  
  
});


app.get('/', (req, res) => {        
  res.render('index');  
});


app.post('/', uploads.single('file'), (req, res) => {  
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

