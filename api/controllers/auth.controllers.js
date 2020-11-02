const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();
const jwt = require("../services/jwt");

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const loginUser = async (request, response) => {
  let responseJSON = {};
  responseJSON.ok = true;
  try {
    const sql =
      "select fullname ,cellphone, rol from users where iduser=$1 and password_ = $2 ";
    let body = request.body;
    let values = [body.id, body.password];

    let responseDB = await _servicePg.execute(sql, values);
    let rowCount = responseDB.rowCount;
    if (rowCount == 1) {
      let user = responseDB.rows[0];
      responseJSON.message = "Token Created";
      responseJSON.info = jwt.createToken(user);
      response.status(201).send(responseJSON);
    } else {
      responseJSON.message = "Users not found (Verify id, password)";
      responseJSON.info = [];
      response.status(404).send(responseJSON);
    }
  } catch (error) {
    console.log(error.message);
    responseJSON.ok = false;
    responseJSON.message = "Error while get user.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const validToken = (request, response) => {
  let responseJSON = {};
  responseJSON.ok = true;
  try {
    responseJSON.message = "Token ok";
    responseJSON.info = decodeToken(request);
    response.send(responseJSON);
  } catch (error) {
    console.log(error.message);
    responseJSON.ok = false;
    responseJSON.message = "Error while valid the token.";
    responseJSON.info = {};
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Requet} request
 * @param {Response} response
 * @param {*} next
 */
const middelewar = (request, response, next) => {
  try {
    decodeToken(request);
    next();
  } catch (error) {
    console.log(error.message);
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while valid the middelware";
    responseJSON.info = error;
    response.status(401).send(responseJSON);
  }
};

const decodeToken = (request) => {
  let headers = request.headers.authorization.split(" ");
  let token = headers[1];
  return jwt.validToken(token);
};

/**
 *
 * @param {Requet} request
 * @param {Response} response
 */
const notFound = (request, response) => {
  let responseJSON = {};
  responseJSON.ok = false;
  responseJSON.message = "Error, endpoint not found";
  responseJSON.info = request.url;
  response.status(404).send(responseJSON);
};

module.exports = { loginUser, validToken, middelewar, notFound };
