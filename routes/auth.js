const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loginValidation, registerValidation } = require('../validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         name: victor manuel
 *         email: vpm570@inlumine.ual.es
 *         password: SomePassword
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Operations related with users
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *          description: Email already exists, bad user formed or error
 *       500:
 *         description: Some server error
 */
router.post('/register', async (req, res) => {
  //VALIDATE DATA BEFORE WE A USER
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Token  of JWT
 *       400:
 *          description: Email or password is wrong
 *       500:
 *         description: Some server error
 */
router.post('/login', async (req, res) => {
  //VALIDATE DATA BEFORE WE A USER
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password is wrong');
  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Email or password is wrong');
  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.status(200).header('auth-token', token).send(token);
});

module.exports = router;
