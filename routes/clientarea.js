const express = require('express');
const router = express.Router();
const request = require('request')

const BASE_URL = "http://localhost:3000/api/"

function validateLogin(req, res, next) {
    if(!req.session.user) res.redirect('/login');
    let user = req.session.user
    req.body.user = user
    next()
}

function getCustomerData(res,id,page) {

    request.get({
        url: `${BASE_URL}users/customer/${id}`,
        method: 'GET',
        json: true
    }, (error, response) => {
        if(error) res.status(404).end()

        let customer = {
            id: response.body.cust_id,
            address: response.body.address,
            tel: response.body.telephone
        }

        let loggedInUser = response.body.user

        request.get({
            url: `${BASE_URL}orders/customer/${loggedInUser.id}`,
            method: 'GET',
            json: true
        }, (err, resp) => {

            let orders = resp.body.success
            let products = []
            let tickets = []
            let receipts = []
            let statements = []

            orders.forEach(item => {
                products = item.products
            });

            res.render('clientarea/dashboard', { page: page, user: loggedInUser , orders: orders, products: products, tickets: tickets, customer: customer, receipts: receipts, statements: statements })

        })
    })
}

router.get('/', validateLogin,(req,res) => {
    res.redirect('clientarea/dashboard')
})

router.get('/dashboard',validateLogin, (req, res) => {
    let sessionuser = req.body.user
    //get user object with related products and orders
    getCustomerData(res, sessionuser.id, 'summary')

})

router.get('/statements', validateLogin, (req, res) => {
    let id = req.body.user.id
    getCustomerData(res,id,'statements')
})

router.post('/logout', (req, res, next) => {
    req.session.destroy;
    res.redirect('/login')
    next()
})


module.exports = router;