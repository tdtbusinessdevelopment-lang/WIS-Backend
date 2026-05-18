/**
 * src/controllers/poReceiptsController.js
 * Records physical receipts against a Purchase Order.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getByPoId(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("po_receipts")
      .select("*, sku_master(sku_code, description)")
      .eq("po_id", req.params.po_id)
      .order("received_date", { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { po_id, sku_id, location_id, received_qty, unit_cost, received_date, notes } = req.body;
    if (!po_id || !sku_id || !location_id || !received_qty || !unit_cost) {
      return res.status(400).json({ error: "po_id, sku_id, location_id, received_qty, and unit_cost are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("po_receipts")
      .insert([{ po_id, sku_id, location_id, received_qty, unit_cost, received_date, notes }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

module.exports = { getByPoId, create };
