"use client";

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const hireRequestSchema = z.object({
  roleTitle: z.string().min(1, "Role Title is required"),
  practiceArea: z.string().min(1, "Practice Area is required"),
  keyResponsibilities: z.string().min(1, "Key Responsibilities are required"),
  requiredSkills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  scheduleNeeds: z.enum(["Full-time", "Part-time"]),
})

type HireRequestForm = z.infer<typeof hireRequestSchema>

const PRACTICE_AREAS = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Radiology",
]

export default function SubmitHireRequestForm() {
  const [skillInput, setSkillInput] = useState("")
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<HireRequestForm>({
    resolver: zodResolver(hireRequestSchema),
    defaultValues: {
      requiredSkills: [],
    },
  })

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      const currentSkills = getValues("requiredSkills")
      if (!currentSkills.includes(skillInput.trim())) {
        setValue("requiredSkills", [...currentSkills, skillInput.trim()])
      }
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = getValues("requiredSkills")
    setValue(
      "requiredSkills",
      currentSkills.filter((s: string) => s !== skill)
    )
  }

  const onSubmit = (data: HireRequestForm) => {
    alert("Request submitted!\n" + JSON.stringify(data, null, 2))
    reset()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="roleTitle">Role Title</Label>
        <Input id="roleTitle" {...register("roleTitle")}
          placeholder="e.g. Medical Assistant" className="mt-1" />
        {errors.roleTitle && (
          <p className="text-destructive text-sm mt-1">{errors.roleTitle.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="practiceArea">Practice Area</Label>
        <Select onValueChange={v => setValue("practiceArea", v)}>
          <SelectTrigger id="practiceArea" className="mt-1">
            <SelectValue placeholder="Select an area" />
          </SelectTrigger>
          <SelectContent>
            {PRACTICE_AREAS.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.practiceArea && (
          <p className="text-destructive text-sm mt-1">{errors.practiceArea.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="keyResponsibilities">Key Responsibilities</Label>
        <Textarea id="keyResponsibilities" {...register("keyResponsibilities")}
          placeholder="Describe the main duties..." className="mt-1 min-h-[90px]" />
        {errors.keyResponsibilities && (
          <p className="text-destructive text-sm mt-1">{errors.keyResponsibilities.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="requiredSkills">Required Skills</Label>
        <Input
          id="requiredSkills"
          placeholder="Type a skill and press Enter"
          className="mt-1"
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {getValues("requiredSkills").map((skill: string) => (
            <span
              key={skill}
              className="inline-flex items-center rounded bg-primary/10 text-primary px-3 py-1 text-sm font-medium cursor-pointer hover:bg-primary/20"
              onClick={() => handleRemoveSkill(skill)}
            >
              {skill} <span className="ml-2 text-xs">×</span>
            </span>
          ))}
        </div>
        {errors.requiredSkills && (
          <p className="text-destructive text-sm mt-1">{errors.requiredSkills.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="scheduleNeeds">Schedule Needs</Label>
        <Select onValueChange={v => setValue("scheduleNeeds", v as "Full-time" | "Part-time") }>
          <SelectTrigger id="scheduleNeeds" className="mt-1">
            <SelectValue placeholder="Select schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
          </SelectContent>
        </Select>
        {errors.scheduleNeeds && (
          <p className="text-destructive text-sm mt-1">{errors.scheduleNeeds.message}</p>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full mt-4">
        Submit Request
      </Button>
    </form>
  )
} 