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
    const sql =
      "select * from contracts where idclient = $1  or idprovider = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rows = responseDB.rows;
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Contract not found (Verify id)";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Contracts Ok";
      responseJSON.info = rows;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select Contracts";
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
    const sql = "select * from Contracts where idContract = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    responseJSON.ok = true;
    responseJSON.message = "Contracts ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.status(200).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select contracts.";
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
      "INSERT INTO public.contracts (idclient, idprovider, idservice, totalneto, documentcontract, isaceptedprovider, isaceptedclient, isprovidernotified, isclientnotified, state) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";
    let body = request.body;
    let values = [
      body.idClient,
      body.idProvider,
      body.idService,
      body.totalNeto,
      body.documentoContract,
      body.isAceptedProvider,
      body.isAceptedClient,
      body.isProviderNotified,
      body.isClientNotified,
      body.state,
    ];
    await _servicePg.execute(sql, values);
    responseJSON.ok = true;
    responseJSON.message = "Contract created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while created a contract";
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
      "UPDATE Contracts SET totalneto=$1, documentcontract=$2, isaceptedprovider=$3, isaceptedclient=$4, isprovidernotified=$5, isclientnotified=$6, state=$7 WHERE idcontract=$8";
    let id = request.params.id;
    let body = request.body;
    values = [
      body.totalNeto,
      body.documentoContract,
      body.isAceptedProvider,
      body.isAceptedClient,
      body.isProviderNotified,
      body.isClientNotified,
      body.state,
      id,
    ];
    let responseDB = await _servicePg.execute(sql, values);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Contract not found (Verify id).";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Contract updated";
      responseJSON.info = body;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while update contrac.";
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
    sql = "DELETE FROM Contracts WHERE idcontract=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Contract not found (Verify id).";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Contract deleted";
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
