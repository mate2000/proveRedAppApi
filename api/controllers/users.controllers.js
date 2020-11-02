const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getUsers = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Users";
    let responseDB = await _servicePg.execute(sql);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    responseJSON.ok = true;
    responseJSON.message = "Users ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.status(200).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select user.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getUser = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Users where idUser = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rows = responseDB.rows;
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Users not found (Verify id)";
      response.status(400).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Users Ok";
      responseJSON.info = rows;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select user";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveUser = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "INSERT INTO Users (iduser, fullname, email, cellphone, password_, entity, rol) VALUES($1, $2, $3, $4, $5, $6, $7);";
    let body = request.body;
    let values = [
      body.id,
      body.fullname,
      body.email,
      body.cellphoneNumber,
      body.password,
      body.entity,
      body.rol,
    ];
    await _servicePg.execute(sql, values);
    responseJSON.ok = true;
    responseJSON.message = "User created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while created an user";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const updateUser = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "UPDATE Users SET fullname=$1, email=$2, cellphone=$3, password_=$4, entity=$5, rol=$6 WHERE iduser=$7;";
    let id = request.params.id;
    let body = request.body;
    values = [
      body.fullname,
      body.email,
      body.cellphoneNumber,
      body.password,
      body.entity,
      body.rol,
      id,
    ];
    let responseDB = await _servicePg.execute(sql, values);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Users not found (Verify id).";
      response.status(400).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "User updated";
      responseJSON.info = body;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while update user.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const deleteUser = async (request, response) => {
  let responseJSON = {};
  try {
    sql = "DELETE FROM Users WHERE iduser=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Users not found (Verify id).";
      response.status(400).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Users deleted";
      responseJSON.metainfo = { total: rowCount };
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while delete user.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

module.exports = { getUsers, getUser, saveUser, updateUser, deleteUser };
