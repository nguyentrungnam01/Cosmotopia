import { Card, CardContent } from "@/components/ui/card"

interface ColorPaletteProps {
  colors: string[]
  title: string
  description: string
}

export function ColorPalette({ colors, title, description }: ColorPaletteProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-100">
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm text-gray-800 mb-2">{title}</h4>
        <div className="flex gap-2 mb-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
