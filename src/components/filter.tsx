"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, SlidersVertical } from "lucide-react"

export default function Filter() {
  const [availability, setAvailability] = useState({
    fullTime: true,
    partTime: false,
    onDemand: false,
  })
  const [compensation, setCompensation] = useState([1500, 4500])
  const [experience, setExperience] = useState(1)

  const handleAvailabilityChange = (type: keyof typeof availability) => {
    setAvailability((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const incrementExperience = () => {
    setExperience((prev) => prev + 1)
  }

  const decrementExperience = () => {
    setExperience((prev) => Math.max(0, prev - 1))
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center gap-2 border-[1px] border-[#A4A7AE] rounded-md bg-white text-black px-8 py-2 cursor-pointer">
        <SlidersVertical size={16} />
          Filters
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[400px] p-4">
        <div className="mt-4 space-y-6">
          <div className="space-y-3 mb-8">
            <Label className="text-base font-semibold text-gray-900">Location</Label>
            <Select>
              <SelectTrigger className="w-full bg-[#F7FBFF] cursor-pointer">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 mb-8">
            <Label className="text-base font-semibold text-gray-900">Availability</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full-time"
                  checked={availability.fullTime}
                  onCheckedChange={() => handleAvailabilityChange("fullTime")}
                  className="data-[state=checked]:bg-[var(--primary-color)] border-1 border-gray-300 data-[state=checked]:border-0 cursor-pointer" 
                />
                <Label htmlFor="full-time" className="text-md font-normal">
                  Full-Time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="part-time"
                  checked={availability.partTime}
                  onCheckedChange={() => handleAvailabilityChange("partTime")}
                  className="data-[state=checked]:bg-[var(--primary-color)] border-1 border-gray-300 data-[state=checked]:border-0 cursor-pointer" 
                />
                <Label htmlFor="part-time" className="text-md font-normal">
                  Part-Time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-demand"
                  checked={availability.onDemand}
                  onCheckedChange={() => handleAvailabilityChange("onDemand")}
                  className="data-[state=checked]:bg-[var(--primary-color)] border-1 border-gray-300 data-[state=checked]:border-0 cursor-pointer" 
                />
                <Label htmlFor="on-demand" className="text-md font-normal">
                  On-Demand
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <Label className="text-base font-semibold text-gray-900">Monthly Compensation</Label>
            <div className="space-y-4">
              <div className="text-sm font-medium">
                ${compensation[0].toLocaleString()} — ${compensation[1].toLocaleString()}
              </div>
              <Slider
                value={compensation}
                onValueChange={setCompensation}
                max={10000}
                min={1000}
                step={100}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-900">Years of Experience</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-5 w-5 bg-blue-100 cursor-pointer rounded-[2px] border-2 border-[var(--primary-color)] hover:border-[var(--primary-color)]"
                onClick={decrementExperience}
                disabled={experience <= 0}
              >
                <Minus className="h-4 w-4" fill="black"/>
              </Button>
              <div className="flex-1 text-center">
                <span className="text-lg font-bold">{experience}</span>
              </div>
              <Button variant="outline" size="icon"                 className="h-5 w-5 bg-blue-100 cursor-pointer rounded-[2px] border-2 border-[var(--primary-color)] hover:border-[var(--primary-color)]" onClick={incrementExperience}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
