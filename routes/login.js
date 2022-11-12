var express = require("express")
var router = express.Router()
const morgan = require('morgan');
var jwt = require("jsonwebtoken")

require('dotenv').config();
const { getAllItems, insertItem, updateItem, getSingleItemById, deleteSingleItemById, getItemsByEmailAndPass } = require('../dynamo');

var app = express();

app.use(express.json());
app.use(morgan('dev'));

const TABLE_NAME = 'user_info';

// const username = "Onejohi"
// const password = "123456"

router.post('/', async (req, res, next) => {
    let p_email = req.body.email
    let p_password = req.body.password
    
    try {
        const items = await getItemsByEmailAndPass(TABLE_NAME,p_email,p_password);
        console.log(items)
        if (p_email == items.email && p_password == items.password) {
            var token = jwt.sign(
                { username: items.last_name },
                'secretkey',
                (err, token) => {
                    res.send({
                        tokenAuth: token,
                        ok: true,
                        message: "Login successful"
                    })
                    res.status(200).json(items);
                })
        } else {
            res.send({
                ok: false,
                message: "Email or password incorrect"
            })
        }
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({ message: err.message || 'Something went wrong' });
    }

})
module.exports = router;