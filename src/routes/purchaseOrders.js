/**
 * src/routes/purchaseOrders.js
 * Routes for purchase_orders and nested po_receipts.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const poCtrl = require("../controllers/purchaseOrdersController");
const receiptCtrl = require("../controllers/poReceiptsController");

// PO routes
router.get("/",      authenticate, poCtrl.getAll);
router.get("/:id",   authenticate, poCtrl.getById);
router.post("/",     authenticate, poCtrl.create);
router.put("/:id",   authenticate, poCtrl.update);

// Nested: receipts for a specific PO
router.get("/:po_id/receipts",  authenticate, receiptCtrl.getByPoId);
router.post("/:po_id/receipts", authenticate, receiptCtrl.create);

module.exports = router;
