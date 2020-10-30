const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

const getUsers = async (request, response) => {
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
};

const getUser = (request, response) => {
  let id = request.params.id;
  response.send("Endpoint GET USER " + id);
};

const saveUser = (request, response) => {
  response.send("Endpoint POST USERS");
};

const updateUser = (request, response) => {
  let id = request.params.id;
  response.send("Endpoint PUT USERS " + id);
};

const deleteUser = (request, response) => {
  response.send("Endpoint DELETE USERS");
};

module.exports = { getUsers, getUser, saveUser, updateUser, deleteUser };
