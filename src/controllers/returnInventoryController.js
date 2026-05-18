/**
 * src/controllers/returnInventoryController.js
 * Manages returned items from customers or to suppliers.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { return_type } = req.query; // 'CUSTOMER_RETURN' | 'SUPPLIER_RETURN'
    let query = supabaseAdmin
      .from("return_inventory")
      .select("*, sku_master(sku_code, description), locations(name)")
      .order("return_date", { ascending: false });
    if (return_type) query = query.eq("return_type", return_type);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { sku_id, location_id, return_type, quantity, unit_cost, return_date, reference_no, notes } = req.body;
    if (!sku_id || !return_type || !quantity) {
      return res.status(400).json({ error: "sku_id, return_type, and quantity are required." });
    }
    if (!["CUSTOMER_RETURN", "SUPPLIER_RETURN"].includes(return_type)) {
      return res.status(400).json({ error: "return_type must be CUSTOMER_RETURN or SUPPLIER_RETURN." });
    }
    const { data, error } = await supabaseAdmin
      .from("return_inventory")
      .insert([{ sku_id, location_id, return_type, quantity, unit_cost, return_date, reference_no, notes }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, create };
