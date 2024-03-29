// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const rawBody = require('./post').rawBody
const rawBodyPUT = require('./put').rawBodyPUT

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

router.get('/fragments/:id', require('./getid'));
router.get('/fragments/:id/info', require('./getidinfo'));

router.get('/fragments/?expand=1', require('./get'));
// Other routes will go here later on...
// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody(), require('./post'));
router.delete('/fragments/:id', require('./deleteid'));
router.put('/fragments/:id', rawBodyPUT(), require('./put'));



module.exports = router;
