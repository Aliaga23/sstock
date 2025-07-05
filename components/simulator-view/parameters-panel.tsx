"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, HelpCircle } from "lucide-react"
import type { ParameterConfig, ModelType } from "@/lib/types"
import HelpGuide from "@/components/help-guide"
import { useState } from "react"

interface ParametersPanelProps {
  parameters: ParameterConfig
  setParameters: (parameters: ParameterConfig) => void
  showDetails: boolean
  setShowDetails: (show: boolean) => void
  onCalculate: () => void
}

export default function ParametersPanel({
  parameters,
  setParameters,
  showDetails,
  setShowDetails,
  onCalculate,
}: ParametersPanelProps) {
  const [showHelp, setShowHelp] = useState(false)

  const handleModelChange = (value: string) => {
    setParameters({
      ...parameters,
      model: value as ModelType,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParameters({
      ...parameters,
      [name]: Number.parseFloat(value) || 0,
    })
  }

  return (
    <Card className="md:h-full shadow-lg border-primary/20 bg-card relative transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col overflow-auto sm:overflow-visible max-h-[calc(100vh-2rem)] md:max-h-none">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="bg-gradient-to-r from-muted to-muted/80 pb-4 border-b border-primary/20 relative z-10 sm:static sticky top-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center text-lg">
            <Calculator className="h-5 w-5 mr-2 text-primary-foreground" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
              Configuración de Parámetros
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)} className="text-white hover:bg-white/20">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Ayuda</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 sm:overflow-visible overflow-y-auto flex-grow">
        <div className="space-y-3">
          <Label htmlFor="model" className="text-sm font-medium">
            Modelo
          </Label>
          <Select value={parameters.model} onValueChange={handleModelChange}>
            <SelectTrigger id="model" className="w-full">
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Básico (EOQ)</SelectItem>
              <SelectItem value="discount">Con Descuentos</SelectItem>
              <SelectItem value="production">Producción (EPQ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-primary">Parámetros del Negocio</h3>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md hidden sm:inline-block">
              Con ejemplos prácticos
            </span>
          </div>

          <div className="grid gap-5">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                <Label htmlFor="orderCost" className="text-sm font-medium flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">💰</span>
                  Costo de hacer un pedido
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>¿Qué incluye?</strong> Tiempo del empleado para hacer el pedido, llamadas telefónicas, emails,
                  papeleo, recepción de mercancía, revisión de facturas.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Restaurante pequeño: $50-100 (tiempo del chef/gerente)</li>
                    <li>Tienda de ropa: $75-150 (empleado + revisión)</li>
                    <li>Farmacia: $100-200 (verificaciones adicionales)</li>
                  </ul>
                </div>
                <Input
                  id="orderCost"
                  name="orderCost"
                  type="number"
                  value={parameters.orderCost}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 100"
                />
              </div>

              <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                <Label htmlFor="annualDemand" className="text-sm font-medium flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">📊</span>
                  ¿Cuánto vendes al año?
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>¿Cómo calcularlo?</strong> Revisa tus ventas del año pasado o estima: ventas mensuales × 12
                  meses.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Cafetería: 50 kg café/mes = 600 kg/año</li>
                    <li>Tienda de celulares: 20 teléfonos/mes = 240/año</li>
                    <li>Panadería: 200 kg harina/mes = 2,400 kg/año</li>
                  </ul>
                </div>
                <Input
                  id="annualDemand"
                  name="annualDemand"
                  type="number"
                  value={parameters.annualDemand}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 1000 unidades"
                />
              </div>

              <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                <Label htmlFor="holdingCost" className="text-sm font-medium flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">🏪</span>
                  Costo de guardar cada producto por año
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>¿Qué incluye?</strong> Renta del espacio de almacén, electricidad, seguridad, seguros,
                  productos que se vencen o dañan.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Regla práctica:</strong> Entre 15% y 25% del precio del producto
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Producto de $100 → Costo de guardar: $15-25/año</li>
                    <li>Alimentos perecederos: hasta 30%</li>
                    <li>Productos duraderos: 10-15%</li>
                  </ul>
                </div>
                <Input
                  id="holdingCost"
                  name="holdingCost"
                  type="number"
                  value={parameters.holdingCost}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 10"
                />
              </div>

              <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                <Label htmlFor="unitPrice" className="text-sm font-medium flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">💵</span>
                  ¿Cuánto te cuesta cada producto?
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Precio que pagas al proveedor</strong> por cada unidad (sin incluir envío si ya está en el
                  costo de pedido).
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Café premium: $25/kg</li>
                    <li>Smartphone: $400 c/u</li>
                    <li>Camiseta: $8 c/u</li>
                  </ul>
                </div>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  value={parameters.unitPrice}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 50"
                />
              </div>

              <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                <Label htmlFor="leadTime" className="text-sm font-medium flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">⏰</span>
                  ¿Cuántos días tarda en llegar tu pedido?
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Tiempo desde que haces el pedido hasta que lo recibes</strong> en tu negocio, listo para
                  vender.
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <strong>Ejemplos típicos:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Proveedor local: 1-3 días</li>
                    <li>Proveedor nacional: 5-10 días</li>
                    <li>Importación: 15-30 días</li>
                  </ul>
                </div>
                <Input
                  id="leadTime"
                  name="leadTime"
                  type="number"
                  value={parameters.leadTime}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                  placeholder="Ej: 7 días"
                />
              </div>

              {parameters.model === "production" && (
                <div className="space-y-3 transition-all duration-200 hover:bg-muted/20 p-3 rounded-md border border-primary/10">
                  <Label htmlFor="productionRate" className="text-sm font-medium flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-md mr-2 text-xs">🏭</span>
                    ¿Cuánto puedes producir al año?
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Capacidad máxima de producción</strong> de tu taller, fábrica o cocina trabajando a tiempo
                    completo.
                  </p>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <strong>Ejemplos:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Panadería: 1,000 panes/día = 365,000/año</li>
                      <li>Taller de costura: 50 prendas/día = 18,250/año</li>
                      <li>Debe ser mayor a tu demanda anual</li>
                    </ul>
                  </div>
                  <Input
                    id="productionRate"
                    name="productionRate"
                    type="number"
                    value={parameters.productionRate}
                    onChange={handleInputChange}
                    className="focus-visible:ring-primary"
                    placeholder="Ej: 2000"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {parameters.model === "discount" && (
          <div className="space-y-4">
            <Separator className="my-2" />
            <h3 className="text-sm font-medium text-primary">Niveles de Descuento</h3>
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

        <Separator className="my-2" />

        <div className="flex items-center space-x-2">
          <Switch id="show-details" checked={showDetails} onCheckedChange={setShowDetails} />
          <Label htmlFor="show-details" className="text-sm">
            Mostrar detalles
          </Label>
        </div>

        <Button className="w-full mt-4 shadow-md transition-all hover:shadow-lg" onClick={onCalculate} size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          Calcular
        </Button>
      </CardContent>
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </Card>
  )
}
