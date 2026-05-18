/**
 * src/routes/backloadInventory.js
 * Routes for the backload_inventory table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/backloadInventoryController");

router.get("/",   authenticate, ctrl.getAll);
router.post("/",  authenticate, ctrl.create);

module.exports = router;
