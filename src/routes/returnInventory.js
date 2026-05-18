/**
 * src/routes/returnInventory.js
 * Routes for the return_inventory table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/returnInventoryController");

router.get("/",   authenticate, ctrl.getAll);
router.post("/",  authenticate, ctrl.create);

module.exports = router;
