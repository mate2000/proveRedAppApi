const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

const getProviders = async (request, response) => {
  //response.send("Endpoint GET Providers"); 
  try {
    const sql = "select Users.iduser, fullname, cellphone, entity, companyname, typeprovider, servicedescription, averagepunctuation from Providers inner join Users on Providers.iduser = Users.iduser;";
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
    responseJSON.message = "Error while get providers.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }

};

const getProvider = async (request, response) => {
  try {
    const sql = "select Users.iduser, fullname, cellphone, entity, companyname, typeprovider, servicedescription, averagepunctuation from Providers inner join Users on Providers.iduser = Users.iduser Where Users.iduser = $1";
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
    responseJSON.message = "Error while searching user.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

const saveProvider = async (request, response) => {
  //response.send("Endpoint POST Providers");
  try {
    const sql =
    "INSERT INTO public.providers (iduser, companyname, typeprovider, servicedescription, averagepunctuation) VALUES($1, $2, $3, $4, $5);";
    let body = request.body;
    let values = [
      body.idUser,
      body.companyName,
      body.typeProvider,
      body.serviceDescription,
      body.averagePunctuation,
    ];
    await _servicePg.execute(sql, values);
    let responseJSON = {};
    responseJSON.ok = true;
    responseJSON.message = "provider created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    let responseJSON = {};
    responseJSON.ok = false;
    responseJSON.message = "provider Not has been created";
    responseJSON.info = error.message;
    response.status(404).send(responseJSON);
  }
};

const updateProvider = async(request, response) => {
  try {
    const sql =
      "UPDATE public.providers SET companyname= $1, typeprovider= $2, servicedescription= $3 WHERE idUser= $4;";
    let id = request.params.id;
    let body = request.body;
    values = [
      body.companyName,
      body.typeProvider,
      body.serviceDescription,
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
    responseJSON.message = "Error while update provider";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

const deleteProvider = async(request, response) => {
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
    responseJSON.message = "Error while delete provider";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

module.exports = {
  getProviders,
  getProvider,
  saveProvider,
  updateProvider,
  deleteProvider,
};
