"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calculator, HelpCircle, ArrowRight, CheckCircle } from "lucide-react"
import type { ParameterConfig, ModelType } from "@/lib/types"
import HelpGuide from "@/components/help-guide"
import { useState } from "react"

interface ConfigurationPanelProps {
  parameters: ParameterConfig
  setParameters: (parameters: ParameterConfig) => void
  showDetails: boolean
  setShowDetails: (show: boolean) => void
  onCalculate: () => void
  onContinue: () => void
}

export default function ConfigurationPanel({
  parameters,
  setParameters,
  showDetails,
  setShowDetails,
  onCalculate,
  onContinue,
}: ConfigurationPanelProps) {
  const [showHelp, setShowHelp] = useState(false)

  const handleModelChange = (value: string) => {
    setParameters({
      ...parameters,
      model: value as ModelType,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (value === "") {
      setParameters({
        ...parameters,
        [name]: undefined, 
      })
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        setParameters({
          ...parameters,
          [name]: numValue,
        })
      }
    }
  }

  // Validar si todos los campos requeridos están completos
  const isConfigurationComplete = () => {
    const requiredFields = [
      typeof parameters.orderCost === "number" && parameters.orderCost > 0,
      typeof parameters.annualDemand === "number" && parameters.annualDemand > 0,
      typeof parameters.holdingCost === "number" && parameters.holdingCost > 0,
      typeof parameters.unitPrice === "number" && parameters.unitPrice > 0,
      typeof parameters.leadTime === "number" && parameters.leadTime > 0,
    ]

    if (parameters.model === "production") {
      requiredFields.push(
        typeof parameters.productionRate === "number" &&
          parameters.productionRate > 0 &&
          parameters.productionRate > parameters.annualDemand,
      )
    }

    if (parameters.model === "inflation") {
      requiredFields.push(
        typeof parameters.inflationConfig?.monthlyInflationRate === "number" &&
          parameters.inflationConfig?.monthlyInflationRate > 0,
        parameters.inflationConfig?.affectsOrderingCost ||
          parameters.inflationConfig?.affectsHoldingCost ||
          parameters.inflationConfig?.affectsPurchasePrice,
      )

      if (parameters.inflationConfig?.includeExchangeRate) {
        requiredFields.push(
          typeof parameters.inflationConfig?.exchangeRateInitial === "number" &&
            parameters.inflationConfig?.exchangeRateInitial > 0,
          typeof parameters.inflationConfig?.exchangeRateCurrent === "number" &&
            parameters.inflationConfig?.exchangeRateCurrent > 0,
        )
      }
    }

    return requiredFields.every(Boolean)
  }

  return (
    <div className="space-y-8">
      {/* Header explicativo */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-primary">Configuración de tu Negocio</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Vamos a configurar los parámetros de tu inventario paso a paso. Cada variable tiene un nombre técnico que
          usaremos en los cálculos.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Panel principal de configuración */}
        <Card className="shadow-lg border-primary/20 bg-card">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/80 pb-4 border-b border-primary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center text-lg">
                <Calculator className="h-5 w-5 mr-2 text-primary-foreground" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                  Parámetros del Modelo
                </span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="text-white hover:bg-white/20"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Ayuda</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Selección del modelo */}
            <div className="space-y-3">
              <Label htmlFor="model" className="text-sm font-medium">
                Tipo de Modelo de Inventario
              </Label>
              <Select value={parameters.model} onValueChange={handleModelChange}>
                <SelectTrigger id="model" className="w-full">
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico (EOQ) - Compras a proveedores</SelectItem>
                  <SelectItem value="discount">Con Descuentos - Precios por volumen</SelectItem>
                  <SelectItem value="production">Producción (EPQ) - Fabricas tus productos</SelectItem>
                  <SelectItem value="inflation">Inflación - Análisis con inflación y devaluación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            {/* Variables del modelo */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-primary">Variables del Modelo</h3>

              {/* Costo de ordenar - S */}
              <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="orderCost" className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-primary text-white">
                      S
                    </Badge>
                    Costo de hacer un pedido
                  </Label>
                  <span className="text-xs text-muted-foreground">Variable: S</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>¿Qué incluye?</strong> Tiempo del empleado, llamadas, emails, papeleo, recepción.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong> Restaurante: $50-100 | Tienda: $75-150 | Farmacia: $100-200
                </div>
                <Input
                  id="orderCost"
                  name="orderCost"
                  type="number"
                  value={parameters.orderCost === undefined ? "" : parameters.orderCost}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 20"
                />
              </div>

              {/* Demanda anual - D */}
              <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="annualDemand" className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-primary text-white">
                      D
                    </Badge>
                    Demanda anual (unidades)
                  </Label>
                  <span className="text-xs text-muted-foreground">Variable: D</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>¿Cómo calcularlo?</strong> Ventas del año pasado o estimación: ventas mensuales × 12.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong> 200 quintales/mes × 12 = 2400 quintales/año | Celulares: 240/año
                </div>
                <Input
                  id="annualDemand"
                  name="annualDemand"
                  type="number"
                  value={parameters.annualDemand === undefined ? "" : parameters.annualDemand}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 2400"
                />
              </div>

              {/* Costo de mantener - H */}
              <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="holdingCost" className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-primary text-white">
                      H
                    </Badge>
                    Costo de almacenaje por unidad/mes
                  </Label>
                  <span className="text-xs text-muted-foreground">Variable: H</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>¿Qué incluye?</strong> Renta, electricidad, seguridad, productos vencidos/dañados{" "}
                  <strong>por mes</strong>.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Importante:</strong> Este es el costo mensual de mantener una unidad en inventario
                </div>
                <Input
                  id="holdingCost"
                  name="holdingCost"
                  type="number"
                  value={parameters.holdingCost === undefined ? "" : parameters.holdingCost}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 2"
                />
              </div>

              {/* Precio unitario - C */}
              <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unitPrice" className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-primary text-white">
                      C
                    </Badge>
                    Precio unitario de compra
                  </Label>
                  <span className="text-xs text-muted-foreground">Variable: C</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Precio que pagas al proveedor</strong> por cada unidad.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong> Quintal: Bs. 600 | Smartphone: $400 | Camiseta: $8
                </div>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  value={parameters.unitPrice === undefined ? "" : parameters.unitPrice}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 600"
                />
              </div>

              {/* Tiempo de entrega - L */}
              <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="leadTime" className="text-sm font-medium flex items-center">
                    <Badge variant="outline" className="mr-2 bg-primary text-white">
                      L
                    </Badge>
                    Tiempo de entrega (días)
                  </Label>
                  <span className="text-xs text-muted-foreground">Variable: L</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Días desde que haces el pedido hasta que lo recibes</strong> listo para vender.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong> Local: 1-3 días | Nacional: 5-10 días | Importación: 15-30 días
                </div>
                <Input
                  id="leadTime"
                  name="leadTime"
                  type="number"
                  value={parameters.leadTime === undefined ? "" : parameters.leadTime}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 7"
                />
              </div>

              {/* Tasa de producción - R (solo para modelo de producción) */}
              {parameters.model === "production" && (
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="productionRate" className="text-sm font-medium flex items-center">
                      <Badge variant="outline" className="mr-2 bg-primary text-white">
                        R
                      </Badge>
                      Capacidad de producción anual
                    </Label>
                    <span className="text-xs text-muted-foreground">Variable: R</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Máximo que puedes producir al año</strong> trabajando a capacidad completa.
                  </p>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <strong>Debe ser mayor a tu demanda (D)</strong> para que el modelo funcione
                  </div>
                  <Input
                    id="productionRate"
                    name="productionRate"
                    type="number"
                    value={parameters.productionRate === undefined ? "" : parameters.productionRate}
                    onChange={handleInputChange}
                    className="focus-visible:ring-primary"
                    placeholder="Ej: 2000"
                  />
                  {parameters.productionRate <= parameters.annualDemand && parameters.productionRate > 0 && (
                    <p className="text-xs text-red-500">
                      ⚠️ La capacidad de producción debe ser mayor a la demanda anual
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Configuración de inflación (solo para modelo de inflación) */}
            {parameters.model === "inflation" && (
              <div className="space-y-4">
                <Separator className="my-2" />
                <h3 className="text-sm font-medium text-primary">Configuración de Inflación</h3>
                <p className="text-xs text-muted-foreground">
                  Configura cómo la inflación y devaluación afectan tus costos mes a mes.
                </p>

                {/* Tasa de inflación mensual */}
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inflationRate" className="text-sm font-medium flex items-center">
                      <Badge variant="outline" className="mr-2 bg-primary text-white">
                        %
                      </Badge>
                      Inflación mensual (%)
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Porcentaje de aumento mensual</strong> en los costos debido a la inflación.
                  </p>
                  <Input
                    id="inflationRate"
                    type="number"
                    step="0.01"
                    value={
                      parameters.inflationConfig?.monthlyInflationRate === undefined
                        ? ""
                        : parameters.inflationConfig?.monthlyInflationRate
                    }
                    onChange={(e) => {
                      const value = e.target.value
                      setParameters({
                        ...parameters,
                        inflationConfig: {
                          ...parameters.inflationConfig,
                          monthlyInflationRate: value === "" ? undefined : Number.parseFloat(value) || 0,
                          affectsOrderingCost: parameters.inflationConfig?.affectsOrderingCost || false,
                          affectsHoldingCost: parameters.inflationConfig?.affectsHoldingCost || false,
                          affectsPurchasePrice: parameters.inflationConfig?.affectsPurchasePrice || false,
                          includeExchangeRate: parameters.inflationConfig?.includeExchangeRate || false,
                        },
                      })
                    }}
                    className="focus-visible:ring-primary"
                    placeholder="Ej: 3.65"
                  />
                </div>

                {/* Qué costos afecta la inflación */}
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                  <h4 className="text-sm font-medium">¿Qué costos afecta la inflación?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="affects-ordering"
                        checked={parameters.inflationConfig?.affectsOrderingCost || false}
                        onCheckedChange={(checked) => {
                          setParameters({
                            ...parameters,
                            inflationConfig: {
                              ...parameters.inflationConfig,
                              affectsOrderingCost: checked,
                              monthlyInflationRate: parameters.inflationConfig?.monthlyInflationRate || 0,
                              affectsHoldingCost: parameters.inflationConfig?.affectsHoldingCost || false,
                              affectsPurchasePrice: parameters.inflationConfig?.affectsPurchasePrice || false,
                              includeExchangeRate: parameters.inflationConfig?.includeExchangeRate || false,
                            },
                          })
                        }}
                      />
                      <Label htmlFor="affects-ordering" className="text-sm">
                        Costo de hacer pedidos (S) - Sueldos, llamadas, papeleo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="affects-holding"
                        checked={parameters.inflationConfig?.affectsHoldingCost || false}
                        onCheckedChange={(checked) => {
                          setParameters({
                            ...parameters,
                            inflationConfig: {
                              ...parameters.inflationConfig,
                              affectsHoldingCost: checked,
                              monthlyInflationRate: parameters.inflationConfig?.monthlyInflationRate || 0,
                              affectsOrderingCost: parameters.inflationConfig?.affectsOrderingCost || false,
                              affectsPurchasePrice: parameters.inflationConfig?.affectsPurchasePrice || false,
                              includeExchangeRate: parameters.inflationConfig?.includeExchangeRate || false,
                            },
                          })
                        }}
                      />
                      <Label htmlFor="affects-holding" className="text-sm">
                        Costo de almacenaje (H) - Renta, electricidad, seguros
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="affects-purchase"
                        checked={parameters.inflationConfig?.affectsPurchasePrice || false}
                        onCheckedChange={(checked) => {
                          setParameters({
                            ...parameters,
                            inflationConfig: {
                              ...parameters.inflationConfig,
                              affectsPurchasePrice: checked,
                              monthlyInflationRate: parameters.inflationConfig?.monthlyInflationRate || 0,
                              affectsOrderingCost: parameters.inflationConfig?.affectsOrderingCost || false,
                              affectsHoldingCost: parameters.inflationConfig?.affectsHoldingCost || false,
                              includeExchangeRate: parameters.inflationConfig?.includeExchangeRate || false,
                            },
                          })
                        }}
                      />
                      <Label htmlFor="affects-purchase" className="text-sm">
                        Precio de compra (C) - Lo que pagas al proveedor
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Configuración de tipo de cambio */}
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-exchange"
                      checked={parameters.inflationConfig?.includeExchangeRate || false}
                      onCheckedChange={(checked) => {
                        setParameters({
                          ...parameters,
                          inflationConfig: {
                            ...parameters.inflationConfig,
                            includeExchangeRate: checked,
                            monthlyInflationRate: parameters.inflationConfig?.monthlyInflationRate || 0,
                            affectsOrderingCost: parameters.inflationConfig?.affectsOrderingCost || false,
                            affectsHoldingCost: parameters.inflationConfig?.affectsHoldingCost || false,
                            affectsPurchasePrice: parameters.inflationConfig?.affectsPurchasePrice || false,
                          },
                        })
                      }}
                    />
                    <Label htmlFor="include-exchange" className="text-sm font-medium">
                      Incluir devaluación del tipo de cambio
                    </Label>
                  </div>

                  {parameters.inflationConfig?.includeExchangeRate && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <Label htmlFor="initial-rate" className="text-xs font-medium">
                          Tipo de cambio inicial
                        </Label>
                        <Input
                          id="initial-rate"
                          type="number"
                          step="0.01"
                          value={
                            parameters.inflationConfig?.exchangeRateInitial === undefined
                              ? ""
                              : parameters.inflationConfig?.exchangeRateInitial
                          }
                          onChange={(e) => {
                            const value = e.target.value
                            setParameters({
                              ...parameters,
                              inflationConfig: {
                                ...parameters.inflationConfig!,
                                exchangeRateInitial: value === "" ? undefined : Number.parseFloat(e.target.value) || 0,
                              },
                            })
                          }}
                          className="focus-visible:ring-primary"
                          placeholder="Ej: 6.96"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-rate" className="text-xs font-medium">
                          Tipo de cambio actual
                        </Label>
                        <Input
                          id="current-rate"
                          type="number"
                          step="0.01"
                          value={
                            parameters.inflationConfig?.exchangeRateCurrent === undefined
                              ? ""
                              : parameters.inflationConfig?.exchangeRateCurrent
                          }
                          onChange={(e) => {
                            const value = e.target.value
                            setParameters({
                              ...parameters,
                              inflationConfig: {
                                ...parameters.inflationConfig!,
                                exchangeRateCurrent: value === "" ? undefined : Number.parseFloat(e.target.value) || 0,
                              },
                            })
                          }}
                          className="focus-visible:ring-primary"
                          placeholder="Ej: 16.50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Niveles de descuento para modelo con descuentos */}
            {parameters.model === "discount" && (
              <div className="space-y-4">
                <Separator className="my-2" />
                <h3 className="text-sm font-medium text-primary">Niveles de Descuento</h3>
                <p className="text-xs text-muted-foreground">
                  Configura los precios especiales que te ofrece tu proveedor por comprar en mayor cantidad.
                </p>
                <div className="grid gap-4">
                  {parameters.discountLevels?.map((level, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${index}`} className="text-xs font-medium">
                          Cantidad mínima
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          value={level.quantity}
                          onChange={(e) => {
                            const newLevels = [...parameters.discountLevels!]
                            newLevels[index].quantity = Number.parseFloat(e.target.value) || 0
                            setParameters({
                              ...parameters,
                              discountLevels: newLevels,
                            })
                          }}
                          className="focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`price-${index}`} className="text-xs font-medium">
                          Precio unitario
                        </Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          value={level.price}
                          onChange={(e) => {
                            const newLevels = [...parameters.discountLevels!]
                            newLevels[index].price = Number.parseFloat(e.target.value) || 0
                            setParameters({
                              ...parameters,
                              discountLevels: newLevels,
                            })
                          }}
                          className="focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLevels = [...(parameters.discountLevels || [])]
                        newLevels.push({ quantity: 0, price: 0 })
                        setParameters({
                          ...parameters,
                          discountLevels: newLevels,
                        })
                      }}
                    >
                      Añadir nivel
                    </Button>
                    {parameters.discountLevels && parameters.discountLevels.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newLevels = [...parameters.discountLevels!]
                          newLevels.pop()
                          setParameters({
                            ...parameters,
                            discountLevels: newLevels,
                          })
                        }}
                      >
                        Eliminar último
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Configuraciones adicionales */}
            <div className="flex items-center space-x-2">
              <Switch id="show-details" checked={showDetails} onCheckedChange={setShowDetails} />
              <Label htmlFor="show-details" className="text-sm">
                Mostrar cálculos detallados en el simulador
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Panel de resumen y acciones */}
        <div className="space-y-6">
          {/* Resumen de configuración */}
          <Card className="shadow-lg border-primary/20 bg-card">
            <CardHeader className="bg-muted pb-4 border-b border-primary/20">
              <CardTitle className="text-primary flex items-center">
                {isConfigurationComplete() ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <Calculator className="h-5 w-5 mr-2" />
                )}
                Resumen de Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modelo:</span>
                      <Badge variant="outline">
                        {parameters.model === "basic" && "EOQ Básico"}
                        {parameters.model === "discount" && "Con Descuentos"}
                        {parameters.model === "production" && "Producción (EPQ)"}
                        {parameters.model === "inflation" && "Análisis de Inflación"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">S (Costo pedido):</span>
                      <span className="font-medium">${parameters.orderCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">D (Demanda anual):</span>
                      <span className="font-medium">{parameters.annualDemand?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">H (Costo almacén/mes):</span>
                      <span className="font-medium">${parameters.holdingCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">C (Costo compra):</span>
                      <span className="font-medium">${parameters.unitPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">L (Tiempo entrega):</span>
                      <span className="font-medium">{parameters.leadTime} días</span>
                    </div>
                  </div>
                </div>

                {parameters.model === "production" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">R (Capacidad producción):</span>
                    <span className="font-medium">{parameters.productionRate?.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado de configuración:</span>
                    {isConfigurationComplete() ? (
                      <Badge className="bg-green-500">Completa</Badge>
                    ) : (
                      <Badge variant="outline">Incompleta</Badge>
                    )}
                  </div>

                  {!isConfigurationComplete() && (
                    <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="font-medium text-yellow-800 mb-1">Campos faltantes:</p>
                      <ul className="list-disc list-inside space-y-1 text-yellow-700">
                        {typeof parameters.orderCost !== "number" ||
                          (parameters.orderCost <= 0 && <li>Costo de pedido (S)</li>)}
                        {typeof parameters.annualDemand !== "number" ||
                          (parameters.annualDemand <= 0 && <li>Demanda anual (D)</li>)}
                        {typeof parameters.holdingCost !== "number" ||
                          (parameters.holdingCost <= 0 && <li>Costo de almacenaje (H)</li>)}
                        {typeof parameters.unitPrice !== "number" ||
                          (parameters.unitPrice <= 0 && <li>Costo de compra (C)</li>)}
                        {typeof parameters.leadTime !== "number" ||
                          (parameters.leadTime <= 0 && <li>Tiempo de entrega (L)</li>)}
                        {parameters.model === "production" && parameters.productionRate <= parameters.annualDemand && (
                          <li>Capacidad de producción (R) debe ser mayor a la demanda</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="space-y-4">
            <Button
              className="w-full shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                onCalculate()
                onContinue()
              }}
              size="lg"
              disabled={!isConfigurationComplete()}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Continuar al Simulador
            </Button>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={onCalculate}
              disabled={!isConfigurationComplete()}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Solo Calcular
            </Button>
          </div>

          {/* Fórmulas que se usarán */}
          <Card className="shadow-md border-primary/20 bg-card">
            <CardHeader className="bg-muted/50 pb-3 border-b border-primary/20">
              <CardTitle className="text-sm text-primary">Fórmulas que se aplicarán</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 text-xs">
                {parameters.model === "basic" && (
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-medium mb-1">Modelo EOQ Básico:</p>
                    <p className="font-mono">Q* = √(2 × D × S / H)</p>
                    <p className="text-muted-foreground mt-1">Donde Q* es la cantidad óptima de pedido</p>
                  </div>
                )}
                {parameters.model === "production" && (
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-medium mb-1">Modelo EPQ (Producción):</p>
                    <p className="font-mono">Q* = √(2 × D × K / H × (1 - D/R))</p>
                    <p className="text-muted-foreground mt-1">Considera la tasa de producción R</p>
                  </div>
                )}
                {parameters.model === "discount" && (
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-medium mb-1">Modelo con Descuentos:</p>
                    <p className="font-mono">Evalúa Q* para cada nivel de precio</p>
                    <p className="text-muted-foreground mt-1">Selecciona el menor costo total</p>
                  </div>
                )}
                {parameters.model === "inflation" && (
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-medium mb-1">Fórmula Clásica de Costo Total:</p>
                    <p className="font-mono text-sm">TC(Q) = SD/Q + CD + HQ/2</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Donde S=costo pedido, D=demanda, Q=cantidad, C=precio, H=costo almacén/mes
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">Analiza el impacto de la inflación mes a mes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
