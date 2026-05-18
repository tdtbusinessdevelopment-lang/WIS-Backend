/**
 * src/controllers/stockLedgerController.js
 *
 * Handles business logic for the stock_ledger table.
 *
 * Endpoints:
 *   GET  /api/stock-ledger          → list entries (filterable by sku_id, location_id, date)
 *   GET  /api/stock-ledger/:id      → single entry by ID
 *   POST /api/stock-ledger          → create a new ledger entry (IN or OUT)
 *                                     applies average costing automatically
 *
 * Expected stock_ledger columns:
 *   id, sku_id, location_id, transaction_type ('IN'|'OUT'|'ADJUST'),
 *   quantity, unit_cost, avg_cost, total_value, reference_no,
 *   transaction_date, notes, created_at
 */

const { supabaseAdmin } = require("../config/supabase");
const {
  computeNewAverageCost,
  computeIssuance,
} = require("../services/averageCosting");

// ─── GET all stock ledger entries ────────────────────────────────────────────
async function getAllEntries(req, res, next) {
  try {
    const { sku_id, location_id, from, to, limit = 100, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("stock_ledger")
      .select("*, sku_master(sku_code, description), locations(name)")
      .order("transaction_date", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (sku_id)      query = query.eq("sku_id", sku_id);
    if (location_id) query = query.eq("location_id", location_id);
    if (from)        query = query.gte("transaction_date", from);
    if (to)          query = query.lte("transaction_date", to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data, count });
  } catch (err) {
    next(err);
  }
}

// ─── GET single stock ledger entry ───────────────────────────────────────────
async function getEntryById(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("stock_ledger")
      .select("*, sku_master(sku_code, description), locations(name)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Entry not found." });

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

// ─── POST create a new stock ledger entry ────────────────────────────────────
async function createEntry(req, res, next) {
  try {
    const {
      sku_id,
      location_id,
      transaction_type, // 'IN' | 'OUT' | 'ADJUST'
      quantity,
      unit_cost,        // required for 'IN'; ignored for 'OUT' (uses avg_cost)
      reference_no,
      transaction_date,
      notes,
    } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!sku_id || !location_id || !transaction_type || !quantity) {
      return res.status(400).json({
        error: "sku_id, location_id, transaction_type, and quantity are required.",
      });
    }

    if (!["IN", "OUT", "ADJUST"].includes(transaction_type)) {
      return res.status(400).json({
        error: "transaction_type must be 'IN', 'OUT', or 'ADJUST'.",
      });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "quantity must be a positive number." });
    }

    // ── Fetch current running balance for this SKU + location ────────────────
    // We look at the latest ledger row to get current qty and avg_cost
    const { data: latest, error: fetchErr } = await supabaseAdmin
      .from("stock_ledger")
      .select("quantity, avg_cost")
      .eq("sku_id", sku_id)
      .eq("location_id", location_id)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    const currentQty     = latest ? Number(latest.quantity)  : 0;
    const currentAvgCost = latest ? Number(latest.avg_cost)   : 0;

    // ── Apply costing logic ───────────────────────────────────────────────────
    let newAvgCost, newQty, totalValue;

    if (transaction_type === "IN") {
      if (unit_cost === undefined || unit_cost === null) {
        return res.status(400).json({ error: "unit_cost is required for IN transactions." });
      }
      const cost = Number(unit_cost);
      const result = computeNewAverageCost(currentQty, currentAvgCost, qty, cost);
      newAvgCost  = result.newAvgCost;
      newQty      = result.newQty;
      totalValue  = parseFloat((qty * cost).toFixed(4));

    } else if (transaction_type === "OUT") {
      const result = computeIssuance(currentQty, currentAvgCost, qty);
      newAvgCost  = result.avgCost;
      newQty      = result.remainingQty;
      totalValue  = result.issuanceValue;

    } else {
      // ADJUST — direct override, no cost calculation
      newAvgCost = currentAvgCost;
      newQty     = qty; // treat as absolute new qty
      totalValue = parseFloat((qty * currentAvgCost).toFixed(4));
    }

    // ── Insert ledger row ─────────────────────────────────────────────────────
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("stock_ledger")
      .insert([
        {
          sku_id,
          location_id,
          transaction_type,
          quantity:         qty,
          unit_cost:        unit_cost ? Number(unit_cost) : currentAvgCost,
          avg_cost:         newAvgCost,
          total_value:      totalValue,
          reference_no:     reference_no || null,
          transaction_date: transaction_date || new Date().toISOString(),
          notes:            notes || null,
        },
      ])
      .select()
      .single();

    if (insertErr) throw insertErr;

    res.status(201).json({
      message: "Stock ledger entry created.",
      data: inserted,
      summary: {
        previous_qty:      currentQty,
        previous_avg_cost: currentAvgCost,
        new_qty:           newQty,
        new_avg_cost:      newAvgCost,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllEntries, getEntryById, createEntry };
