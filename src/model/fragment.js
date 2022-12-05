// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
    `text/plain`,
    `text/markdown`,
    `text/html`,
    `application/json`
    /*
     Currently, only text/plain is supported. Others will be added later.
  
    `text/markdown`,
    `text/html`,
    `application/json`,
    `image/png`,
    `image/jpeg`,
    `image/webp`,
    `image/gif`,
    */
  ];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // TODO
    if (ownerId == undefined && type == undefined)
      throw 'ownerIda and type are required to create a new class!';
    else if (ownerId == undefined || type == undefined)
      throw 'ownerIda and type are required to create a new class!';
    else this.ownerId = ownerId;


    if(validTypes.includes(type) || type == 'text/plain; charset=utf-8')
    {
      this.type = type;

    }else throw 'invalid type'


    if (typeof size != 'number' || size < 0) throw 'size must me a number and greater then -1!';
    else this.size = size;

    if (id == undefined || id == '') this.id = randomUUID();
    else this.id = id;

    if (created == undefined) this.created = new Date().toISOString();
    else this.created = created;

    if (updated == undefined) this.updated = new Date().toISOString();
    else this.updated = updated;
    
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
        return await listFragments(ownerId, expand);     
   
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const result = await readFragment(ownerId, id)
    if(result == undefined || result == null || result == 'unable to read fragment data'){
        Promise.resolve(undefined)
        return result
      }else return new Fragment(result);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    // TODO
    return await deleteFragment(ownerId, id)
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    // TODO
    var obj = await readFragmentData(this.ownerId, this.id);
    
    return Buffer.from(obj)
    
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if(data == '') throw 'No Data Given'
    this.updated = new Date().toISOString();
    this.size++
     return await writeFragmentData(this.ownerId, this.id, data.toString());
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    if(this.type == 'text/plain' || this.type == 'text/plain; charset=utf-8')
        return true;
    else return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    var type = [];
    for (let i = 0; i < validTypes.length; ++i)
      if (this.type.includes(validTypes[i])) type.push(validTypes[i]);

    return type;
   
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    var valid = false;
    for (var i = 0; i < validTypes.length; i++) {
        if(validTypes[i] == value || value == 'text/plain; charset=utf-8'){
            valid = true;
        }
    }
    return valid;


  }
}

module.exports.Fragment = Fragment;