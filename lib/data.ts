import type { ParameterConfig, Example } from "./types"

export const defaultParameters: ParameterConfig = {
  model: "basic",
  orderCost: 100,
  annualDemand: 1000,
  holdingCost: 10,
  unitPrice: 50,
  leadTime: 7,
  productionRate: 2000,
  discountLevels: [
    { quantity: 100, price: 48 },
    { quantity: 500, price: 45 },
  ],
}

export const examples: Example[] = [
  {
    name: "Café Premium",
    description: "Café de especialidad para una cadena de cafeterías con demanda constante durante todo el año.",
    category: "food",
    parameters: {
      model: "basic",
      orderCost: 150,
      annualDemand: 5000,
      holdingCost: 15,
      unitPrice: 25,
      leadTime: 14,
    },
    insights:
      "El café es un producto con demanda estable pero con costos de almacenamiento significativos debido a la necesidad de mantener la frescura.",
  },
  {
    name: "Smartphones",
    description: "Teléfonos inteligentes de gama alta con descuentos por volumen de compra.",
    category: "electronics",
    parameters: {
      model: "discount",
      orderCost: 500,
      annualDemand: 2000,
      holdingCost: 100,
      unitPrice: 600,
      leadTime: 21,
      discountLevels: [
        { quantity: 100, price: 580 },
        { quantity: 500, price: 550 },
        { quantity: 1000, price: 520 },
      ],
    },
    insights:
      "Los smartphones tienen un alto valor unitario, lo que aumenta el costo de mantener inventario, pero los descuentos por volumen pueden compensar este costo.",
  },
  {
    name: "Camisetas",
    description: "Producción interna de camisetas para una marca de moda con capacidad de producción limitada.",
    category: "textiles",
    parameters: {
      model: "production",
      orderCost: 200,
      annualDemand: 10000,
      holdingCost: 5,
      unitPrice: 15,
      leadTime: 5,
      productionRate: 25000,
    },
    insights:
      "La producción interna permite mayor flexibilidad, pero requiere una planificación cuidadosa para equilibrar la capacidad de producción con la demanda.",
  },
  {
    name: "Libros Bestseller",
    description: "Libros de alta rotación para una cadena de librerías con demanda predecible.",
    category: "textiles",
    parameters: {
      model: "basic",
      orderCost: 120,
      annualDemand: 8000,
      holdingCost: 8,
      unitPrice: 18,
      leadTime: 10,
    },
    insights:
      "Los libros bestseller tienen una demanda predecible pero ocupan espacio valioso en las estanterías, lo que aumenta el costo de mantener inventario.",
  },
  {
    name: "Ingredientes para Pizza",
    description:
      "Ingredientes para una cadena de pizzerías con descuentos por volumen y espacio de almacenamiento limitado.",
    category: "food",
    parameters: {
      model: "discount",
      orderCost: 80,
      annualDemand: 15000,
      holdingCost: 12,
      unitPrice: 8,
      leadTime: 3,
      discountLevels: [
        { quantity: 500, price: 7.5 },
        { quantity: 2000, price: 7 },
      ],
    },
    insights:
      "Los ingredientes para pizza son perecederos, lo que aumenta el costo de mantener inventario, pero los descuentos por volumen pueden ser significativos.",
  },
  {
    name: "Bolsas Ecológicas",
    description: "Producción de bolsas reutilizables para una cadena de supermercados con alta demanda estacional.",
    category: "textiles",
    parameters: {
      model: "production",
      orderCost: 300,
      annualDemand: 50000,
      holdingCost: 2,
      unitPrice: 3,
      leadTime: 7,
      productionRate: 100000,
    },
    insights:
      "Las bolsas ecológicas tienen una demanda creciente y costos de producción relativamente bajos, lo que permite lotes de producción más grandes.",
  },
  // Add inflation examples
  {
    name: "Problema 1: Quintales con Inflación",
    description: "Análisis de EOQ considerando inflación mensual del 3.65% que afecta todos los costos.",
    category: "inflation",
    parameters: {
      model: "inflation",
      orderCost: 20, // Bs. 20
      annualDemand: 2400, // 200 quintales/mes × 12 meses
      holdingCost: 24, // Bs. 2 por unidad/mes × 12 meses = Bs. 24 por año
      unitPrice: 600, // Bs. 600 por quintal
      leadTime: 7,
      inflationConfig: {
        monthlyInflationRate: 3.65,
        affectsOrderingCost: true,
        affectsHoldingCost: true,
        affectsPurchasePrice: true,
        includeExchangeRate: false,
      },
    },
    insights:
      "Este ejemplo muestra cómo la inflación afecta todos los componentes del costo. Aunque los costos aumentan, el EOQ puede mantenerse estable debido al equilibrio entre costos de pedido y almacenamiento.",
  },
  {
    name: "Problema 2: Devaluación + Inflación",
    description: "EOQ con devaluación del tipo de cambio (6.96 → 16.50) e inflación mensual del 3.65%.",
    category: "inflation",
    parameters: {
      model: "inflation",
      orderCost: 50, // USD 50
      annualDemand: 600, // 600 unidades anuales
      holdingCost: 60, // USD 5 por unidad/mes × 12 meses = USD 60 por año
      unitPrice: 50, // USD 50 por unidad
      leadTime: 7,
      inflationConfig: {
        monthlyInflationRate: 3.65,
        affectsOrderingCost: true,
        affectsHoldingCost: true,
        affectsPurchasePrice: true,
        exchangeRateInitial: 6.96,
        exchangeRateCurrent: 16.5,
        includeExchangeRate: true,
      },
    },
    insights:
      "Combina el impacto de la devaluación (tipo de cambio) con la inflación. La devaluación afecta inmediatamente todos los costos, mientras que la inflación los incrementa mensualmente.",
  },
]
