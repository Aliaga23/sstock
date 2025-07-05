"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, X, Calculator, TrendingUp, Package, Clock } from "lucide-react"

interface HelpGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-primary text-white">
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Guía para Calcular tus Parámetros
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="cost-order" className="w-full">
            <TabsList className="w-full rounded-none border-b grid grid-cols-2 md:grid-cols-4 bg-transparent">
              <TabsTrigger value="cost-order" className="rounded-none py-3 text-xs">
                💰 Costo Pedido
              </TabsTrigger>
              <TabsTrigger value="demand" className="rounded-none py-3 text-xs">
                📊 Demanda
              </TabsTrigger>
              <TabsTrigger value="holding" className="rounded-none py-3 text-xs">
                🏪 Almacenaje
              </TabsTrigger>
              <TabsTrigger value="examples" className="rounded-none py-3 text-xs">
                💡 Ejemplos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cost-order" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  ¿Cómo calcular el Costo de hacer un Pedido?
                </h3>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Incluye estos costos:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">
                        1
                      </Badge>
                      <div>
                        <strong>Tiempo del empleado:</strong> ¿Cuánto tiempo toma hacer el pedido?
                        <br />
                        Ejemplo: 2 horas × $15/hora = $30
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">
                        2
                      </Badge>
                      <div>
                        <strong>Comunicación:</strong> Llamadas, emails, WhatsApp
                        <br />
                        Ejemplo: $5-10 por pedido
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">
                        3
                      </Badge>
                      <div>
                        <strong>Recepción:</strong> Tiempo para recibir y verificar
                        <br />
                        Ejemplo: 1 hora × $15/hora = $15
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">
                        4
                      </Badge>
                      <div>
                        <strong>Papeleo:</strong> Facturas, registros, pagos
                        <br />
                        Ejemplo: $10-20 por pedido
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Cálculo rápido:</h4>
                  <p className="text-sm">
                    <strong>Tiempo total en horas × Costo por hora del empleado + Gastos adicionales</strong>
                  </p>
                  <p className="text-sm mt-2">Ejemplo: 3 horas × $15/hora + $20 gastos = $65 por pedido</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demand" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  ¿Cómo calcular tu Demanda Anual?
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Método 1: Datos históricos</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Revisa tus ventas del año pasado</li>
                      <li>• Suma todas las unidades vendidas</li>
                      <li>• Ajusta por crecimiento esperado</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Método 2: Estimación mensual</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Calcula tu venta promedio mensual</li>
                      <li>• Multiplica por 12 meses</li>
                      <li>• Considera temporadas altas/bajas</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Ejemplos por tipo de negocio:</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <strong>Restaurante (kg de arroz):</strong>
                      <p className="text-sm">20 kg/semana × 52 semanas = 1,040 kg/año</p>
                    </div>
                    <div>
                      <strong>Tienda de ropa (camisetas):</strong>
                      <p className="text-sm">50 piezas/mes × 12 meses = 600 piezas/año</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="holding" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  ¿Cómo calcular el Costo de Almacenaje?
                </h3>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Incluye estos costos anuales:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • <strong>Espacio:</strong> Renta del almacén o bodega
                    </li>
                    <li>
                      • <strong>Servicios:</strong> Luz, agua, internet
                    </li>
                    <li>
                      • <strong>Seguridad:</strong> Alarmas, cámaras, seguros
                    </li>
                    <li>
                      • <strong>Pérdidas:</strong> Productos vencidos, dañados, robados
                    </li>
                    <li>
                      • <strong>Capital:</strong> Dinero "dormido" en inventario
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Regla práctica simple:</h4>
                  <div>
                    <p className="text-sm">
                      <strong>Costo de almacenaje = 15% a 25% del precio del producto</strong>
                    </p>
                    <div className="grid md:grid-cols-3 gap-2 mt-2 text-sm text-black">
                      <div className="bg-white p-2 rounded">
                        <strong>Productos duraderos:</strong>
                        <br />
                        10-15% del precio
                      </div>
                      <div className="bg-white p-2 rounded">
                        <strong>Productos normales:</strong>
                        <br />
                        15-20% del precio
                      </div>
                      <div className="bg-white p-2 rounded">
                        <strong>Productos perecederos:</strong>
                        <br />
                        20-30% del precio
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-black">
                  <h4 className="font-medium mb-2">Ejemplo de cálculo:</h4>
                  <p className="text-sm">
                    Producto que cuesta $100:
                    <br />• Costo de almacenaje = $100 × 20% = $20 por año
                    <br />• Esto significa que cada producto te cuesta $20 al año mantenerlo en inventario
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Ejemplos Completos por Tipo de Negocio
                </h3>

                <div className="grid gap-4">
                  <div className="border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">🍕 Pizzería - Queso Mozzarella</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Costo de pedido:</strong> $80
                        <br />
                        <span className="text-muted-foreground">2 horas empleado + llamadas + recepción</span>
                      </div>
                      <div>
                        <strong>Demanda anual:</strong> 2,400 kg
                        <br />
                        <span className="text-muted-foreground">200 kg/mes × 12 meses</span>
                      </div>
                      <div>
                        <strong>Costo almacenaje:</strong> $2 por kg/año
                        <br />
                        <span className="text-muted-foreground">Refrigeración + pérdidas por vencimiento</span>
                      </div>
                      <div>
                        <strong>Precio unitario:</strong> $8 por kg
                        <br />
                        <span className="text-muted-foreground">Lo que pagas al proveedor</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">👕 Tienda de Ropa - Camisetas</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Costo de pedido:</strong> $120
                        <br />
                        <span className="text-muted-foreground">Tiempo de selección + negociación + papeleo</span>
                      </div>
                      <div>
                        <strong>Demanda anual:</strong> 800 piezas
                        <br />
                        <span className="text-muted-foreground">Promedio 65 piezas/mes</span>
                      </div>
                      <div>
                        <strong>Costo almacenaje:</strong> $3 por pieza/año
                        <br />
                        <span className="text-muted-foreground">Espacio + cambios de moda</span>
                      </div>
                      <div>
                        <strong>Precio unitario:</strong> $15 por pieza
                        <br />
                        <span className="text-muted-foreground">Precio de mayoreo</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">📱 Tienda de Electrónicos - Smartphones</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Costo de pedido:</strong> $200
                        <br />
                        <span className="text-muted-foreground">Verificaciones + importación + seguros</span>
                      </div>
                      <div>
                        <strong>Demanda anual:</strong> 240 teléfonos
                        <br />
                        <span className="text-muted-foreground">20 teléfonos/mes promedio</span>
                      </div>
                      <div>
                        <strong>Costo almacenaje:</strong> $60 por teléfono/año
                        <br />
                        <span className="text-muted-foreground">Seguridad + obsolescencia + capital</span>
                      </div>
                      <div>
                        <strong>Precio unitario:</strong> $400 por teléfono
                        <br />
                        <span className="text-muted-foreground">Precio de distribuidor</span>
                      </div>
                    </div>
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
