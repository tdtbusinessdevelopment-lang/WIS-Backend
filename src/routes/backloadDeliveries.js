/**
 * src/routes/backloadDeliveries.js
 * Routes for the backload_deliveries table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/backloadDeliveriesController");

router.get("/",   authenticate, ctrl.getAll);
router.post("/",  authenticate, ctrl.create);

module.exports = router;
