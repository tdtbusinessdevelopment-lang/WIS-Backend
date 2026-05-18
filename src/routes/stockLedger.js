/**
 * src/routes/stockLedger.js
 * Routes for the stock_ledger table.
 */
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ctrl = require("../controllers/stockLedgerController");

// All stock ledger routes require authentication
router.get("/",    authenticate, ctrl.getAllEntries);
router.get("/:id", authenticate, ctrl.getEntryById);
router.post("/",   authenticate, ctrl.createEntry);

module.exports = router;
