const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

const getUsers = async (request, response) => {
  try {
    const sql = "select * from Users";
    let responseDB = await _servicePg.execute(sql);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "Users ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while create user.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

const getUser = async (request, response) => {
  try {
    const sql = "select * from Users where idUser = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "Users Ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while serching user.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveUser = async (request, response) => {
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
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "User created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "User created";
    responseJSON.info = request.body;
    response.status(404).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const updateUser = async (request, response) => {
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
    await _servicePg.execute(sql, values);
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "User updated";
    responseJSON.info = body;
    response.send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while update user.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const deleteUser = async (request, response) => {
  try {
    sql = "DELETE FROM Users WHERE iduser=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "Users deleted";
    responseJSON.info = [];
    responseJSON.metainfo = { total: rowCount };
    response.send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while delete user.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

module.exports = { getUsers, getUser, saveUser, updateUser, deleteUser };
