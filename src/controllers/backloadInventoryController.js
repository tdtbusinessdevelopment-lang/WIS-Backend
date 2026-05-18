/**
 * src/controllers/backloadInventoryController.js
 * Tracks inventory held in transit / backload.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("backload_inventory")
      .select("*, sku_master(sku_code, description)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { sku_id, quantity, unit_cost, backload_date, reference_no, notes } = req.body;
    if (!sku_id || !quantity) {
      return res.status(400).json({ error: "sku_id and quantity are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("backload_inventory")
      .insert([{ sku_id, quantity, unit_cost, backload_date, reference_no, notes }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, create };
