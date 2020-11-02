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

module.exports = { saveContractDocument };
