const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Введіть коректний Email')
        .custom(async (value, {req}) => {
        try{
            const user = await User.findOne({email: value})
            if(user){
                return Promise.reject('Такий email вже зайнятий')
            }
        }catch (e){
            console.log(e)
        }
    }).normalizeEmail(),

    body('password', 'Пароль має містити мінімум 6 символів')
        .isLength({min: 6, max: 56})
        .isAlphanumeric().trim(),

    body('confirm').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Паролі мають співпадати')
        }
        return true
    }).trim(),

    body('name').isLength({min: 3}).withMessage('Ім\'я має бути мінімум три символи').trim()
]

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Мінімальна назва 3 символи').trim(),
    body('price').isNumeric().withMessage('Введіть коректну ціну')
]


