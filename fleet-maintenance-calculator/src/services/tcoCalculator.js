export function calculateScenarioRows({
  decoded,
  exploitation,
  plannedKm,
  contractMonths,
  flexInterval,
  laborDiscount,
  partsDiscount,
  oilDiscount,
}) {
  if (!decoded.supported) return [];

  const annualKm = contractMonths > 0 ? (plannedKm / contractMonths) * 12 : 0;
  const baseFactor = exploitation.totalFactor;
  const discountFactor =
    1 - (laborDiscount * 0.25 + partsDiscount * 0.45 + oilDiscount * 0.3) / 100;

  const baseCost =
    plannedKm * 1.55 * baseFactor * discountFactor +
    (decoded.drivetrain === "AWD" ? 65000 : 0) +
    (decoded.fuelType === "Diesel" ? 35000 : 25000) +
    annualKm * 0.12;

  return [
    {
      label: "Optimistični",
      flex: Math.min(30000, flexInterval + 5000),
      brakeFactor: exploitation.brakeFactor * 0.9,
      total: baseCost * 0.93,
    },
    {
      label: "Očekivani",
      flex: flexInterval,
      brakeFactor: exploitation.brakeFactor,
      total: baseCost,
    },
    {
      label: "Konzervativni",
      flex: Math.max(15000, flexInterval - 5000),
      brakeFactor: exploitation.brakeFactor * 1.12,
      total: baseCost * 1.11,
    },
  ];
}

export function calculateSummary({ scenarioRows, plannedKm, contractMonths }) {
  const totalSale = scenarioRows[1]?.total || 0;
  const costPerKm = plannedKm ? totalSale / plannedKm : 0;
  const costPerMonth = contractMonths ? totalSale / contractMonths : 0;
  const totalService = totalSale * 0.68;
  const totalBrakes = totalSale * 0.32;

  return {
    totalSale,
    costPerKm,
    costPerMonth,
    totalService,
    totalBrakes,
  };
}