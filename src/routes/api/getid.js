// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
// Read environment variables from an .env file (if present)


//var MarkdownIt = require('markdown-it')
var markdown = require( "markdown" ).markdown;
const Fragment = require('../../model/fragment').Fragment;
const {createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working.
  var params;
  var ext;
  var hasextension = false;

  if(req.params.id.includes('.')){
    hasextension = true;
    ext = req.params.id.substring(req.params.id.indexOf('.') + 1);
    params = req.params.id.substring(0, req.params.id.indexOf('.'));
  }else{
    params = req.params.id 
  }


  
  var ownerId = require('crypto').createHash('sha256').update(req.user).digest('hex');
  var metadata = await Fragment.byId(ownerId, params);

  console.log(metadata+ "--------------------------------------")
  
  const type = metadata.type
  
  if(!metadata) { res.status(404).json(
      createErrorResponse({
        status: 404,
        err: "Metadata with given id does not exist"
      })
  )}

  var dataText = await metadata.getData();
  dataText = dataText.toString();

  if(hasextension)
  {
    if(ext == 'html' && type == 'text/plain'){
      res.status(200);
      res.type('html');
      res.send(`<h1> ${dataText}</h1>`);
  }
    if(ext == 'html' && type == 'text/markdown'){
      res.status(200);
      res.type('html');
      var htmlResult = markdown.toHTML(dataText);
      res.send(htmlResult);
  } 
  }else {
      res.setHeader('Content-Type', type)
      res.status(200);
      res.send(dataText)
  }
  
};
