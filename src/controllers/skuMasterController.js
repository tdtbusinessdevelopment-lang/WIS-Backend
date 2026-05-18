/**
 * src/controllers/skuMasterController.js
 * CRUD operations for the `sku_master` table.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    let query = supabaseAdmin
      .from("sku_master")
      .select("*")
      .order("sku_code")
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (search) {
      query = query.or(`sku_code.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("sku_master")
      .select("*")
      .eq("sku_code", req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "SKU not found." });
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { sku_code, description, unit, category } = req.body;
    if (!sku_code || !description) {
      return res.status(400).json({ error: "sku_code and description are required." });
    }
    const { data, error } = await supabaseAdmin
      .from("sku_master")
      .insert([{ sku_code, description, unit, category }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { sku_code, description, unit, category } = req.body;
    const { data, error } = await supabaseAdmin
      .from("sku_master")
      .update({ sku_code, description, unit, category })
      .eq("sku_code", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { error } = await supabaseAdmin
      .from("sku_master")
      .delete()
      .eq("sku_code", req.params.id);
    if (error) throw error;
    res.json({ message: "SKU deleted." });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
