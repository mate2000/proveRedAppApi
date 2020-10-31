const { request, response } = require("express");
const express = require("express");
const userController = require("../controllers/users.controllers");
const providerController = require("../controllers/providers.controllers");
const router = express.Router();

router.get("/api/v2", (request, response) => {
  response.send("Api red app");
});

router
  .get("/users", userController.getUsers)
  .get("/users/:id", userController.getUser)
  .post("/api/v2/users", userController.saveUser)
  .put("/api/v2/users/:id", userController.updateUser)
  .delete("/api/v2/users/:id", userController.deleteUser);

router
  .get("/api/v2/providers", providerController.getProviders)
  .get("/api/v2/providers/:id", providerController.getProvider)
  .post("/api/v2/providers", providerController.saveProvider)
  .put("/api/v2/providers/:id", providerController.updateProvider)
  .delete("/api/v2/providers/:id", providerController.deleteProvider);

module.exports = router;
