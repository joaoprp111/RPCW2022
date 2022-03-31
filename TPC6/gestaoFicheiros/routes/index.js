var express = require('express');
var router = express.Router();
var File = require('../controllers/file');
var multer = require('multer');
var upload = multer({dest: 'uploads'});
var fs = require('fs');
var url = require('url');

/* GET main page. */
router.get(/\/(files)?$/, function(req, res, next) {
  console.log('GET da página principal')
  File.list()
    .then(data => res.render('index', {list: data, title: "Lista de ficheiros"}))
    .catch(error => res.render('error', {error: error}))
});

/* GET remove file. */
router.get('/files/remove', function(req, res, next) {
  console.log('GET para eliminar um ficheiro')
  var urlObj = url.parse(req.url, true);
  var queryString = urlObj.query
  var id = queryString.id
  console.log('Id do objeto a remover: ' + id)
  var name = queryString.name
  console.log('Nome do ficheiro a remover: ' + name)

  File.delete(id)
    .then(data => console.log(data))
    .catch(error => res.render('error', {error: error}))

  let fileStorePath = __dirname + './../public/images/' + name

  //Remove file
  fs.unlinkSync(fileStorePath)
  console.log('Ficheiro removido!')

  res.redirect('/')
});

/* GET file page. */
router.get(/files\/[a-zA-Z0-9]+$/, function(req, res, next) {
  console.log('GET da página de um ficheiro')
  var id = req.url.split("/")[2]
  File.lookUp(id)
    .then(data => res.render('file', {f: data}))
    .catch(error => res.render('error', {error: error}))
});

/* POST file. */
router.post('/files', upload.single('myFile'), (req, res) => {
  console.log('POST de um novo ficheiro')
  let oldPath = __dirname + './../' + req.file.path
  let newPath = __dirname + './../public/images/' + req.file.originalname

  fs.rename(oldPath, newPath, erro => {
    if(erro) throw erro;
  });

  var d = new Date().toISOString().substring(0,16)
  
  var file = {
    date: d,
    name: req.file.originalname,
    description: req.body.fileDesc,
    mimetype: req.file.mimetype,
    size: req.file.size
  }
  File.insert(file)
    .then(data => {
      console.log(JSON.stringify(data))
    })
    .catch(error => res.render('error', {error: error}))

  res.redirect('/')
});

module.exports = router;
