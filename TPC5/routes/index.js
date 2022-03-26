var express = require('express');
var router = express.Router();
var axios = require('axios');
var {parse} = require('querystring');

/* GET home page (list of musics). */
router.get('/', function(req, res, next) {
  console.log('GET das músicas')
  axios.get("http://localhost:3000/musicas")
    .then(response => {
      var musics = response.data
      res.render('musics', {musics: musics});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

module.exports = router;
