'use strict';
const path = require('path'),
  { myCompanies } = require(path.join(__dirname, 'my-companies')),
  { getCompanyCreate, createCompany } = require(path.join(__dirname, 'create-company'))

module.exports = {
  myCompanies,
  getCompanyCreate,
  createCompany
}
