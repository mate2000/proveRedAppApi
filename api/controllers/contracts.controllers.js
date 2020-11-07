const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveContractDocument = async (request, response) => {
  try {
    let archivo = request.files.Contract;
    //console.log(archivo);
    let name = archivo.name;
    let extend = name.split(".");
    extend = extend[extend.length - 1];
    if (extend === "pdf") {
      await archivo.mv("docs/" + name);
      let responseJSON = {};
      responseJSON.ok = true;
      responseJSON.message = "Archivo ok";
      responseJSON.info = archivo.name;
      response.send(responseJSON);
    } else {
      let responseJSON = {};
      responseJSON.ok = false;
      responseJSON.message = "File no accepted. [pdf]";
      responseJSON.info = archivo.name;
      response.send(responseJSON);
    }
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "Error while saving the document.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getContracts = async (request, response) => {
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
const getContract = async (request, response) => {
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
      response.status(404).send(responseJSON);
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
const saveContract = async (request, response) => {
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
const updateContract = async (request, response) => {
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
const deleteContract = async (request, response) => {
  let responseJSON = {};
  try {
    sql = "DELETE FROM Users WHERE iduser=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Users not found (Verify id).";
      response.status(404).send(responseJSON);
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

module.exports = {
  saveContractDocument,
  getContracts,
  getContract,
  saveContract,
  updateContract,
  deleteContract,
};
