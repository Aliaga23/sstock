import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar } from "lucide-react"
import type { ParameterConfig, SimulationResults } from "@/lib/types"

interface InsightsViewProps {
  results: SimulationResults
  parameters: ParameterConfig
}

export default function InsightsView({ results, parameters }: InsightsViewProps) {
  // Calcular métricas adicionales para insights más detallados
  const dailyDemand = parameters.annualDemand / 365
  const weeklyDemand = parameters.annualDemand / 52
  const monthlyDemand = parameters.annualDemand / 12

  const orderingCost = parameters.orderCost * (parameters.annualDemand / results.optimalQuantity)
  const holdingCost = parameters.holdingCost * (results.optimalQuantity / 2)
  const purchaseCost = parameters.unitPrice * parameters.annualDemand

  const inventoryTurnover = parameters.annualDemand / (results.optimalQuantity / 2)
  const averageInventoryValue = (results.optimalQuantity / 2) * parameters.unitPrice
  const daysOfSupply = results.optimalQuantity / dailyDemand

  // Calcular ahorros vs estrategias subóptimas
  const smallOrderQuantity = results.optimalQuantity * 0.3
  const smallOrderCost =
    parameters.orderCost * (parameters.annualDemand / smallOrderQuantity) +
    parameters.holdingCost * (smallOrderQuantity / 2) +
    purchaseCost
  const savingsVsSmallOrders = smallOrderCost - results.totalCost

  const largeOrderQuantity = results.optimalQuantity * 2.5
  const largeOrderCost =
    parameters.orderCost * (parameters.annualDemand / largeOrderQuantity) +
    parameters.holdingCost * (largeOrderQuantity / 2) +
    purchaseCost
  const savingsVsLargeOrders = largeOrderCost - results.totalCost

  return (
    <div className="space-y-6">
      {/* Resumen ejecutivo */}
      <Card className="shadow-md border-primary/20 bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-white">
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 mr-3" />
            <h3 className="text-lg font-semibold">Resumen Ejecutivo de tu Estrategia de Inventario</h3>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="bg-primary/10 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-primary mb-2">🎯 Tu Estrategia Óptima</h4>
            <p className="text-sm leading-relaxed">
              Para tu negocio, la estrategia más rentable es{" "}
              <strong>
                ordenar {Math.round(results.optimalQuantity)} unidades cada {Math.round(results.daysBetweenOrders)} días
              </strong>
              . Esto te permitirá ahorrar <strong>${Math.round(savingsVsLargeOrders).toLocaleString()} al año</strong>{" "}
              comparado con hacer pedidos muy grandes, y{" "}
              <strong>${Math.round(savingsVsSmallOrders).toLocaleString()} al año</strong> comparado con hacer pedidos
              muy pequeños.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Beneficios Clave
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Minimiza tus costos totales de inventario</li>
                <li>• Reduce el riesgo de quedarte sin stock</li>
                <li>• Optimiza tu flujo de efectivo</li>
                <li>• Simplifica la gestión de pedidos</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Impacto Financiero
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Costo total anual: <strong>${results.totalCost.toLocaleString()}</strong>
                </li>
                <li>
                  • Rotación de inventario: <strong>{inventoryTurnover.toFixed(1)} veces/año</strong>
                </li>
                <li>
                  • Inventario promedio: <strong>${averageInventoryValue.toLocaleString()}</strong>
                </li>
                <li>
                  • Días de suministro: <strong>{daysOfSupply.toFixed(0)} días</strong>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretación detallada de cada resultado */}
      <div className="grid gap-6">
        {/* Cantidad Óptima */}
        <Card className="shadow-md border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Badge className="bg-primary h-10 w-10 rounded-full flex items-center justify-center p-0 text-lg">
                  Q*
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Cantidad Óptima: {Math.round(results.optimalQuantity)} unidades por pedido
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>¿Qué significa?</strong> Esta es la cantidad exacta que debes ordenar cada vez para
                    minimizar tus costos totales. No es casualidad: es el punto matemático donde el costo de hacer
                    pedidos frecuentes se equilibra perfectamente con el costo de mantener inventario.
                  </p>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">💡 En términos prácticos:</p>
                    <ul className="text-sm space-y-1">
                      <li>
                        • Equivale a <strong>{(results.optimalQuantity / weeklyDemand).toFixed(1)} semanas</strong> de
                        demanda
                      </li>
                      <li>
                        • Representa <strong>{(results.optimalQuantity / monthlyDemand).toFixed(1)} meses</strong> de
                        ventas
                      </li>
                      <li>
                        • Te durará aproximadamente <strong>{daysOfSupply.toFixed(0)} días</strong> en condiciones
                        normales
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Importante:</strong> Si ordenas menos, harás pedidos muy frecuentes y gastarás más en
                      costos de pedido. Si ordenas más, tendrás mucho inventario parado y gastarás más en
                      almacenamiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Costo Total */}
        <Card className="shadow-md border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Badge className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center p-0">
                  <DollarSign className="h-5 w-5" />
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Costo Total Anual: ${results.totalCost.toLocaleString()}
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>¿Qué incluye?</strong> Este es el costo completo de manejar tu inventario durante un año
                    entero. Incluye todo: lo que pagas por los productos, los costos de hacer pedidos, y los costos de
                    almacenar inventario.
                  </p>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs font-medium text-blue-800 mb-1">Compra de Productos</p>
                      <p className="text-lg font-bold text-blue-900">${purchaseCost.toLocaleString()}</p>
                      <p className="text-xs text-blue-700">
                        {((purchaseCost / results.totalCost) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <p className="text-xs font-medium text-green-800 mb-1">Hacer Pedidos</p>
                      <p className="text-lg font-bold text-green-900">${orderingCost.toLocaleString()}</p>
                      <p className="text-xs text-green-700">
                        {((orderingCost / results.totalCost) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                      <p className="text-xs font-medium text-purple-800 mb-1">Almacenar</p>
                      <p className="text-lg font-bold text-purple-900">${holdingCost.toLocaleString()}</p>
                      <p className="text-xs text-purple-700">
                        {((holdingCost / results.totalCost) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>💰 Ahorro anual:</strong> Siguiendo esta estrategia ahorras{" "}
                      <strong>${Math.round(savingsVsLargeOrders).toLocaleString()}</strong>
                      comparado con hacer pedidos grandes, y{" "}
                      <strong>${Math.round(savingsVsSmallOrders).toLocaleString()}</strong> comparado con pedidos
                      pequeños.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Punto de Reorden */}
        <Card className="shadow-md border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Badge className="bg-accent h-10 w-10 rounded-full flex items-center justify-center p-0 text-black">
                  <AlertTriangle className="h-5 w-5" />
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Punto de Reorden: {Math.round(results.reorderPoint)} unidades
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>¿Cuándo actuar?</strong> Este es tu "semáforo amarillo". Cuando tu inventario llegue a este
                    nivel, es momento de hacer el siguiente pedido. No esperes más, porque si lo haces, podrías quedarte
                    sin stock antes de que llegue tu próximo pedido.
                  </p>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">🎯 Cálculo del punto de reorden:</p>
                    <ul className="text-sm space-y-1">
                      <li>
                        • Vendes aproximadamente <strong>{dailyDemand.toFixed(1)} unidades por día</strong>
                      </li>
                      <li>
                        • Tu proveedor tarda <strong>{parameters.leadTime} días</strong> en entregar
                      </li>
                      <li>
                        • Durante esos {parameters.leadTime} días venderás: {dailyDemand.toFixed(1)} ×{" "}
                        {parameters.leadTime} = <strong>{results.reorderPoint.toFixed(0)} unidades</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>❌ Si ordenas muy tarde:</strong> Te quedarás sin productos y perderás ventas. Tus
                        clientes se irán con la competencia.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>✅ Si ordenas a tiempo:</strong> Siempre tendrás stock disponible. Tu negocio funcionará
                        sin interrupciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frecuencia de Pedidos */}
        <Card className="shadow-md border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Badge className="bg-primary h-10 w-10 rounded-full flex items-center justify-center p-0">
                  <Calendar className="h-5 w-5" />
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Frecuencia: {results.ordersPerYear.toFixed(1)} pedidos al año (cada{" "}
                  {Math.round(results.daysBetweenOrders)} días)
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>¿Qué tan seguido ordenar?</strong> Esta frecuencia está calculada para que no tengas que
                    estar pensando en pedidos todo el tiempo, pero tampoco tengas tu dinero "dormido" en demasiado
                    inventario.
                  </p>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">📅 Tu calendario de pedidos:</p>
                    <ul className="text-sm space-y-1">
                      <li>
                        • Harás aproximadamente <strong>{Math.round(results.ordersPerYear)} pedidos al año</strong>
                      </li>
                      <li>
                        • Eso es <strong>{(results.ordersPerYear / 12).toFixed(1)} pedidos por mes</strong>
                      </li>
                      <li>
                        • O un pedido cada <strong>{Math.round(results.daysBetweenOrders)} días</strong>
                      </li>
                      {results.daysBetweenOrders <= 7 && (
                        <li className="text-orange-600">
                          • ⚠️ Pedidos muy frecuentes - considera negociar mejores precios por volumen
                        </li>
                      )}
                      {results.daysBetweenOrders >= 60 && (
                        <li className="text-orange-600">
                          • ⚠️ Pedidos muy espaciados - asegúrate de tener espacio de almacenamiento
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Tip práctico:</strong> Marca en tu calendario cada{" "}
                      {Math.round(results.daysBetweenOrders)} días para revisar tu inventario. Cuando llegues al punto
                      de reorden ({Math.round(results.reorderPoint)} unidades), haz tu pedido inmediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones específicas por modelo */}
        {parameters.model === "production" && (
          <Card className="shadow-md border-primary/20 bg-card">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-foreground mb-3 flex items-center">
                <Badge className="bg-secondary h-8 w-8 rounded-full flex items-center justify-center p-0 mr-3">
                  🏭
                </Badge>
                Recomendaciones para tu Modelo de Producción
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Como produces internamente, tienes ventajas únicas que debes aprovechar:
                </p>
                <ul className="text-sm space-y-2">
                  <li>
                    • <strong>Flexibilidad:</strong> Puedes ajustar la producción según la demanda real
                  </li>
                  <li>
                    • <strong>Control de calidad:</strong> Tienes control total sobre el proceso
                  </li>
                  <li>
                    • <strong>Costos:</strong> No dependes de precios externos, pero debes optimizar tu capacidad
                  </li>
                  <li>
                    • <strong>Planificación:</strong> Programa tu producción cada{" "}
                    {Math.round(results.daysBetweenOrders)} días
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {parameters.model === "discount" && (
          <Card className="shadow-md border-primary/20 bg-card">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-foreground mb-3 flex items-center">
                <Badge className="bg-secondary h-8 w-8 rounded-full flex items-center justify-center p-0 mr-3">
                  💰
                </Badge>
                Aprovechando los Descuentos por Volumen
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tu estrategia óptima ya considera los descuentos disponibles:
                </p>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>✅ Resultado:</strong> La cantidad recomendada ({Math.round(results.optimalQuantity)}{" "}
                    unidades) ya incluye el mejor descuento disponible que compensa los costos adicionales de
                    almacenamiento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
