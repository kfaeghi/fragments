// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
 const Fragment = require('../../model/fragment').Fragment;


 const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  //console.log(req.query.expand)

  var ownerId = require('crypto').createHash('sha256').update(req.user).digest('hex');
  var metadata;
  if(req.query.expand == 1) { metadata = await Fragment.byUser(ownerId, req.query.expand); }
  else {
    metadata = await Fragment.byUser(ownerId, req.query.expand);
  }

  //console.log(metadata)

  
  if(!metadata) { res.status(404).json(
      createErrorResponse({
        status: 404,
        err: "Metadata with given id does not exist"
      })
  )}

  res.status(200).json(
    createSuccessResponse({
    status: 'ok',
    fragments: [
      {
       "id": metadata
      }],
  }));
};
