var express = require("express")
var methods = require("../methods/methods")
var router = express.Router();
router.get("/", methods.ensureToken, (req, res, next) => {
  res.render('index', { title: 'Express' })
})
module.exports = router;
