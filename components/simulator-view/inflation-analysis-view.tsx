"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, AlertTriangle, Calculator, DollarSign } from "lucide-react"
import type { ParameterConfig, SimulationResults } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import ClientOnly from "@/components/client-only"

interface InflationAnalysisViewProps {
  results: SimulationResults
  parameters: ParameterConfig
}

export default function InflationAnalysisView({ results, parameters }: InflationAnalysisViewProps) {
  if (!results.inflationResults || !parameters.inflationConfig) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No hay datos de inflación disponibles</p>
      </div>
    )
  }

  const inflationData = results.inflationResults
  const config = parameters.inflationConfig

  // Formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(Math.round(num))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Datos para gráfico de comparación mes actual vs próximo mes
  const comparisonData = [
    {
      period: "Mes Actual",
      orderCost: inflationData.currentMonth.orderCost,
      holdingCost: inflationData.currentMonth.holdingCost,
      unitPrice: inflationData.currentMonth.unitPrice,
      totalCost: inflationData.currentMonth.totalCost,
      eoq: inflationData.currentMonth.eoq,
    },
    {
      period: "Próximo Mes",
      orderCost: inflationData.nextMonth.orderCost,
      holdingCost: inflationData.nextMonth.holdingCost,
      unitPrice: inflationData.nextMonth.unitPrice,
      totalCost: inflationData.nextMonth.totalCost,
      eoq: inflationData.nextMonth.eoq,
    },
  ]

  // Datos para desglose de costos usando la fórmula TC(Q) = KD/Q + pD + hQ/2
  const costBreakdownData = [
    {
      component: "Costo de Pedidos\n(KD/Q)",
      value: inflationData.costBreakdown.orderingCostAnnual,
      description: "Costo anual de hacer pedidos",
      color: "#1a4d8c",
      formula: "K × D ÷ Q",
    },
    {
      component: "Costo de Compra\n(pD)",
      value: inflationData.costBreakdown.purchaseCostAnnual,
      description: "Costo anual de comprar productos",
      color: "#2e86de",
      formula: "p × D",
    },
    {
      component: "Costo de Almacén\n(hQ/2)",
      value: inflationData.costBreakdown.holdingCostAnnual,
      description: "Costo anual de mantener inventario",
      color: "#00cec9",
      formula: "h × Q ÷ 2",
    },
  ]

  // Datos para proyección de varios meses
  const projectionData = []
  let currentOrderCost = parameters.orderCost
  let currentHoldingCost = parameters.holdingCost
  let currentUnitPrice = parameters.unitPrice

  // Aplicar tipo de cambio inicial si corresponde
  if (config.includeExchangeRate && config.exchangeRateInitial && config.exchangeRateCurrent) {
    const exchangeMultiplier = config.exchangeRateCurrent / config.exchangeRateInitial
    currentOrderCost *= exchangeMultiplier
    currentHoldingCost *= exchangeMultiplier
    currentUnitPrice *= exchangeMultiplier
  }

  for (let month = 0; month <= 12; month++) {
    const monthlyRate = config.monthlyInflationRate / 100

    // Aplicar inflación acumulada
    let adjustedOrderCost = currentOrderCost
    let adjustedHoldingCost = currentHoldingCost
    let adjustedUnitPrice = currentUnitPrice

    if (config.affectsOrderingCost) {
      adjustedOrderCost = currentOrderCost * Math.pow(1 + monthlyRate, month)
    }
    if (config.affectsHoldingCost) {
      adjustedHoldingCost = currentHoldingCost * Math.pow(1 + monthlyRate, month)
    }
    if (config.affectsPurchasePrice) {
      adjustedUnitPrice = currentUnitPrice * Math.pow(1 + monthlyRate, month)
    }

    const eoq = Math.sqrt((2 * parameters.annualDemand * adjustedOrderCost) / adjustedHoldingCost)
    const totalCost =
      (adjustedOrderCost * parameters.annualDemand) / eoq + // KD/Q
      adjustedUnitPrice * parameters.annualDemand + // pD
      (adjustedHoldingCost * eoq) / 2 // hQ/2

    projectionData.push({
      month: month,
      monthLabel: month === 0 ? "Actual" : `Mes ${month}`,
      eoq: eoq,
      totalCost: totalCost,
      orderCost: adjustedOrderCost,
      holdingCost: adjustedHoldingCost,
      unitPrice: adjustedUnitPrice,
    })
  }

  const COLORS = ["#1a4d8c", "#2e86de", "#00cec9", "#6c5ce7", "#00b894"]

  return (
    <div className="space-y-6">
      {/* Fórmula clásica destacada */}
      <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-primary flex items-center justify-center gap-2">
            <Calculator className="h-5 w-5" />
            Fórmula Clásica del Costo Total (EOQ)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-inner border-2 border-primary/20">
            <div className="text-2xl font-mono font-bold text-primary mb-2">TC(Q) = KD/Q + pD + hQ/2</div>
            <div className="grid md:grid-cols-3 gap-4 text-sm mt-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-800">KD/Q</div>
                <div className="text-blue-600">Costo de Pedidos</div>
                <div className="text-xs text-blue-500">K = costo por pedido, D = demanda anual</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-800">pD</div>
                <div className="text-green-600">Costo de Compra</div>
                <div className="text-xs text-green-500">p = precio unitario, D = demanda anual</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-purple-800">hQ/2</div>
                <div className="text-purple-600">Costo de Almacén</div>
                <div className="text-xs text-purple-500">h = costo almacén, Q = cantidad pedido</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-blue-50 px-4 py-2 border-b">
            <div className="text-xs font-medium text-blue-800">EOQ Actual</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatNumber(inflationData.currentMonth.eoq)}</div>
            <div className="text-xs text-muted-foreground mt-1">unidades</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-green-50 px-4 py-2 border-b">
            <div className="text-xs font-medium text-green-800">EOQ Próximo Mes</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatNumber(inflationData.nextMonth.eoq)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {inflationData.eoqChanged ? (
                <Badge variant="destructive" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Cambió
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Sin cambio
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-red-50 px-4 py-2 border-b">
            <div className="text-xs font-medium text-red-800">Aumento de Costo</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(inflationData.costIncrease)}</div>
            <div className="text-xs text-muted-foreground mt-1">+{inflationData.costIncreasePercent.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-yellow-50 px-4 py-2 border-b">
            <div className="text-xs font-medium text-yellow-800">Inflación Mensual</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{config.monthlyInflationRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">por mes</div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis detallado */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Comparación mes actual vs próximo */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Comparación: Actual vs Próximo Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ClientOnly fallback={<div className="flex items-center justify-center h-full">Cargando...</div>}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name === "totalCost" ? "Costo Total" : name,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.95)",
                        borderRadius: "6px",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    />
                    <Bar dataKey="totalCost" name="Costo Total" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        {/* Desglose de costos según fórmula */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Desglose según TC(Q) = KD/Q + pD + hQ/2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ClientOnly fallback={<div className="flex items-center justify-center h-full">Cargando...</div>}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ component, value }) => {
                        const total = costBreakdownData.reduce((sum, item) => sum + item.value, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${percentage}%`
                      }}
                      paddingAngle={2}
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [formatCurrency(Number(value)), props.payload.description]}
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.95)",
                        borderRadius: "6px",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: "#ffffff", fontSize: "11px" }}>
                          {typeof value === "string" ? value.replace(/\n/g, " ") : value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proyección a 12 meses */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Proyección de EOQ y Costos (12 meses)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cómo evolucionan el EOQ y los costos con inflación del {config.monthlyInflationRate}% mensual
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ClientOnly fallback={<div className="flex items-center justify-center h-full">Cargando...</div>}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis
                    yAxisId="cost"
                    orientation="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="eoq"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "eoq") {
                        return [formatNumber(Number(value)), "EOQ (unidades)"]
                      }
                      return [formatCurrency(Number(value)), "Costo Total"]
                    }}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(30, 41, 59, 0.95)",
                      borderRadius: "6px",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="cost"
                    type="monotone"
                    dataKey="totalCost"
                    name="Costo Total"
                    fill={COLORS[0]}
                    fillOpacity={0.3}
                    stroke={COLORS[0]}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="eoq"
                    type="monotone"
                    dataKey="eoq"
                    name="EOQ"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de configuración y efectos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Configuración de Inflación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Inflación mensual:</span>
                <Badge variant="outline">{config.monthlyInflationRate}%</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Costos afectados:</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Costo de pedidos (S):</span>
                    <Badge variant={config.affectsOrderingCost ? "default" : "secondary"}>
                      {config.affectsOrderingCost ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Costo de almacén (H):</span>
                    <Badge variant={config.affectsHoldingCost ? "default" : "secondary"}>
                      {config.affectsHoldingCost ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Precio de compra (P):</span>
                    <Badge variant={config.affectsPurchasePrice ? "default" : "secondary"}>
                      {config.affectsPurchasePrice ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              {config.includeExchangeRate && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tipo de cambio:</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Inicial:</span>
                        <span className="font-mono">{config.exchangeRateInitial}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Actual:</span>
                        <span className="font-mono">{config.exchangeRateCurrent}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Devaluación:</span>
                        <Badge variant="destructive">
                          {(
                            ((config.exchangeRateCurrent! - config.exchangeRateInitial!) /
                              config.exchangeRateInitial!) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              ¿De dónde sale el dinero?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {costBreakdownData.map((item, index) => (
                <div key={index} className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-sm">{item.component.replace(/\n/g, " ")}</span>
                    </div>
                    <span className="font-mono text-sm">{item.formula}</span>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(item.value)}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="bg-primary/10 p-3 rounded-lg">
              <h4 className="font-medium text-primary mb-2">💡 Interpretación:</h4>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>KD/Q:</strong> Menos pedidos = menos costo administrativo
                </li>
                <li>
                  • <strong>pD:</strong> El costo más grande, no depende de Q
                </li>
                <li>
                  • <strong>hQ/2:</strong> Más inventario = más costo de almacén
                </li>
                <li>
                  • <strong>EOQ:</strong> Equilibra KD/Q y hQ/2 para minimizar el total
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
