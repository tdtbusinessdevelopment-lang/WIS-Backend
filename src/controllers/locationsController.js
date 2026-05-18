/**
 * src/controllers/locationsController.js
 * CRUD operations for the `locations` table.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select("*")
      .order("name");
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Location not found." });
    res.json({ data });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name is required." });
    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([{ name, description }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from("locations")
      .update({ name, description })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const { error } = await supabaseAdmin
      .from("locations")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Location deleted." });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
