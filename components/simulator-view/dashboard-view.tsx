"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ParameterConfig, SimulationResults } from "@/lib/types"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
  ComposedChart,
} from "recharts"
import ClientOnly from "@/components/client-only"

interface DashboardViewProps {
  results: SimulationResults
  parameters: ParameterConfig
}

export default function DashboardView({ results, parameters }: DashboardViewProps) {
  const [chartTab, setChartTab] = useState("why-optimal")
  const [windowWidth, setWindowWidth] = useState(1200)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = isMounted ? windowWidth < 640 : false

  // Generar datos para mostrar por qué Q* es óptimo
  const generateOptimalComparisonData = () => {
    const optimalQ = results.optimalQuantity
    const scenarios = [
      { name: "Muy Poco", quantity: optimalQ * 0.3, label: "30% de Q*" },
      { name: "Poco", quantity: optimalQ * 0.6, label: "60% de Q*" },
      { name: "ÓPTIMO", quantity: optimalQ, label: "Q* Óptimo" },
      { name: "Mucho", quantity: optimalQ * 1.5, label: "150% de Q*" },
      { name: "Demasiado", quantity: optimalQ * 2.5, label: "250% de Q*" },
    ]

    return scenarios.map((scenario) => {
      const orderingCost = parameters.orderCost * (parameters.annualDemand / scenario.quantity)
      const holdingCost = parameters.holdingCost * (scenario.quantity / 2)
      const totalVariableCost = orderingCost + holdingCost

      return {
        ...scenario,
        orderingCost,
        holdingCost,
        totalCost: totalVariableCost,
        isOptimal: scenario.name === "ÓPTIMO",
      }
    })
  }

  // Generar datos para mostrar el ahorro vs. decisiones incorrectas
  const generateSavingsData = () => {
    const optimalCost = results.totalCost
    const scenarios = [
      { decision: "Pedidos muy pequeños\n(cada semana)", multiplier: 0.2, reason: "Muchos pedidos" },
      { decision: "Pedidos pequeños\n(cada 2 semanas)", multiplier: 0.5, reason: "Pedidos frecuentes" },
      { decision: "DECISIÓN ÓPTIMA\n(Q*)", multiplier: 1, reason: "Equilibrio perfecto" },
      { decision: "Pedidos grandes\n(cada 3 meses)", multiplier: 2, reason: "Mucho inventario" },
      { decision: "Pedidos enormes\n(cada 6 meses)", multiplier: 4, reason: "Inventario excesivo" },
    ]

    return scenarios.map((scenario) => {
      const quantity = results.optimalQuantity * scenario.multiplier
      const orderingCost = parameters.orderCost * (parameters.annualDemand / quantity)
      const holdingCost = parameters.holdingCost * (quantity / 2)
      const totalVariableCost = orderingCost + holdingCost + parameters.annualDemand * parameters.unitPrice

      const savings = totalVariableCost - optimalCost
      const savingsPercent = ((totalVariableCost - optimalCost) / optimalCost) * 100

      return {
        ...scenario,
        totalCost: totalVariableCost,
        savings: savings,
        savingsPercent: savingsPercent,
        isOptimal: scenario.multiplier === 1,
      }
    })
  }

  // Generar datos para el ciclo de inventario
  const generateInventoryCycleData = () => {
    const data = []
    const cycleTime = results.daysBetweenOrders
    const dailyDemand = parameters.annualDemand / 365

    // Crear varios ciclos para mostrar el patrón
    for (let cycle = 0; cycle < 3; cycle++) {
      const startDay = cycle * cycleTime

      // Punto de recepción del pedido
      data.push({
        day: startDay,
        inventory: results.optimalQuantity,
        event: cycle === 0 ? "Recibo pedido" : "",
        phase: "Inventario máximo",
      })

      // Puntos durante el consumo
      for (let day = 1; day <= cycleTime; day += cycleTime / 10) {
        const currentInventory = Math.max(0, results.optimalQuantity - dailyDemand * day)
        data.push({
          day: startDay + day,
          inventory: currentInventory,
          event: "",
          phase: currentInventory > results.reorderPoint ? "Consumo normal" : "Zona de reorden",
        })
      }

      // Punto de reorden
      const reorderDay = startDay + (results.optimalQuantity - results.reorderPoint) / dailyDemand
      if (reorderDay < startDay + cycleTime) {
        data.push({
          day: reorderDay,
          inventory: results.reorderPoint,
          event: cycle === 0 ? "¡Hacer pedido!" : "",
          phase: "Punto de reorden",
        })
      }
    }

    return data
  }

  // Generar datos para comparación de costos
  const generateCostComparisonData = () => {
    const orderingCost = parameters.orderCost * (parameters.annualDemand / results.optimalQuantity)
    const holdingCost = parameters.holdingCost * (results.optimalQuantity / 2)
    const purchaseCost = parameters.unitPrice * parameters.annualDemand

    return [
      {
        category: "Compra de\nProductos",
        cost: purchaseCost,
        percentage: (purchaseCost / results.totalCost) * 100,
        description: "Lo que pagas por los productos",
        color: "#1a4d8c",
      },
      {
        category: "Hacer\nPedidos",
        cost: orderingCost,
        percentage: (orderingCost / results.totalCost) * 100,
        description: "Tiempo, llamadas, papeleo",
        color: "#2e86de",
      },
      {
        category: "Guardar\nInventario",
        cost: holdingCost,
        percentage: (holdingCost / results.totalCost) * 100,
        description: "Almacén, electricidad, pérdidas",
        color: "#00cec9",
      },
    ]
  }

  // Generar datos para mostrar el impacto del tiempo de entrega
  const generateLeadTimeImpactData = () => {
    const leadTimes = [1, 3, 7, 14, 21, 30]
    return leadTimes.map((leadTime) => {
      const dailyDemand = parameters.annualDemand / 365
      const reorderPoint = dailyDemand * leadTime
      const safetyStock = reorderPoint - dailyDemand * parameters.leadTime

      return {
        leadTime,
        reorderPoint,
        safetyStock: Math.max(0, safetyStock),
        risk: leadTime > parameters.leadTime ? "Seguro" : "Riesgoso",
      }
    })
  }

  const optimalComparisonData = generateOptimalComparisonData()
  const savingsData = generateSavingsData()
  const inventoryCycleData = generateInventoryCycleData()
  const costComparisonData = generateCostComparisonData()
  const leadTimeImpactData = generateLeadTimeImpactData()

  // Paleta de colores mejorada
  const COLORS = ["#1a4d8c", "#2e86de", "#00cec9", "#6c5ce7", "#00b894", "#fd79a8", "#fdcb6e"]

  // Función para formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(Math.round(num))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Configuraciones responsivas para gráficos
  const getChartMargin = () => {
    return isMobile ? { top: 10, right: 10, left: 0, bottom: 10 } : { top: 20, right: 30, left: 20, bottom: 20 }
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card">
          <div className="bg-muted px-4 py-2 border-b border-primary/20">
            <div className="text-xs font-medium text-primary">Cantidad Óptima</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatNumber(results.optimalQuantity)}</div>
            <div className="text-xs text-muted-foreground mt-1">unidades por pedido</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card">
          <div className="bg-muted px-4 py-2 border-b border-primary/20">
            <div className="text-xs font-medium text-primary">Ahorro Anual</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(savingsData.find((s) => s.multiplier === 2)?.savings || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs. pedidos grandes</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card">
          <div className="bg-muted px-4 py-2 border-b border-primary/20">
            <div className="text-xs font-medium text-primary">Frecuencia</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{results.daysBetweenOrders.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">días entre pedidos</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card">
          <div className="bg-muted px-4 py-2 border-b border-primary/20">
            <div className="text-xs font-medium text-primary">Punto de Reorden</div>
          </div>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatNumber(results.reorderPoint)}</div>
            <div className="text-xs text-muted-foreground mt-1">unidades restantes</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas educativas */}
      <Card className="shadow-lg border-primary/20 bg-card">
        <CardContent className="p-0">
          <Tabs value={chartTab} onValueChange={setChartTab}>
            <TabsList className="w-full rounded-none border-b grid grid-cols-2 md:grid-cols-5 bg-transparent">
              <TabsTrigger
                value="why-optimal"
                className="rounded-none py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                ¿Por qué Q*?
              </TabsTrigger>
              <TabsTrigger
                value="savings"
                className="rounded-none py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                Ahorros
              </TabsTrigger>
              <TabsTrigger
                value="inventory-cycle"
                className="rounded-none py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                Ciclo de Inventario
              </TabsTrigger>
              <TabsTrigger
                value="cost-breakdown"
                className="rounded-none py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                Costos
              </TabsTrigger>
              <TabsTrigger
                value="lead-time"
                className="rounded-none py-2 sm:py-3 text-xs sm:text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                Tiempo Entrega
              </TabsTrigger>
            </TabsList>

            {/* ¿Por qué Q* es óptimo? */}
            <TabsContent value="why-optimal" className="p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">¿Por qué esta cantidad es la mejor?</h3>
                  <p className="text-sm text-muted-foreground">
                    Comparación de costos con diferentes cantidades de pedido
                  </p>
                </div>
                <div className="h-[400px]">
                  <ClientOnly
                    fallback={
                      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                        Cargando gráfica...
                      </div>
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={optimalComparisonData} margin={getChartMargin()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? "end" : "middle"}
                          height={isMobile ? 60 : 40}
                        />
                        <YAxis
                          label={isMobile ? null : { value: "Costo Anual ($)", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          width={isMobile ? 50 : 70}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            formatCurrency(Number(value)),
                            name === "orderingCost"
                              ? "Costo de Pedidos"
                              : name === "holdingCost"
                                ? "Costo de Almacén"
                                : "Costo Total Variable",
                          ]}
                          labelFormatter={(label) => `Estrategia: ${label}`}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: isMobile ? "11px" : "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconSize={isMobile ? 8 : 10}
                          wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
                        />
                        <Bar
                          dataKey="orderingCost"
                          name="Costo de Pedidos"
                          stackId="costs"
                          fill={COLORS[1]}
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="holdingCost"
                          name="Costo de Almacén"
                          stackId="costs"
                          fill={COLORS[2]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalCost"
                          name="Costo Total Variable"
                          stroke={COLORS[0]}
                          strokeWidth={3}
                          dot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ClientOnly>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">💡 ¿Qué nos dice esta gráfica?</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      <strong>Pedidos muy pequeños:</strong> Gastas mucho en hacer pedidos frecuentes (barras azules
                      altas)
                    </li>
                    <li>
                      <strong>Pedidos muy grandes:</strong> Gastas mucho en almacenar inventario (barras verdes altas)
                    </li>
                    <li>
                      <strong>Q* Óptimo:</strong> Equilibra ambos costos para minimizar el gasto total (línea azul más
                      baja)
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Ahorros vs decisiones incorrectas */}
            <TabsContent value="savings" className="p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">¿Cuánto dinero puedes ahorrar?</h3>
                  <p className="text-sm text-muted-foreground">
                    Comparación de costos anuales con diferentes estrategias
                  </p>
                </div>
                <div className="h-[400px]">
                  <ClientOnly
                    fallback={
                      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                        Cargando gráfica...
                      </div>
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={savingsData} margin={getChartMargin()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis
                          dataKey="decision"
                          tick={{ fontSize: isMobile ? 9 : 11 }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? "end" : "middle"}
                          height={isMobile ? 80 : 60}
                          interval={0}
                        />
                        <YAxis
                          label={
                            isMobile ? null : { value: "Costo Total Anual ($)", angle: -90, position: "insideLeft" }
                          }
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          width={isMobile ? 50 : 70}
                        />
                        <Tooltip
                          formatter={(value, name) => [formatCurrency(Number(value)), "Costo Total Anual"]}
                          labelFormatter={(label) => `Estrategia: ${label.replace(/\n/g, " ")}`}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: isMobile ? "11px" : "12px",
                          }}
                        />
                        <Bar
                          dataKey="totalCost"
                          name="Costo Total"
                          fill={(entry) => (entry?.isOptimal ? COLORS[4] : COLORS[0])}
                          radius={[4, 4, 0, 0]}
                        >
                          {savingsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isOptimal ? COLORS[4] : COLORS[0]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnly>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">💰 Ahorros Potenciales</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>
                        <strong>vs. Pedidos muy pequeños:</strong>{" "}
                        {formatCurrency(savingsData.find((s) => s.multiplier === 0.2)?.savings || 0)} al año
                      </p>
                      <p>
                        <strong>vs. Pedidos grandes:</strong>{" "}
                        {formatCurrency(savingsData.find((s) => s.multiplier === 2)?.savings || 0)} al año
                      </p>
                      <p>
                        <strong>vs. Pedidos enormes:</strong>{" "}
                        {formatCurrency(savingsData.find((s) => s.multiplier === 4)?.savings || 0)} al año
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">🎯 Decisión Óptima</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>Cantidad por pedido:</strong> {formatNumber(results.optimalQuantity)} unidades
                      </p>
                      <p>
                        <strong>Frecuencia:</strong> Cada {results.daysBetweenOrders.toFixed(0)} días
                      </p>
                      <p>
                        <strong>Costo total:</strong> {formatCurrency(results.totalCost)} al año
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Ciclo de inventario */}
            <TabsContent value="inventory-cycle" className="p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">¿Cómo funciona tu inventario día a día?</h3>
                  <p className="text-sm text-muted-foreground">Simulación de 3 ciclos completos de inventario</p>
                </div>
                <div className="h-[400px]">
                  <ClientOnly
                    fallback={
                      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                        Cargando gráfica...
                      </div>
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={inventoryCycleData} margin={getChartMargin()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis
                          dataKey="day"
                          label={isMobile ? null : { value: "Días", position: "insideBottomRight", offset: -10 }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => Math.round(value)}
                        />
                        <YAxis
                          label={isMobile ? null : { value: "Unidades en Stock", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          width={isMobile ? 50 : 70}
                        />
                        <Tooltip
                          formatter={(value, name) => [formatNumber(Number(value)), "Inventario"]}
                          labelFormatter={(label) => `Día ${Math.round(Number(label))}`}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: isMobile ? "11px" : "12px",
                          }}
                        />
                        <defs>
                          <linearGradient id="inventoryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="inventory"
                          name="Nivel de Inventario"
                          stroke={COLORS[3]}
                          fill="url(#inventoryGradient)"
                          strokeWidth={2}
                        />
                        <ReferenceLine
                          y={results.reorderPoint}
                          stroke={COLORS[0]}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: `Punto de Reorden: ${formatNumber(results.reorderPoint)}`,
                            position: "insideTopRight",
                            fill: COLORS[0],
                            fontSize: isMobile ? 10 : 12,
                            fontWeight: "bold",
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ClientOnly>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">📦 Recibo Pedido</h4>
                    <p className="text-sm text-green-700">
                      Cada {results.daysBetweenOrders.toFixed(0)} días recibes {formatNumber(results.optimalQuantity)}{" "}
                      unidades
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Punto de Reorden</h4>
                    <p className="text-sm text-yellow-700">
                      Cuando quedan {formatNumber(results.reorderPoint)} unidades, ¡haz el siguiente pedido!
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">🔄 Ciclo Completo</h4>
                    <p className="text-sm text-blue-700">
                      El patrón se repite automáticamente, manteniendo siempre stock disponible
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Desglose de costos */}
            <TabsContent value="cost-breakdown" className="p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">¿En qué se va tu dinero?</h3>
                  <p className="text-sm text-muted-foreground">Desglose de todos los costos anuales de tu inventario</p>
                </div>
                <div className="h-[400px]">
                  <ClientOnly
                    fallback={
                      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                        Cargando gráfica...
                      </div>
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={getChartMargin()}>
                        <Pie
                          data={costComparisonData}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          outerRadius={isMobile ? 80 : 120}
                          innerRadius={isMobile ? 30 : 60}
                          fill="#8884d8"
                          dataKey="cost"
                          label={({ category, percentage }) => {
                            if (isMobile) {
                              return `${percentage.toFixed(0)}%`
                            } else {
                              return `${category}: ${percentage.toFixed(0)}%`
                            }
                          }}
                          paddingAngle={2}
                        >
                          {costComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [formatCurrency(Number(value)), props.payload.description]}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: isMobile ? "11px" : "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={isMobile ? 8 : 10}
                          formatter={(value, entry) => (
                            <span
                              style={{
                                color: "#ffffff",
                                fontSize: isMobile ? "10px" : "12px",
                              }}
                            >
                              {typeof value === "string" ? value.replace(/\n/g, " ") : value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnly>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {costComparisonData.map((item, index) => (
                    <div key={index} className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <h4 className="font-medium">
                          {typeof item.category === "string" ? item.category.replace(/\n/g, " ") : item.category}
                        </h4>
                      </div>
                      <p className="text-2xl font-bold">{formatCurrency(item.cost)}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}% del total</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Impacto del tiempo de entrega */}
            <TabsContent value="lead-time" className="p-3 sm:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">¿Cómo afecta el tiempo de entrega?</h3>
                  <p className="text-sm text-muted-foreground">
                    Comparación de puntos de reorden con diferentes tiempos de entrega
                  </p>
                </div>
                <div className="h-[400px]">
                  <ClientOnly
                    fallback={
                      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                        Cargando gráfica...
                      </div>
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadTimeImpactData} margin={getChartMargin()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis
                          dataKey="leadTime"
                          label={
                            isMobile
                              ? null
                              : { value: "Tiempo de Entrega (días)", position: "insideBottom", offset: -10 }
                          }
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis
                          label={isMobile ? null : { value: "Unidades", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          width={isMobile ? 50 : 70}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            formatNumber(Number(value)),
                            name === "reorderPoint" ? "Punto de Reorden" : "Stock de Seguridad",
                          ]}
                          labelFormatter={(label) => `Tiempo de entrega: ${label} días`}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: isMobile ? "11px" : "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconSize={isMobile ? 8 : 10}
                          wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
                        />
                        <Bar dataKey="reorderPoint" name="Punto de Reorden" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                        <ReferenceLine
                          x={parameters.leadTime}
                          stroke={COLORS[4]}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: `Tu tiempo actual: ${parameters.leadTime} días`,
                            position: "topRight",
                            fill: COLORS[4],
                            fontSize: isMobile ? 10 : 12,
                            fontWeight: "bold",
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnly>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ ¿Qué significa esto?</h4>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <p>
                      <strong>Tu tiempo actual ({parameters.leadTime} días):</strong> Necesitas hacer pedido cuando
                      tengas {formatNumber(results.reorderPoint)} unidades
                    </p>
                    <p>
                      <strong>Si el tiempo fuera mayor:</strong> Necesitarías más stock de seguridad para evitar
                      quedarte sin productos
                    </p>
                    <p>
                      <strong>Si el tiempo fuera menor:</strong> Podrías mantener menos inventario y ahorrar en costos
                      de almacenaje
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
