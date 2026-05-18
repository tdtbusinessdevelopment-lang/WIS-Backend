/**
 * src/routes/advanceCustomerPo.js
 * Routes for the advance_customer_po table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/advanceCustomerPoController");

router.get("/",      authenticate, ctrl.getAll);
router.post("/",     authenticate, ctrl.create);
router.put("/:id",   authenticate, ctrl.update);

module.exports = router;
