/**
 * src/services/averageCosting.js
 *
 * Implements the Weighted Average Cost (WAC) method used when
 * recording inventory receipts in the stock_ledger.
 *
 * Formula:
 *   new_avg_cost = (current_qty * current_avg_cost + received_qty * unit_cost)
 *                  / (current_qty + received_qty)
 *
 * This service is called by the stockLedger controller on POST requests
 * with transaction_type = 'IN' (stock received).
 */

/**
 * Calculates the new weighted average cost after a receipt.
 *
 * @param {number} currentQty       - Existing quantity on hand
 * @param {number} currentAvgCost   - Existing average unit cost
 * @param {number} receivedQty      - Quantity being added
 * @param {number} receivedUnitCost - Unit cost of the incoming stock
 * @returns {{ newAvgCost: number, newQty: number }}
 */
function computeNewAverageCost(
  currentQty,
  currentAvgCost,
  receivedQty,
  receivedUnitCost
) {
  if (receivedQty <= 0) {
    throw new Error("receivedQty must be greater than 0.");
  }

  const totalQty = currentQty + receivedQty;

  if (totalQty === 0) {
    return { newAvgCost: 0, newQty: 0 };
  }

  const totalValue =
    currentQty * currentAvgCost + receivedQty * receivedUnitCost;
  const newAvgCost = totalValue / totalQty;

  return {
    newAvgCost: parseFloat(newAvgCost.toFixed(4)), // round to 4 decimal places
    newQty: totalQty,
  };
}

/**
 * Calculates the total value of an issuance (OUT transaction).
 * Average cost does NOT change on issuance — only quantity decreases.
 *
 * @param {number} currentQty     - Existing quantity on hand
 * @param {number} currentAvgCost - Current average unit cost
 * @param {number} issuedQty      - Quantity being issued/removed
 * @returns {{ remainingQty: number, issuanceValue: number, avgCost: number }}
 */
function computeIssuance(currentQty, currentAvgCost, issuedQty) {
  if (issuedQty > currentQty) {
    throw new Error(
      `Insufficient stock: tried to issue ${issuedQty} but only ${currentQty} available.`
    );
  }

  return {
    remainingQty: currentQty - issuedQty,
    issuanceValue: parseFloat((issuedQty * currentAvgCost).toFixed(4)),
    avgCost: currentAvgCost, // unchanged on OUT
  };
}

module.exports = { computeNewAverageCost, computeIssuance };
