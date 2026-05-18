/**
 * src/controllers/purchaseOrdersController.js
 * CRUD + status management for the `purchase_orders` table.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { status, supplier, from, to } = req.query;
    let query = supabaseAdmin
      .from("purchase_orders")
      .select("*")
      .order("order_date", { ascending: false });

    if (status)   query = query.eq("status", status);
    if (supplier) query = query.ilike("supplier_name", `%${supplier}%`);
    if (from)     query = query.gte("order_date", from);
    if (to)       query = query.lte("order_date", to);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .select("*, po_receipts(*)")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "PO not found." });
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { po_number, supplier_name, order_date, expected_date, notes } = req.body;
    if (!po_number || !supplier_name) {
      return res.status(400).json({ error: "po_number and supplier_name are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .insert([{ po_number, supplier_name, order_date, expected_date, notes, status: "OPEN" }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const allowed = ["supplier_name", "order_date", "expected_date", "status", "notes"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );
    const { data, error } = await supabaseAdmin
      .from("purchase_orders")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update };
