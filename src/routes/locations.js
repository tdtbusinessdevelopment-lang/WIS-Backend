/**
 * src/routes/locations.js
 * Routes for the locations table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/locationsController");

router.get("/",       authenticate, ctrl.getAll);
router.get("/:id",    authenticate, ctrl.getById);
router.post("/",      authenticate, ctrl.create);
router.put("/:id",    authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

module.exports = router;
