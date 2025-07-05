export type ModelType = "basic" | "discount" | "production" | "inflation"
export type Category = "all" | "food" | "electronics" | "textiles" | "inflation"

export interface DiscountLevel {
  quantity: number
  price: number
}

export interface InflationConfig {
  monthlyInflationRate: number // as percentage (e.g., 3.65 for 3.65%)
  affectsOrderingCost: boolean // affects S
  affectsHoldingCost: boolean // affects H
  affectsPurchasePrice: boolean // affects P
  exchangeRateInitial?: number
  exchangeRateCurrent?: number
  includeExchangeRate: boolean
}

export interface ParameterConfig {
  model: ModelType
  orderCost: number
  annualDemand: number
  holdingCost: number
  unitPrice: number
  leadTime: number
  productionRate?: number
  discountLevels?: DiscountLevel[]
  inflationConfig?: InflationConfig
}

export interface InflationResults {
  currentMonth: {
    orderCost: number
    holdingCost: number
    unitPrice: number
    eoq: number
    totalCost: number
  }
  nextMonth: {
    orderCost: number
    holdingCost: number
    unitPrice: number
    eoq: number
    totalCost: number
  }
  costBreakdown: {
    orderingCostAnnual: number
    holdingCostAnnual: number
    purchaseCostAnnual: number
  }
  eoqChanged: boolean
  costIncrease: number
  costIncreasePercent: number
}

export interface SimulationResults {
  optimalQuantity: number
  totalCost: number
  reorderPoint: number
  ordersPerYear: number
  daysBetweenOrders: number
  inflationResults?: InflationResults
}
