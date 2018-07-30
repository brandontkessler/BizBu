'use strict';
const path = require('path'),
  crypto = require('crypto'),
  config = require(path.join(process.cwd(), 'app', 'config'))

let encrypterKey = config.encrypterKey

let encode = async (str) => {
  let iv = await crypto.pbkdf2Sync(encrypterKey, crypto.randomBytes(16), 10000, 16, 'sha512')
  let key = Buffer.from(encrypterKey, 'binary', 32)
  let cipher = crypto.createCipheriv('AES-256-CTR', key, iv)
  let encodedText = cipher.update(str, 'utf8', 'hex')
  encodedText += cipher.final()
  return encodedText + "." + iv.toString('hex')
}


let decode = (str) => {
  let encodedString = str.split(".")[0]
  let iv = Buffer.from(str.split(".")[1], 'hex')
  let key = Buffer.from(encrypterKey, 'binary', 32)
  let decipher = crypto.createDecipheriv('AES-256-CTR', key, iv)
  let decodedText = decipher.update(encodedString, 'hex')
  decodedText += decipher.final()
  console.log(decodedText)
  return decodedText
}

module.exports = {
  encode,
  decode
}
