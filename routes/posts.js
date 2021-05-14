const router = require('express').Router();
const verify = require('./verifyToken');

router.post('/', verify, (req, res) => {
  res.send(req.user);
  User.findbyOne({ _id: req.user });
});

module.exports = router;
