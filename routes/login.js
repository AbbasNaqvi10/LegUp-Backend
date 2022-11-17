var express = require("express")
var router = express.Router()
const morgan = require('morgan');
var jwt = require("jsonwebtoken")

require('dotenv').config();
const { getAllItems, insertItem, updateItem, getSingleItemById, deleteSingleItemById, getItemsByEmailAndPass } = require('../methods/dynamo');

var app = express();

app.use(express.json());
app.use(morgan('dev'));

const TABLE_NAME = 'user_info';


router.post('/', async (req, res, next) => {
    let p_email = req.body.email
    let p_password= req.body.password
    console.log(req.body)
     try {
        const items = await getItemsByEmailAndPass(TABLE_NAME,p_email);
         if (p_email == items.Item.email && p_password == items.Item.password) {
             var token = jwt.sign(
                 { email: items.Item.email },
                'secretkey',
                (err, token) => {
                    res.send({
                        tokenAuth: token,
                        ok: true,
                        message: "Login successful",
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