import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Calculator } from "lucide-react"
import type { ParameterConfig, SimulationResults } from "@/lib/types"

interface DetailedCalculationViewProps {
  results: SimulationResults
  parameters: ParameterConfig
  showDetails: boolean
}

export default function DetailedCalculationView({ results, parameters, showDetails }: DetailedCalculationViewProps) {
  if (!showDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 bg-muted rounded-lg">
        <p className="text-muted-foreground mb-4">
          Activa "Mostrar detalles" en la configuración para ver el cálculo detallado.
        </p>
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
          Configuración → Mostrar detalles
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-primary/20 bg-card">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4 text-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Procedimiento de Cálculo
          </h3>

          {/* Classic Total Cost Formula */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg mb-6 border border-primary/20">
            <h4 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fórmula Clásica del Costo Total
            </h4>
            <div className="bg-card/90 p-4 rounded-md shadow-sm border border-primary/10">
              <p className="font-mono text-2xl text-center mb-4 text-primary">
                TC(Q) = <span className="text-blue-600">KD/Q</span> + <span className="text-green-600">pD</span> +{" "}
                <span className="text-orange-600">hQ/2</span>
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-600 font-semibold">KD/Q</div>
                  <div className="text-muted-foreground">Costo de Ordenar</div>
                </div>
                <div className="text-center">
                  <div className="text-green-600 font-semibold">pD</div>
                  <div className="text-muted-foreground">Costo de Compra</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-600 font-semibold">hQ/2</div>
                  <div className="text-muted-foreground">Costo de Mantener</div>
                </div>
              </div>
            </div>
          </div>

          {parameters.model === "inflation" && results.inflationResults && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-100 to-red-50 p-5 rounded-lg border border-orange-200 text-black">
                <h4 className="text-lg font-semibold mb-3 text-orange-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Problema de Inflación - Datos Iniciales
                </h4>

                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100 mb-4">
                  <h5 className="font-medium mb-3 text-orange-700">Datos Iniciales:</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p>
                        <strong>Demanda anual, D:</strong> {parameters.annualDemand} unidades/año
                      </p>
                      <p>
                        <strong>Costo de hacer un pedido, S:</strong> ${parameters.orderCost}
                      </p>
                      <p>
                        <strong>Costo de almacenaje por unidad/mes, H:</strong> ${parameters.holdingCost}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Precio de compra inicial, C₀:</strong> ${parameters.unitPrice} por unidad
                      </p>
                      <p>
                        <strong>Inflación mensual:</strong> {parameters.inflationConfig?.monthlyInflationRate}%
                      </p>
                      {parameters.inflationConfig?.includeExchangeRate && (
                        <>
                          <p>
                            <strong>Tipo de cambio inicial:</strong> {parameters.inflationConfig.exchangeRateInitial}
                          </p>
                          <p>
                            <strong>Tipo de cambio actual:</strong> {parameters.inflationConfig.exchangeRateCurrent}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 1: Initial EOQ Calculation */}
                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100 mb-4">
                  <h5 className="font-medium mb-3 text-orange-700">1. Cálculo de la cantidad óptima de pedido (EOQ)</h5>

                  <div className="space-y-3">
                    <p className="text-sm">Usamos la fórmula estándar:</p>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="font-mono text-lg text-center">EOQ = √(2DS/H)</p>
                    </div>

                    <p className="text-sm">Sustituyendo:</p>
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <p className="font-mono">
                        EOQ = √(2 × {parameters.annualDemand} × {results.inflationResults.currentMonth.orderCost} /{" "}
                        {results.inflationResults.currentMonth.holdingCost})
                      </p>
                      <p className="font-mono">
                        EOQ = √({2 * parameters.annualDemand * results.inflationResults.currentMonth.orderCost} /{" "}
                        {results.inflationResults.currentMonth.holdingCost})
                      </p>
                      <p className="font-mono">
                        EOQ = √
                        {(
                          (2 * parameters.annualDemand * results.inflationResults.currentMonth.orderCost) /
                          results.inflationResults.currentMonth.holdingCost
                        ).toFixed(0)}
                      </p>
                      <p className="font-mono font-bold text-lg">
                        EOQ ≈ {results.inflationResults.currentMonth.eoq.toFixed(0)} unidades
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-sm">
                        <strong>Interpretación:</strong> Cada vez que se quiera realizar un pedido, conviene pedir
                        aproximadamente {results.inflationResults.currentMonth.eoq.toFixed(0)} unidades para minimizar
                        el costo total de pedidos + almacenamiento.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Price Adjustment for Inflation */}
                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100 mb-4">
                  <h5 className="font-medium mb-3 text-orange-700">2. Ajuste del precio de compra por inflación</h5>

                  <div className="space-y-3">
                    <p className="text-sm">Para prever el próximo mes:</p>

                    {parameters.inflationConfig?.affectsPurchasePrice && (
                      <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <p className="font-mono">
                          C₁ = C₀ × (1 + {(parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)}) ={" "}
                          {parameters.unitPrice} ×{" "}
                          {(1 + parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)} = $
                          {results.inflationResults.nextMonth.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {parameters.inflationConfig?.affectsOrderingCost && (
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                        <p className="font-mono">
                          S₁ = S₀ × (1 + {(parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)}) ={" "}
                          {parameters.orderCost} ×{" "}
                          {(1 + parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)} = $
                          {results.inflationResults.nextMonth.orderCost.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {parameters.inflationConfig?.affectsHoldingCost && (
                      <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                        <p className="font-mono">
                          H₁ = H₀ × (1 + {(parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)}) ={" "}
                          {parameters.holdingCost} ×{" "}
                          {(1 + parameters.inflationConfig.monthlyInflationRate / 100).toFixed(4)} = $
                          {results.inflationResults.nextMonth.holdingCost.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Note about EOQ changes */}
                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100 mb-4">
                  <h5 className="font-medium mb-3 text-orange-700">3. ¿Cambia el EOQ con la inflación?</h5>

                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <p className="text-sm">
                        <strong>Nota:</strong> Cada mes se repite este cálculo (con C_{"{n+1}"} = C_n × 1.0365) y, si{" "}
                        <strong>cambian S o H</strong>, se vuelve a recalcular el EOQ.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Ahora porque no cambia EOQ</strong> que es la cantidad económica a pedir o la cantidad
                        óptima es <strong>por que</strong> la inflación al subir proporcional en S y H EOQ busca la
                        media de ambos un equilibrio entonces siempre serán{" "}
                        {results.inflationResults.currentMonth.eoq.toFixed(0)} <strong>unidades</strong> aunque sea una
                        inflación del 50% la única manera de que cambie es cuando no hay un <strong>equilibrio</strong>{" "}
                        entre S y H o que cambie la demanda anual y lógicamente por la inflación que haya, el costo{" "}
                        <strong>total siempre va aumentar</strong> debido a la inflación
                      </p>

                      {results.inflationResults.eoqChanged ? (
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                          <p className="font-semibold text-red-800">
                            ⚠️ El EOQ CAMBIA de {results.inflationResults.currentMonth.eoq.toFixed(0)} a{" "}
                            {results.inflationResults.nextMonth.eoq.toFixed(0)} unidades
                          </p>
                          <p className="text-sm text-red-700">
                            Esto ocurre porque la inflación afecta S y H de manera desigual.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                          <p className="font-semibold text-green-800">
                            ✅ El EOQ se MANTIENE en {results.inflationResults.currentMonth.eoq.toFixed(0)} unidades
                          </p>
                          <p className="text-sm text-green-700">
                            La inflación afecta S y H proporcionalmente, manteniendo el equilibrio.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: New EOQ calculation if needed */}
                {results.inflationResults.eoqChanged && (
                  <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100 mb-4">
                    <h5 className="font-medium mb-3 text-orange-700">
                      4. Cálculo del nuevo EOQ ajustado por tipo de cambio
                    </h5>

                    <div className="space-y-3">
                      <p className="text-sm">
                        Con los nuevos costos ajustados, calculamos el EOQ nuevamente utilizando la fórmula:
                      </p>

                      <div className="bg-gray-50 p-3 rounded-md space-y-2">
                        <p className="font-mono">
                          EOQ = √(2 × {parameters.annualDemand} ×{" "}
                          {results.inflationResults.nextMonth.orderCost.toFixed(2)} /{" "}
                          {results.inflationResults.nextMonth.holdingCost.toFixed(2)})
                        </p>
                        <p className="font-mono">
                          EOQ = √(
                          {(2 * parameters.annualDemand * results.inflationResults.nextMonth.orderCost).toFixed(0)} /{" "}
                          {results.inflationResults.nextMonth.holdingCost.toFixed(2)})
                        </p>
                        <p className="font-mono">
                          EOQ = √
                          {(
                            (2 * parameters.annualDemand * results.inflationResults.nextMonth.orderCost) /
                            results.inflationResults.nextMonth.holdingCost
                          ).toFixed(0)}
                        </p>
                        <p className="font-mono font-bold text-lg">
                          EOQ ≈ {results.inflationResults.nextMonth.eoq.toFixed(0)} unidades
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Total Cost Analysis */}
                <div className="bg-white/80 p-4 rounded-md shadow-sm border border-orange-100">
                  <h5 className="font-medium mb-3 text-orange-700">
                    {results.inflationResults.eoqChanged ? "5" : "4"}. Análisis del Costo Total
                  </h5>

                  <div className="space-y-3">
                    <p className="text-sm">Aplicando la fórmula del costo total:</p>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="font-mono text-center">TC(Q) = KD/Q + pD + hQ/2

</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold text-sm mb-2">Mes Actual:</p>
                        <p className="font-mono text-xs">
                          TC = {results.inflationResults.currentMonth.orderCost} × {parameters.annualDemand} /{" "}
                          {results.inflationResults.currentMonth.eoq.toFixed(0)} +{" "}
                          {results.inflationResults.currentMonth.unitPrice} × {parameters.annualDemand} +{" "}
                          {results.inflationResults.currentMonth.holdingCost} ×{" "}
                          {results.inflationResults.currentMonth.eoq.toFixed(0)} / 2
                        </p>
                        <p className="font-mono font-bold text-sm mt-2">
                          TC = ${results.inflationResults.currentMonth.totalCost.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-red-50 p-3 rounded-md border border-red-200">
                        <p className="font-semibold text-sm mb-2">Próximo Mes:</p>
                        <p className="font-mono text-xs">
                          TC = {results.inflationResults.nextMonth.orderCost.toFixed(2)} × {parameters.annualDemand} /{" "}
                          {results.inflationResults.nextMonth.eoq.toFixed(0)} +{" "}
                          {results.inflationResults.nextMonth.unitPrice.toFixed(2)} × {parameters.annualDemand} +{" "}
                          {results.inflationResults.nextMonth.holdingCost.toFixed(2)} ×{" "}
                          {results.inflationResults.nextMonth.eoq.toFixed(0)} / 2
                        </p>
                        <p className="font-mono font-bold text-sm mt-2">
                          TC = ${results.inflationResults.nextMonth.totalCost.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-100 p-3 rounded-md border border-red-300">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="font-semibold text-red-800">Aumento en Costo</p>
                          <p className="font-mono font-bold text-red-600 text-lg">
                            +${results.inflationResults.costIncrease.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-red-800">Aumento Porcentual</p>
                          <p className="font-mono font-bold text-red-600 text-lg">
                            +{results.inflationResults.costIncreasePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-50 p-5 rounded-lg border border-purple-200 text-black">
                <h4 className="text-lg font-semibold mb-3 text-purple-800">💡 Conclusiones Clave</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    • <strong>De dónde sale el dinero:</strong> El aumento viene principalmente del componente{" "}
                    {results.inflationResults.costBreakdown.purchaseCostAnnual >
                    results.inflationResults.costBreakdown.orderingCostAnnual +
                      results.inflationResults.costBreakdown.holdingCostAnnual
                      ? "CD (costo de compra)"
                      : "SD/Q + HQ/2 (costos operativos)"}
                  </p>
                  <p>
                    • <strong>Comportamiento del EOQ:</strong>{" "}
                    {results.inflationResults.eoqChanged
                      ? "Cambia porque la inflación afecta S y/o H de manera desigual"
                      : "Se mantiene porque S y H suben proporcionalmente"}
                  </p>
                  <p>
                    • <strong>Estrategia recomendada:</strong>{" "}
                    {results.inflationResults.costIncreasePercent > 10
                      ? "Considerar compras anticipadas o negociar contratos a largo plazo"
                      : "Mantener la política actual de inventarios"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {parameters.model === "basic" && (
            <div className="space-y-6">
              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Fórmula EOQ (Cantidad Económica de Pedido)</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  <p className="font-mono text-lg text-center">Q* = √(2 × D × S / H)</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground mt-2">Donde:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                    <li>
                      D = Demanda anual = <Badge variant="outline">{parameters.annualDemand}</Badge>
                    </li>
                    <li>
                      S = Costo de ordenar = <Badge variant="outline">${parameters.orderCost}</Badge>
                    </li>
                    <li>
                      H = Costo de mantener inventario = <Badge variant="outline">${parameters.holdingCost}</Badge>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Sustitución de valores</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10 space-y-2">
                  <p className="font-mono">
                    Q* = √(2 × {parameters.annualDemand} × {parameters.orderCost} / {parameters.holdingCost})
                  </p>
                  <p className="font-mono">
                    Q* = √({2 * parameters.annualDemand * parameters.orderCost} / {parameters.holdingCost})
                  </p>
                  <p className="font-mono">
                    Q* = √{(2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost}
                  </p>
                  <p className="font-mono font-bold">Q* = {results.optimalQuantity.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Cálculo del Costo Total Anual</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  <p className="font-mono text-lg text-center">TC = (K × D / Q) + (p × D) + (h × Q / 2)</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground mt-2">Donde:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                    <li>
                      D = Demanda anual = <Badge variant="outline">{parameters.annualDemand}</Badge>
                    </li>
                    <li>
                      C = Costo de compra por unidad = <Badge variant="outline">${parameters.unitPrice}</Badge>
                    </li>
                    <li>
                      S = Costo de ordenar = <Badge variant="outline">${parameters.orderCost}</Badge>
                    </li>
                    <li>
                      H = Costo de mantener inventario = <Badge variant="outline">${parameters.holdingCost}</Badge>
                    </li>
                    <li>
                      Q = Cantidad óptima = <Badge variant="outline">{results.optimalQuantity.toFixed(2)}</Badge>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Sustitución de valores para el Costo Total</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10 space-y-2">
                  <p className="font-mono">
                    TC = ({parameters.orderCost} × {parameters.annualDemand} / {results.optimalQuantity.toFixed(2)}) + (
                    {parameters.unitPrice} × {parameters.annualDemand}) + ({parameters.holdingCost} ×{" "}
                    {results.optimalQuantity.toFixed(2)} / 2)
                  </p>
                  <p className="font-mono">
                    TC = {parameters.annualDemand * parameters.unitPrice} +{" "}
                    {((parameters.annualDemand / results.optimalQuantity) * parameters.orderCost).toFixed(2)} +{" "}
                    {((results.optimalQuantity / 2) * parameters.holdingCost).toFixed(2)}
                  </p>
                  <p className="font-mono font-bold">TC = ${results.totalCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Cálculo del Punto de Reorden (ROP)</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  <p className="font-mono text-lg text-center">ROP = d × L</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground mt-2">Donde:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                    <li>
                      d = Demanda diaria = <Badge variant="outline">{(parameters.annualDemand / 365).toFixed(2)}</Badge>
                    </li>
                    <li>
                      L = Tiempo de entrega en días = <Badge variant="outline">{parameters.leadTime}</Badge>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">
                  Sustitución de valores para el Punto de Reorden
                </h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10 space-y-2">
                  <p className="font-mono">
                    ROP = {(parameters.annualDemand / 365).toFixed(2)} × {parameters.leadTime}
                  </p>
                  <p className="font-mono font-bold">ROP = {results.reorderPoint.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {parameters.model === "production" && (
            <div className="space-y-6">
              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">
                  Fórmula EPQ (Cantidad Económica de Producción)
                </h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  <p className="font-mono text-lg text-center">Q* = √(2 × D × K / H × (1 - D/R))</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground mt-2">Donde:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                    <li>
                      D = Demanda anual = <Badge variant="outline">{parameters.annualDemand}</Badge>
                    </li>
                    <li>
                      K = Costo de setup = <Badge variant="outline">${parameters.orderCost}</Badge>
                    </li>
                    <li>
                      H = Costo de mantener inventario = <Badge variant="outline">${parameters.holdingCost}</Badge>
                    </li>
                    <li>
                      R = Tasa de producción anual = <Badge variant="outline">{parameters.productionRate}</Badge>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Sustitución de valores</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10 space-y-2">
                  <p className="font-mono">
                    Q* = √(2 × {parameters.annualDemand} × {parameters.orderCost} / {parameters.holdingCost} × (1 -{" "}
                    {parameters.annualDemand}/{parameters.productionRate}))
                  </p>
                  <p className="font-mono">
                    Q* = √({2 * parameters.annualDemand * parameters.orderCost} / {parameters.holdingCost} ×{" "}
                    {(1 - parameters.annualDemand / (parameters.productionRate || 1)).toFixed(4)})
                  </p>
                  <p className="font-mono">
                    Q* = √
                    {(2 * parameters.annualDemand * parameters.orderCost) /
                      (parameters.holdingCost * (1 - parameters.annualDemand / (parameters.productionRate || 1)))}
                  </p>
                  <p className="font-mono font-bold">Q* = {results.optimalQuantity.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {parameters.model === "discount" && (
            <div className="space-y-6">
              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Modelo EOQ con Descuentos por Cantidad</h4>
                <p className="text-sm text-muted-foreground bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  Para el modelo con descuentos, calculamos el EOQ para cada nivel de precio y evaluamos el costo total
                  para determinar la cantidad óptima de pedido.
                </p>
              </div>

              {/* Cálculos para cada nivel de descuento */}
              {parameters.discountLevels?.map((level, index) => (
                <div key={index} className="bg-muted p-5 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 text-primary">
                    Nivel de descuento {index + 1}: Cantidad ≥ {level.quantity}, Precio = ${level.price}
                  </h4>
                  <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10 space-y-3">
                    <p className="font-mono">Q* = √(2 × D × S / H)</p>
                    <p className="font-mono">
                      Q* = √(2 × {parameters.annualDemand} × {parameters.orderCost} / {parameters.holdingCost})
                    </p>
                    <p className="font-mono">
                      Q* ={" "}
                      {Math.sqrt((2 * parameters.annualDemand * parameters.orderCost) / parameters.holdingCost).toFixed(
                        2,
                      )}
                    </p>

                    <Separator className="my-2" />

                    <p className="text-sm text-muted-foreground">
                      Si Q* &lt; {level.quantity}, entonces Q = {level.quantity} (ajustamos al mínimo del nivel)
                    </p>

                    <Separator className="my-2" />

                    <p className="text-sm text-muted-foreground">Costo Total con Q = {level.quantity}:</p>
                    <p className="font-mono">TC = (D × C) + (D / Q × S) + (Q / 2 × H)</p>
                    <p className="font-mono">
                      TC = ({parameters.annualDemand} × {level.price}) + ({parameters.annualDemand} / {level.quantity} ×{" "}
                      {parameters.orderCost}) + ({level.quantity} / 2 × {parameters.holdingCost})
                    </p>
                    <p className="font-mono">
                      TC = $
                      {(
                        parameters.annualDemand * level.price +
                        (parameters.annualDemand / level.quantity) * parameters.orderCost +
                        (level.quantity / 2) * parameters.holdingCost
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-muted p-5 rounded-lg">
                <h4 className="text-sm font-medium mb-3 text-primary">Comparación de Costos Totales</h4>
                <div className="bg-card/80 p-4 rounded-md shadow-sm border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-3">
                    Después de calcular el costo total para cada nivel de descuento, seleccionamos la cantidad que
                    resulta en el menor costo total.
                  </p>
                  <div className="bg-primary/20 p-3 rounded-md">
                    <p className="font-mono font-bold">Cantidad Óptima (Q*) = {results.optimalQuantity.toFixed(2)}</p>
                    <p className="font-mono font-bold">Costo Total Mínimo = ${results.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
