const { request, response } = require("express");

const getProviders = (request, response) => {
  response.send("Endpoint GET Providers");
};

const getProvider = (request, response) => {
  let id = request.params.id;
  response.send("Endpoint GET Provider " + id);
};

const saveProvider = (request, response) => {
  response.send("Endpoint POST Providers");
};

const updateProvider = (request, response) => {
  let id = request.params.id;
  response.send("Endpoint PUT Providers" + id);
};

const deleteProvider = (request, response) => {
  response.send("Endpoint DELETE Providers");
};

module.exports = {
  getProviders,
  getProvider,
  saveProvider,
  updateProvider,
  deleteProvider,
};
