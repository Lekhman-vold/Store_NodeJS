const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Головна сторінка',
        isHome: true
    })
})

module.exports = router