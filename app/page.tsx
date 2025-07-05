import type { Metadata } from "next"
import InventorySimulator from "@/components/inventory-simulator"

export const metadata: Metadata = {
  title: "SmartStock | Simulador de Gestión de Inventario",
  description:
    "Simulador de gestión de inventario que permite calcular la cantidad óptima de pedido utilizando diferentes modelos matemáticos.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <InventorySimulator />
    </main>
  )
}
