// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
// Read environment variables from an .env file (if present)
require('dotenv').config();

//var MarkdownIt = require('markdown-it')

const Fragment = require('../../model/fragment').Fragment;
const {createErrorResponse, createSuccessResponse } = require('../../response');
const contentType = require('content-type')
const express = require('express');


// Support sending various Content-Types on the body up to 5M in size
const rawBodyPUT = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working.

  if(Fragment.isSupportedType(contentType.parse(req).type))
  {
  
  const ownerId = require('crypto').createHash('sha256').update(req.user).digest('hex');
  //const type = contentType.parse(req).type
  //const size = req.body.toString().length - 1


  var metadata = await Fragment.byId(ownerId, req.params.id);





  metadata.save()
  metadata.setData(req.body)

  //console.log(process.env.API_URL + '/' + fragment.id)

  //console.log(fragment)

  //console.log(size)
  //console.log(type);
  //console.log(ownerId)
  res.status(201).json(
    createSuccessResponse({
    status: 'ok',
    fragment: metadata
  }));
}else {
  res.status(415).json(
    createErrorResponse(415, 'Invalid Type')
  )
}
  
  
};


module.exports.rawBodyPUT = rawBodyPUT
