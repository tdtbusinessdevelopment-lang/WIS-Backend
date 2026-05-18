/**
 * src/controllers/backloadDeliveriesController.js
 * Records actual deliveries made from backload inventory.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { from, to } = req.query;
    let query = supabaseAdmin
      .from("backload_deliveries")
      .select("*, backload_inventory(sku_id, sku_master(sku_code, description))")
      .order("delivery_date", { ascending: false });
    if (from) query = query.gte("delivery_date", from);
    if (to)   query = query.lte("delivery_date", to);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { backload_id, delivered_qty, delivery_date, recipient, notes } = req.body;
    if (!backload_id || !delivered_qty) {
      return res.status(400).json({ error: "backload_id and delivered_qty are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("backload_deliveries")
      .insert([{ backload_id, delivered_qty, delivery_date, recipient, notes }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, create };
