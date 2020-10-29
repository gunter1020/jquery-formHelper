var mime = require('mime-types');

/**
 * Get file type by filename
 *
 * @param {String} filename
 * @returns {String}
 */
export var getType = function (filename) {
  let mineType = mime.lookup(filename) || 'application/octet-stream';

  // General
  if (mineType.match(/^image/) !== null) {
    return 'image';
  } else if (mineType.match(/^audio/) !== null) {
    return 'audio';
  } else if (mineType.match(/^video/) !== null) {
    return 'video';
  } else if (mineType.match(/^font/) !== null) {
    return 'font';
  } else if (mineType.match(/^text\/csv/) !== null) {
    return 'csv';
  } else if (mineType.match(/^text\/xml/) !== null) {
    return 'xml';
  } else if (mineType.match(/^application\/xml/) !== null) {
    return 'xml';
  } else if (mineType.match(/^application\/pdf/) !== null) {
    return 'pdf';
  }

  // Microsoft
  if (mineType.match(/^application\/msword/) !== null) {
    return 'word';
  } else if (mineType.match(/^application\/vnd.ms-excel/) !== null) {
    return 'excel';
  } else if (mineType.match(/^application\/vnd.ms-powerpoint/) !== null) {
    return 'powerpoint';
  } else if (mineType.match(/^application\/vnd.openxmlformats-officedocument.wordprocessingml.document/) !== null) {
    return 'word';
  } else if (mineType.match(/^application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/) !== null) {
    return 'excel';
  } else if (mineType.match(/^application\/vnd.openxmlformats-officedocument.presentationml.presentation/) !== null) {
    return 'powerpoint';
  }

  // OpenDocument
  if (mineType.match(/^application\/vnd.oasis.opendocument.text/) !== null) {
    return 'word';
  } else if (mineType.match(/^application\/vnd.oasis.opendocument.spreadsheet/) !== null) {
    return 'excel';
  } else if (mineType.match(/^application\/vnd.oasis.opendocument.presentation/) !== null) {
    return 'powerpoint';
  }

  // Archive
  if (mineType.match(/^application\/zip/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/gzip/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/x-tar/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/x-bzip2?/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/x-7z-compressed/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/x-rar-compressed/) !== null) {
    return 'archive';
  } else if (mineType.match(/^application\/vnd.rar/) !== null) {
    return 'archive';
  }

  // Code
  if (mineType.match(/^text\/javascript/) !== null) {
    return 'code';
  } else if (mineType.match(/^application\/json/) !== null) {
    return 'code';
  } else if (mineType.match(/^application\/x-httpd-php/) !== null) {
    return 'code';
  } else if (mineType.match(/^application\/x-sh/) !== null) {
    return 'code';
  } else if (mineType.match(/^application\/x-csh/) !== null) {
    return 'code';
  }

  // unknown
  return 'file';
};
