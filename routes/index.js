const express = require('express');
const router = express.Router();
const request = require('request');
const session = require('express-session');


const BASE_URL = "http://localhost:3000/api/"

function checkCart(req) {
  let cartItems2 = []
  if(req.session.cart) cartItems2 = req.session.cart
  return cartItems2.length
}


/* GET home page. */
router.get('/', function(req, res, next) {
  let itemsIncart = checkCart(req)
  res.render('index', { title: 'Inspirehub', cartItems: itemsIncart});
});


/* Get the about us page */
router.get('/about', (req, res, next) => {
  let itemsIncart = checkCart(req)
  res.render('about', { cartItems: itemsIncart})
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
router.get('/business', (req,res,next) => {
  getProducts(2, (data) => {
    let products = data
    let itemsIncart = checkCart(req)
    res.render('business', { products: products, cartItems: itemsIncart})
  })

  // res.render('business') 
})


/* Get websites and hosting page */
router.get('/websites',(req, res, next ) => {
  let itemsIncart = checkCart(req)
  res.render('websites', { cartItems: itemsIncart})
})



/* Get the bulk sms page */
router.get('/bulksms', (req, res, next) => {
  getProducts(3, (data) => {
    let products = data
    let itemsIncart = checkCart(req)
    res.render('bulksms', { cartItems: itemsIncart, products: products })
  })

})

/* get the school systems */
router.get('/schools', (req, res, next) => {
  getProducts(1, (data) => {
    let schoolproducts = data
    let itemsIncart = checkCart(req)
    res.render('schools', { cartItems: itemsIncart, products: schoolproducts})
  })
  
})

/* get realestate solutions */
router.get('/realestate', (req, res, next) => {
  let itemsIncart = checkCart(req)
  getProducts(6, (data ) => {
    let realesttateProducts = data

    res.render('realestate', { cartItems: itemsIncart, products: realesttateProducts })
  })
  
})

/* route to the farming solutions page */
router.get('/farming', (req,res,next)=> {
  getProducts(7, (data) => {
    let farmingSolutions = data
    let itemsIncart = checkCart(req)
    res.render('farming', { cartItems: itemsIncart, products: farmingSolutions })
  })
  
})




/* Adding items to the cart session object. uses express-session to get the session objects */
router.post('/addtocart', (req,res,next) => {
  let cartItems;
  if(req.session.cart != null) {
    cartItems = req.session.cart
  } else {
    cartItems = []
  }
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

router.get('/cartitems', (req,res,next) => {
  if(req.session.cart == null) {
    res.status(404).render('cart', { notfound: "Your shopping cart is empty at the moment !", cartItems: 0 })

    next()
  }

  let cartItems = req.session.cart

  let total =  0

  res.render('cart', { notfound: null , cart: cartItems, cartItems: cartItems.length, total  })

})

/* Removing Items from the cart Object*/
router.get("/remove/:id", (req, res) => {
  let itemId = req.params.id
  let items = []
  items = req.session.cart

  let item = items.filter(x => x.id == itemId).pop()
  let indexofItem = items.indexOf(item)
  items.splice(indexofItem, 1)
  console.log(items.length)
  if(items.length > 0) {
    req.session.cart = items
  } else {
    req.session.destroy()
  }
  res.redirect('/cartitems')
})


router.get('/checkout', (req,res,next) => {
  let itemsIncart = checkCart(req)
  res.render('checkout', { cartItems: itemsIncart})
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
router.get('/login', (req,res,next) => {
  let itemsIncart = checkCart(req)
  res.render('login', { cartItems: itemsIncart})
})


/* Client login post request */
router.post('/login',(req, res, next ) => {
  
  let user = req.body

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
