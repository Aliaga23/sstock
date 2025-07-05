import type { ParameterConfig, SimulationResults, InflationResults } from "./types"

function calculateInflationResults(parameters: ParameterConfig): InflationResults | undefined {
  if (!parameters.inflationConfig) return undefined

  const config = parameters.inflationConfig
  const monthlyRate = config.monthlyInflationRate / 100

  let currentOrderCost = parameters.orderCost
  let currentHoldingCost = parameters.holdingCost
  let currentUnitPrice = parameters.unitPrice

  if (config.includeExchangeRate && config.exchangeRateInitial && config.exchangeRateCurrent) {
    const exchangeMultiplier = config.exchangeRateCurrent / config.exchangeRateInitial
    currentOrderCost *= exchangeMultiplier
    currentHoldingCost *= exchangeMultiplier
    currentUnitPrice *= exchangeMultiplier
  }

  const currentEOQ = Math.sqrt((2 * parameters.annualDemand * currentOrderCost) / currentHoldingCost)

  const currentTotalCost =
    (currentOrderCost * parameters.annualDemand) / currentEOQ + // KD/Q
    currentUnitPrice * parameters.annualDemand + // pD
    (currentHoldingCost * currentEOQ) / 2 // hQ/2

  let nextOrderCost = currentOrderCost
  let nextHoldingCost = currentHoldingCost
  let nextUnitPrice = currentUnitPrice

  if (config.affectsOrderingCost) {
    nextOrderCost = currentOrderCost * (1 + monthlyRate)
  }
  if (config.affectsHoldingCost) {
    nextHoldingCost = currentHoldingCost * (1 + monthlyRate)
  }
  if (config.affectsPurchasePrice) {
    nextUnitPrice = currentUnitPrice * (1 + monthlyRate)
  }

  // Calculate next month EOQ
  const nextEOQ = Math.sqrt((2 * parameters.annualDemand * nextOrderCost) / nextHoldingCost)

  // Calculate next month total cost
  const nextTotalCost =
    (nextOrderCost * parameters.annualDemand) / nextEOQ + // KD/Q
    nextUnitPrice * parameters.annualDemand + // pD
    (nextHoldingCost * nextEOQ) / 2 // hQ/2

  // Cost breakdown for current month
  const orderingCostAnnual = (currentOrderCost * parameters.annualDemand) / currentEOQ
  const holdingCostAnnual = (currentHoldingCost * currentEOQ) / 2
  const purchaseCostAnnual = currentUnitPrice * parameters.annualDemand

  return {
    currentMonth: {
      orderCost: currentOrderCost,
      holdingCost: currentHoldingCost,
      unitPrice: currentUnitPrice,
      eoq: currentEOQ,
      totalCost: currentTotalCost,
    },
    nextMonth: {
      orderCost: nextOrderCost,
      holdingCost: nextHoldingCost,
      unitPrice: nextUnitPrice,
      eoq: nextEOQ,
      totalCost: nextTotalCost,
    },
    costBreakdown: {
      orderingCostAnnual,
      holdingCostAnnual,
      purchaseCostAnnual,
    },
    eoqChanged: Math.abs(currentEOQ - nextEOQ) > 0.01,
    costIncrease: nextTotalCost - currentTotalCost,
    costIncreasePercent: ((nextTotalCost - currentTotalCost) / currentTotalCost) * 100,
  }
}

export function calculateResults(parameters: ParameterConfig): SimulationResults {
  let optimalQuantity: number
  let totalCost: number

  // Handle inflation model
  if (parameters.model === "inflation") {
    const inflationResults = calculateInflationResults(parameters)
    if (inflationResults) {
      optimalQuantity = inflationResults.currentMonth.eoq
      totalCost = inflationResults.currentMonth.totalCost

      // Calculate additional results
      const ordersPerYear = parameters.annualDemand / optimalQuantity
      const daysBetweenOrders = 365 / ordersPerYear
      const dailyDemand = parameters.annualDemand / 365
      const reorderPoint = dailyDemand * parameters.leadTime

      return {
        optimalQuantity,
        totalCost,
        reorderPoint,
        ordersPerYear,
        daysBetweenOrders,
        inflationResults,
      }
    }
  }

  switch (parameters.model) {
    case "basic":
      // EOQ Formula: Q* = sqrt(2 * D * K / H)
      optimalQuantity = Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost)

      // Total Cost: TC = (D * P) + (D / Q * K) + (Q / 2 * H)
      totalCost =
        parameters.annualDemand * parameters.unitPrice +
        (parameters.annualDemand / optimalQuantity) * parameters.orderCost +
        (optimalQuantity / 2) * parameters.holdingCost
      break

    case "production":
      // EPQ Formula: Q* = sqrt(2 * D * K / H * (1 - D/R))
      if (!parameters.productionRate || parameters.productionRate <= parameters.annualDemand) {
        // Fallback to EOQ if production rate is invalid
        optimalQuantity = Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost)
      } else {
        optimalQuantity = Math.sqrt(
          (2 * parameters.annualDemand * parameters.orderCost) /
            (parameters.holdingCost * (1 - parameters.annualDemand / parameters.productionRate)),
        )
      }

      // Total Cost for EPQ
      totalCost =
        parameters.annualDemand * parameters.unitPrice +
        (parameters.annualDemand / optimalQuantity) * parameters.orderCost +
        (optimalQuantity / 2) *
          parameters.holdingCost *
          (1 - parameters.annualDemand / (parameters.productionRate || Number.POSITIVE_INFINITY))
      break

    case "discount":
      // For discount model, we need to calculate EOQ for each price level
      // and then find the one with the lowest total cost

      // First, calculate the standard EOQ
      const standardEOQ = Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost)

      // Initialize with the base price
      optimalQuantity = standardEOQ
      totalCost =
        parameters.annualDemand * parameters.unitPrice +
        (parameters.annualDemand / optimalQuantity) * parameters.orderCost +
        (optimalQuantity / 2) * parameters.holdingCost

      // Check each discount level
      if (parameters.discountLevels && parameters.discountLevels.length > 0) {
        for (const level of parameters.discountLevels) {
          // Calculate EOQ for this price level
          const levelEOQ = Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost)

          // If EOQ is less than the minimum quantity for this level,
          // we need to use the minimum quantity instead
          const adjustedQ = Math.max(levelEOQ, level.quantity)

          // Calculate total cost for this quantity and price
          const levelCost =
            parameters.annualDemand * level.price +
            (parameters.annualDemand / adjustedQ) * parameters.orderCost +
            (adjustedQ / 2) * parameters.holdingCost

          // If this level has a lower total cost, update our optimal values
          if (levelCost < totalCost) {
            optimalQuantity = adjustedQ
            totalCost = levelCost
          }
        }
      }
      break

    default:
      // Default to EOQ
      optimalQuantity = Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost)
      totalCost =
        parameters.annualDemand * parameters.unitPrice +
        (parameters.annualDemand / optimalQuantity) * parameters.orderCost +
        (optimalQuantity / 2) * parameters.holdingCost
  }

  // Calculate additional results
  const ordersPerYear = parameters.annualDemand / optimalQuantity
  const daysBetweenOrders = 365 / ordersPerYear
  const dailyDemand = parameters.annualDemand / 365
  const reorderPoint = dailyDemand * parameters.leadTime

  return {
    optimalQuantity,
    totalCost,
    reorderPoint,
    ordersPerYear,
    daysBetweenOrders,
  }
}
