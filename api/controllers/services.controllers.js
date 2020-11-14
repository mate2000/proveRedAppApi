const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getServices = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Services";
    let responseDB = await _servicePg.execute(sql);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    responseJSON.ok = true;
    responseJSON.message = "Services ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.status(200).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select Services.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getService = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Services where idProvider = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rows = responseDB.rows;
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Service not found (Verify id)";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Service Ok";
      responseJSON.info = rows;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select service";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveService = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "INSERT INTO Services (idprovider, description, initdate, findate, state, total) VALUES($1, $2, $3, $4, $5, $6);";
    let body = request.body;
    let initdate = new Date(request.body.initdate);
    let findate = new Date(request.body.findate);
    let values = [
      body.idprovider,
      body.description,
      initdate,
      findate,
      body.state,
      body.total,
    ];
    await _servicePg.execute(sql, values);
    responseJSON.ok = true;
    responseJSON.message = "Service created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while created a service";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const updateService = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "UPDATE Services  SET description=$1, initdate=$2, findate=$3, total=$4 WHERE idservice= $5";
    let id = request.params.id;
    let body = request.body;
    let initDate = new Date(request.body.initDate);
    let finDate = new Date(request.body.finDate);
    let values = [body.description, initDate, finDate, body.total, id];
    let responseDB = await _servicePg.execute(sql, values);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Service not found (Verify service).";
      response.status(400).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Service updated";
      responseJSON.info = body;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while update service.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const deleteService = async (request, response) => {
  let responseJSON = {};
  try {
    sql = "DELETE FROM Services WHERE idService=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Service not found (Verify service).";
      response.status(400).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Service deleted";
      responseJSON.metainfo = { total: rowCount };
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while delete Service.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

module.exports = {
  getServices,
  getService,
  saveService,
  updateService,
  deleteService,
};
