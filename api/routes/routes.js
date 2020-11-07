const { request, response } = require("express");
const express = require("express");
const userController = require("../controllers/users.controllers");
const clientController = require("../controllers/client.controllers");
const providerController = require("../controllers/providers.controllers");
const serviceController = require("../controllers/services.controllers");
const contractController = require("../controllers/contracts.controllers");
const authController = require("../controllers/auth.controllers");
const reviewsControllers = require("../controllers/reviews.controllers");

const router = express.Router();

router.get("/api/v2", (request, response) => {
  response.send("Api red app");
});

router
  .post("/api/v2/users/login", authController.loginUser)
  .post("/api/v2/users", userController.saveUser)

  .use("/", authController.middelewar)
  .get("/api/v2/users/valid", authController.validToken)

  .get("/users", userController.getUsers)
  .get("/users/:id", userController.getUser)
  .put("/api/v2/users/:id", userController.updateUser)
  .delete("/api/v2/users/:id", userController.deleteUser)

  .get("/api/v2/clients", clientController.getClients)
  .get("/api/v2/clients/:id", clientController.getClient)
  .post("/api/v2/clients", clientController.saveClient)
  .delete("/api/v2/clients/:id", clientController.deleteClient)

  .get("/api/v2/providers", providerController.getProviders)
  .get("/api/v2/providers/:id", providerController.getProvider)
  .post("/api/v2/providers", providerController.saveProvider)
  .put("/api/v2/providers/:id", providerController.updateProvider)
  .delete("/api/v2/providers/:id", providerController.deleteProvider)

  .get("/api/v2/services", serviceController.getServices)
  .get("/api/v2/services/:id", serviceController.getService)
  .post("/api/v2/services", serviceController.saveService)
  .put("/api/v2/services/:id", serviceController.updateService)
  .delete("/api/v2/services/:id", serviceController.deleteService)

  .get("/api/v2/reviews", reviewsControllers.getReviews)
  .get("/api/v2/reviews/:id", reviewsControllers.getReview)
  .post("/api/v2/reviews", reviewsControllers.saveReview)
  .post("/api/v2/reviews/documents", reviewsControllers.saveReviewDocument)
  .put("/api/v2/reviews/:id", reviewsControllers.updateReview)
  .delete("/api/v2/reviews/:id", reviewsControllers.deleteReview)

  .post("/api/v2/contracts/images", contractController.saveContractDocument)

  .use("/", authController.notFound);

module.exports = router;
