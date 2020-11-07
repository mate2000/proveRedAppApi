const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getReviews = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Reviews";
    let responseDB = await _servicePg.execute(sql);
    let rowCount = responseDB.rowCount;
    let rows = responseDB.rows;
    responseJSON.ok = true;
    responseJSON.message = "Review ok";
    responseJSON.info = rows;
    responseJSON.metainfo = { total: rowCount };
    response.status(200).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while select Review.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getReview = async (request, response) => {
  let responseJSON = {};
  try {
    const sql = "select * from Reviews where idClient = $1";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rows = responseDB.rows;
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Review not found (Verify id)";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Review Ok";
      responseJSON.info = rows;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Review while select user";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveReview = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "INSERT INTO Reviews (idclient, idservice, commentary, punctuation, reviewdate, multimedia)  VALUES($1, $2, $3, $4, $5, $6);";
    let body = request.body;
    let reviewDate = new Date(request.body.reviewDate);
    let values = [
      body.idClient,
      body.idService,
      body.commentary,
      body.punctuation,
      reviewDate,
      body.multimedia,
    ];
    await _servicePg.execute(sql, values);
    responseJSON.ok = true;
    responseJSON.message = "Review created";
    responseJSON.info = body;
    response.status(201).send(responseJSON);
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while created a review";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const updateReview = async (request, response) => {
  let responseJSON = {};
  try {
    const sql =
      "UPDATE Reviews SET commentary=$1, punctuation=$2, multimedia=$3  WHERE idreview=$4";
    let id = request.params.id;
    let body = request.body;
    values = [body.commentary, body.punctuation, body.multimedia, id];
    let responseDB = await _servicePg.execute(sql, values);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Review not found (Verify id).";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Review updated";
      responseJSON.info = body;
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while update review.";
    responseJSON.info = error.message;
    response.status(400).send(responseJSON);
  }
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const saveReviewDocument = async (request, response) => {
  try {
    let archivo = request.files.multimedia;
    //console.log(archivo);
    let name = archivo.name;
    let extend = name.split(".");
    extend = extend[extend.length - 1];
    if (extend === "jpg") {
      await archivo.mv("docs/" + name);
      let responseJSON = {};
      responseJSON.ok = true;
      responseJSON.message = "File ok";
      responseJSON.info = archivo.name;
      response.status(200).send(responseJSON);
    } else {
      let responseJSON = {};
      responseJSON.ok = false;
      responseJSON.message = "File no accepted. [jpg]";
      responseJSON.info = archivo.name;
      response.status(409).send(responseJSON);
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
const deleteReview = async (request, response) => {
  let responseJSON = {};
  try {
    sql = "DELETE FROM Reviews WHERE idReview=$1;";
    let id = request.params.id;
    let responseDB = await _servicePg.execute(sql, [id]);
    let rowCount = responseDB.rowCount;
    if (rowCount == 0) {
      responseJSON.ok = false;
      responseJSON.message = "Review not found (Verify id).";
      response.status(404).send(responseJSON);
    } else {
      responseJSON.ok = true;
      responseJSON.message = "Review deleted";
      responseJSON.metainfo = { total: rowCount };
      response.status(200).send(responseJSON);
    }
  } catch (error) {
    responseJSON.ok = false;
    responseJSON.message = "Error while delete Review.";
    responseJSON.info = error;
    response.status(400).send(responseJSON);
  }
};

module.exports = {
  getReviews,
  getReview,
  saveReview,
  updateReview,
  deleteReview,
  saveReviewDocument,
};
