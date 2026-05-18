/**
 * src/controllers/advanceCustomerPoController.js
 * Manages advance customer purchase orders (pre-orders).
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { customer, status } = req.query;
    let query = supabaseAdmin
      .from("advance_customer_po")
      .select("*")
      .order("created_at", { ascending: false });
    if (customer) query = query.ilike("customer_name", `%${customer}%`);
    if (status)   query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { customer_name, sku_id, quantity, unit_price, order_date, notes } = req.body;
    if (!customer_name || !sku_id || !quantity) {
      return res.status(400).json({ error: "customer_name, sku_id, and quantity are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("advance_customer_po")
      .insert([{ customer_name, sku_id, quantity, unit_price, order_date, notes, status: "PENDING" }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const allowed = ["status", "notes", "unit_price", "quantity"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    const { data, error } = await supabaseAdmin
      .from("advance_customer_po")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update };
