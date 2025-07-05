"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import type { Example, Category } from "@/lib/types"

interface ExamplesViewProps {
  examples: Example[]
  onApplyExample: (example: Example) => void
}

export default function ExamplesView({ examples, onApplyExample }: ExamplesViewProps) {
  const [category, setCategory] = useState<Category>("all")

  const filteredExamples = category === "all" ? examples : examples.filter((example) => example.category === category)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="all" value={category} onValueChange={(value) => setCategory(value as Category)}>
        <TabsList className="w-full max-w-2xl h-12 p-1.5 mx-auto grid grid-cols-5 rounded-full bg-muted/60 backdrop-blur-sm shadow-xl border border-primary/10">
          <TabsTrigger
            value="all"
            className="h-full py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 
            data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
            data-[state=active]:scale-105 data-[state=active]:font-semibold
            hover:bg-muted/80 hover:text-primary/90"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="h-full py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 
            data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
            data-[state=active]:scale-105 data-[state=active]:font-semibold
            hover:bg-muted/80 hover:text-primary/90"
          >
            Alimentos
          </TabsTrigger>
          <TabsTrigger
            value="electronics"
            className="h-full py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 
            data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
            data-[state=active]:scale-105 data-[state=active]:font-semibold
            hover:bg-muted/80 hover:text-primary/90"
          >
            Electrónicos
          </TabsTrigger>
          <TabsTrigger
            value="textiles"
            className="h-full py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 
            data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
            data-[state=active]:scale-105 data-[state=active]:font-semibold
            hover:bg-muted/80 hover:text-primary/90"
          >
            Textiles
          </TabsTrigger>
          <TabsTrigger
            value="inflation"
            className="h-full py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 
            data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
            data-[state=active]:scale-105 data-[state=active]:font-semibold
            hover:bg-muted/80 hover:text-primary/90"
          >
            Inflación
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredExamples.map((example, index) => (
          <motion.div key={index} variants={item}>
            <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">{example.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {example.category === "food" && "Alimentos"}
                      {example.category === "electronics" && "Electrónicos"}
                      {example.category === "textiles" && "Textiles"}
                      {example.category === "inflation" && "Inflación"}
                    </Badge>
                  </div>
                  <Badge className="bg-blue-800">
                    {example.parameters.model === "basic" && "EOQ Básico"}
                    {example.parameters.model === "discount" && "Con Descuentos"}
                    {example.parameters.model === "production" && "Producción (EPQ)"}
                    {example.parameters.model === "inflation" && "Análisis Inflación"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">{example.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 bg-muted p-3 rounded-lg">
                    <div className="text-muted-foreground text-xs">Demanda anual:</div>
                    <div className="text-right font-medium">
                      {example.parameters.annualDemand.toLocaleString()} unidades
                    </div>

                    <div className="text-muted-foreground text-xs">Precio unitario:</div>
                    <div className="text-right font-medium">${example.parameters.unitPrice}</div>

                    <div className="text-muted-foreground text-xs">Tiempo de entrega:</div>
                    <div className="text-right font-medium">{example.parameters.leadTime} días</div>
                  </div>
                  <div className="bg-primary/20 p-3 rounded-lg mt-4">
                    <p className="text-xs italic">{example.insights}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button className="w-full shadow-sm" onClick={() => onApplyExample(example)}>
                  Aplicar Ejemplo
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
