const express = require('express');
const router = express.Router()

router.get('/',(req,res) => {
    res.redirect('clientarea/dashboard')
})

router.get('/dashboard', (req, res) => {
    res.render('clientarea/dashboard',);
})

router.get('/statements', (req, res) => {
    res.render('clientarea/statements')
})


module.exports = router;