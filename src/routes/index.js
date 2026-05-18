/**
 * src/routes/index.js
 *
 * Central route aggregator — mounts all resource routers under /api.
 * Add new routes here to keep app.js clean.
 */

const express = require("express");
const router = express.Router();

router.use("/stock-ledger",       require("./stockLedger"));
router.use("/locations",          require("./locations"));
router.use("/sku-master",         require("./skuMaster"));
router.use("/purchase-orders",    require("./purchaseOrders"));
router.use("/ending-inventory",   require("./endingInventory"));
router.use("/advance-customer-po",require("./advanceCustomerPo"));
router.use("/backload-inventory", require("./backloadInventory"));
router.use("/backload-deliveries",require("./backloadDeliveries"));
router.use("/return-inventory",   require("./returnInventory"));

module.exports = router;
