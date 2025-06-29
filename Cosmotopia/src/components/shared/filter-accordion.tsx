import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterItem {
  id: string
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  content?: React.ReactNode
}

export interface FilterAccordionProps {
  items: FilterItem[]
  className?: string
}

export function FilterAccordion({ items, className }: FilterAccordionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map(({ id, title, icon: Icon, content }) => {
        const isOpen = openItems[id]
        return (
          <div
            key={id}
            className="overflow rounded-xl bg-white shadow-lg filter drop-shadow-[0px_2px_12px_rgba(20,20,43,0.08)]"
          >
            <button
              type="button"
              onClick={() => toggleItem(id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl bg-white p-3 text-left transition-all hover:bg-purple-50",
                isOpen ? "text-purple-600" : "text-gray-700 hover:text-purple-600"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isOpen ? "text-purple-600" : "text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "font-montserrat text-base font-medium",
                    isOpen ? "text-purple-600" : "text-gray-700"
                  )}
                >
                  {title}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isOpen ? "text-purple-600 rotate-180" : "text-gray-600"
                )}
              />
            </button>
            {content && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 pb-4" : "max-h-0"
                )}
              >
                <div className="px-4 py-2">{content}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
