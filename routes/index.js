var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Get the about us page */
router.get('/about', (req, res, next) => {
  res.render('about')
})

/* Get business solutions page */
router.get('/business', (req,res,next) => {
  res.render('business')
})


/* Get websites and hosting page */
router.get('/websites', (req, res, next ) => {
  res.render('websites')
})

/* Get the client area login  */
router.get('/login', (req,res,next) => {
  res.render('login')
})

/* Get the bulk sms page */
router.get('/bulksms', (req, res, next) => {
  res.render('bulksms')
})

/* get the school systems */
router.get('/schools', (req, res, next) => {
  res.render('schools')
})

/* get realestate solutions */
router.get('/realestate', (req, res, next) => {
  res.render('realestate')
})

router.get('/farming', (req,res,next)=> {
  res.render('farming')
})

module.exports = router;
