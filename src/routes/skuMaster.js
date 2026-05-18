/**
 * src/routes/skuMaster.js
 * Routes for the sku_master table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/skuMasterController");

router.get("/",       authenticate, ctrl.getAll);
router.get("/:id",    authenticate, ctrl.getById);
router.post("/",      authenticate, ctrl.create);
router.put("/:id",    authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

module.exports = router;
