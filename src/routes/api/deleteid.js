const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment').Fragment;

// eslint-disable-next-line valid-jsdoc
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var deleteData;
  var ownerID = require('crypto').createHash('sha256').update(req.user).digest('hex');
  var id = req.params.id;
  //console.log(metadata);

  console.log("------------------------ Owner ID \n" + ownerID);

  console.log("------------------------ Fragment ID \n" + id);


  deleteData = await Fragment.delete(ownerID, id);
  console.log("================================ \n")

  console.log("================================ \n" + JSON.stringify(deleteData))


  if (deleteData != "deleted") {
    res.status(404).json(
      createErrorResponse({
        status: 404,
        err: 'Delete with id does not exist',
      })
    );
  }else {
    res.status(200).json(
    createSuccessResponse({
      status: 'ok',
      fragments: 'Deleted Fragment with id: ' + id,
    })
  );}
};