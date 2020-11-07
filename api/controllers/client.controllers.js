const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getClients = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "select fullname, email, cellphone, password_ from clients inner join users on clients.iduser = users.iduser";
    let responseDB = await _servicePg.execute(sql);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    responseJSON.ok = true;
    responseJSON.message = "Client ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.status(200).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select client.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getClient = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "select fullname, email, cellphone, password_ from clients inner join users on clients.iduser = users.iduser where clients.idUser = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rows = responseDB.rows;
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Client not found (Verify id)";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Client Ok";
      responseJSON.info = rows;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select client";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveClient = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "INSERT INTO clients(iduser) VALUES($1);";
    let body = request.body;
    await _servicePg.execute(sql, [body.idUser]);
    responseJSON.ok = true;
    responseJSON.message = "Client created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while created a client";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const updateClient = async (request, response) => {
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
      response.status(404).send(responseJSON);
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
const deleteClient = async (request, response) => {
  let responseJSON = {};
  try {
    sql = "DELETE FROM Clients WHERE iduser=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Clients not found (Verify id).";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Clients deleted";
      responseJSON.metainfo = { total: rowCount };
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while delete Clients.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

module.exports = {
  getClients,
  getClient,
  saveClient,
  updateClient,
  deleteClient,
};
