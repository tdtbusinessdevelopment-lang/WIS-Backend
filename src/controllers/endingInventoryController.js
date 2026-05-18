/**
 * src/controllers/endingInventoryController.js
 * Read/write snapshot of ending inventory per period.
 */
const { supabaseAdmin } = require("../config/supabase");

async function getAll(req, res, next) {
  try {
    const { period, sku_id, location_id } = req.query;
    let query = supabaseAdmin
      .from("ending_inventory")
      .select("*, sku_master(sku_code, description), locations(name)")
      .order("period", { ascending: false });

    if (period)      query = query.eq("period", period);
    if (sku_id)      query = query.eq("sku_id", sku_id);
    if (location_id) query = query.eq("location_id", location_id);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { next(err); }
}

async function upsert(req, res, next) {
  try {
    const { period, sku_id, location_id, quantity, avg_cost } = req.body;
    if (!period || !sku_id || !location_id) {
      return res.status(400).json({ error: "period, sku_id, location_id are required." });
    }
    const total_value = Number(quantity) * Number(avg_cost);
    const { data, error } = await supabaseAdmin
      .from("ending_inventory")
      .upsert([{ period, sku_id, location_id, quantity, avg_cost, total_value }], {
        onConflict: "period,sku_id,location_id",
      })
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ data });
  } catch (err) { next(err); }
}

module.exports = { getAll, upsert };
