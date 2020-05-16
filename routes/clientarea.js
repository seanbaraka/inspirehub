const express = require('express');
const router = express.Router()

router.get('/',(req,res) => {
    res.redirect('clientarea/dashboard')
})

router.get('/dashboard', (req, res) => {
    res.render('clientarea/dashboard', { page: 'summary'});
})

router.get('/statements', (req, res) => {
    res.render('clientarea/dashboard',{ page: 'statements'})
})



module.exports = router;