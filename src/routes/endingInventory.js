/**
 * src/routes/endingInventory.js
 * Routes for the ending_inventory table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/endingInventoryController");

router.get("/",    authenticate, ctrl.getAll);
router.post("/",   authenticate, ctrl.upsert); // creates or updates by (period, sku_id, location_id)

module.exports = router;
