var express = require('express');
var router = express.Router();
const request = require('request');
var session = require('express-session')



const BASE_URL = "http://localhost:3000/api/"

var cartItems = []

function checkCartObject(req, res, next) {
  if(req.session.cart) cartItems = req.session.cart
  next()
}

/* GET home page. */
router.get('/', checkCartObject, function(req, res, next) {
  res.render('index', { title: 'Express', cartItems: cartItems.length });
});


/* Get the about us page */
router.get('/about', checkCartObject, (req, res, next) => {
  res.render('about', { cartItems: cartItems.length})
})

function getProducts(id,callback) {
  request.get({
    url: `${BASE_URL}products/category/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, resp) => {
    if(err) throw err;

    let products = JSON.parse(resp.body)

    return callback(products)

  })
}

/* Get business solutions page */
router.get('/business', checkCartObject, (req,res,next) => {
  getProducts(2, (data) => {
    let products = data

    res.render('business', { products: products, cartItems: cartItems.length })
  })

  // res.render('business') 
})


/* Get websites and hosting page */
router.get('/websites',checkCartObject, (req, res, next ) => {
  
  res.render('websites', { cartItems: cartItems.length})
})



/* Get the bulk sms page */
router.get('/bulksms', checkCartObject, (req, res, next) => {
  getProducts(3, (data) => {
    let products = data

    res.render('bulksms', { cartItems: cartItems.length, products: products })
  })

})

/* get the school systems */
router.get('/schools', checkCartObject, (req, res, next) => {
  getProducts(1, (data) => {
    let schoolproducts = data

    res.render('schools', { cartItems: cartItems.length, products: schoolproducts})
  })
  
})

/* get realestate solutions */
router.get('/realestate', checkCartObject, (req, res, next) => {

  getProducts(6, (data ) => {
    let realesttateProducts = data

    res.render('realestate', { cartItems: cartItems.length, products: realesttateProducts })
  })
  
})

/* route to the farming solutions page */
router.get('/farming', checkCartObject, (req,res,next)=> {
  getProducts(7, (data) => {
    let farmingSolutions = data

    res.render('farming', { cartItems: cartItems.length, products: farmingSolutions })
  })
  
})




/* Adding items to the cart session object. uses express-session to get the session objects */
router.post('/addtocart', (req,res,next) => {
  let prodId = req.body.itemid
  request.get({
    url: `${BASE_URL}products/${prodId}`,
    method: 'GET'
  }, (errorMesage, response) => {
    if(errorMesage) throw errorMesage;

    let item = JSON.parse(response.body)

    /* If an item id already exists in the cart, then increament
    the sub total and item quantiy */

    cartItems.push(item);
    req.session.cart = cartItems

    res.status(200).json(cartItems.length)
  })
})


/* Retrieving the cart items from the cart session object */

router.get('/cartitems', checkCartObject, (req,res,next) => {
  if(!req.session.cart) {

    res.status(404).render('cart', { notfound: "Your shopping cart is empty at the moment !", cartItems: cartItems.length })

    next()
  } 

  let total =  0

  res.render('cart', { notfound: null , cart: cartItems, cartItems: cartItems.length, total  })

})


router.get('/checkout', checkCartObject, (req,res,next) => {
  res.render('checkout', { cartItems: cartItems.length })
})

/* Customer registration */
router.post('/register', (req, res, next) => {

  let order = req.session.cart

  req.body.order = order

  const user = req.body
  
  request.post(
    `${BASE_URL}users/customer/register`, {
      json: true,
      body: user,
      method: 'POST'
    }, 
    (error, response) => {

      if(error) res.status(403).end()

      req.session.destroy();
      cartItems = []
 
      console.log(response)

      res.status(200).redirect('/login')

    }
  )
  
  // console.log(req.body)
})


/* Get the client area login  */
router.get('/login', checkCartObject, (req,res,next) => {
  res.render('login', { cartItems: cartItems.length})
})


/* Client login post request */
router.post('/login',(req, res, next ) => {
  
  let user = req.body

  console.log(user)

  request.post(`${BASE_URL}users/login`, {
    method: 'POST',
    json: true, 
    body: user
  }, (error, response) => {
    if(error) res.status(404)

    if(response.body.error) res.status(403).end()

    req.session.user = response.body.success;
    res.redirect('/clientarea')
  })
})

module.exports = router;
