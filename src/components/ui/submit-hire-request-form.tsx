"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Create different schemas based on whether client selection is needed
const createHireRequestSchema = (showClientSelection: boolean) => {
  const baseSchema = {
    roleTitle: z.string().min(1, "Role Title is required"),
    practiceArea: z.string().min(1, "Practice Area is required"),
    keyResponsibilities: z.string().min(1, "Key Responsibilities are required"),
    requiredSkills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
    scheduleNeeds: z.enum(["Full-time", "Part-time"]),
  }

  if (showClientSelection) {
    return z.object({
      clientId: z.string().min(1, "Client selection is required"),
      ...baseSchema
    })
  }

  return z.object(baseSchema)
}

const PRACTICE_AREAS = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Radiology",
]

// Mock client data - in a real app this would come from an API
const CLIENTS = [
  { id: "1", name: "Dr. Sarah Johnson", practice: "Wellness Medical Center" },
  { id: "2", name: "Dr. Michael Chen", practice: "Community Health Clinic" },
  { id: "3", name: "Dr. Emily Rodriguez", practice: "Family Care Associates" },
  { id: "4", name: "Dr. James Wilson", practice: "Metro Medical Group" },
  { id: "5", name: "Dr. Lisa Thompson", practice: "Primary Care Partners" },
  { id: "6", name: "Dr. Robert Davis", practice: "Advanced Healthcare Solutions" },
  { id: "7", name: "Dr. Maria Garcia", practice: "Comprehensive Medical Center" },
  { id: "8", name: "Dr. David Brown", practice: "Elite Medical Associates" },
]

interface SubmitHireRequestFormProps {
  showClientSelection?: boolean;
  hideSubmitButton?: boolean;
  onSubmit?: (data: unknown) => void;
}

const SubmitHireRequestForm = forwardRef(function SubmitHireRequestForm({ showClientSelection = false, hideSubmitButton = false, onSubmit }: SubmitHireRequestFormProps, ref) {
  const [skillInput, setSkillInput] = useState("")
  
  const schema = createHireRequestSchema(showClientSelection)
  type HireRequestForm = z.infer<typeof schema>
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<HireRequestForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      requiredSkills: [],
    },
  })

  const formRef = React.useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }));

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

  const handleFormSubmit = (data: HireRequestForm) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      if (showClientSelection && 'clientId' in data) {
        const selectedClient = CLIENTS.find(client => client.id === (data as HireRequestForm & { clientId: string }).clientId)
        alert("Request submitted!\n" + JSON.stringify({ ...data, client: selectedClient }, null, 2))
      } else {
        alert("Request submitted!\n" + JSON.stringify(data, null, 2))
      }
    }
    reset()
  }

  return (
    <form ref={formRef} className="max-w-2xl mx-auto w-full" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fila 1: Client | Role Title */}
        {showClientSelection && (
          <div>
            <Label htmlFor="clientId">Client *</Label>
            <Select onValueChange={v => setValue("clientId" as keyof HireRequestForm, v)}>
              <SelectTrigger id="clientId" className="mt-1 w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {CLIENTS.map(client => (
                  <SelectItem key={client.id} value={client.id} className="w-full">
                    {client.name} - {client.practice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showClientSelection && (errors as Record<string, { message?: string }>).clientId && (
              <p className="text-destructive text-sm mt-1">{(errors as Record<string, { message?: string }>).clientId.message}</p>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="roleTitle">Role Title</Label>
          <Input id="roleTitle" {...register("roleTitle")}
            placeholder="e.g. Medical Assistant" className="mt-1 w-full" />
          {errors.roleTitle && (
            <p className="text-destructive text-sm mt-1">{errors.roleTitle.message}</p>
          )}
        </div>
        {/* Fila 2: Practice Area | Schedule Needs */}
        <div>
          <Label htmlFor="practiceArea">Practice Area</Label>
          <Select onValueChange={v => setValue("practiceArea", v)}>
            <SelectTrigger id="practiceArea" className="mt-1 w-full">
              <SelectValue placeholder="Select an area" />
            </SelectTrigger>
            <SelectContent>
              {PRACTICE_AREAS.map(area => (
                <SelectItem key={area} value={area} className="w-full">{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.practiceArea && (
            <p className="text-destructive text-sm mt-1">{errors.practiceArea.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="scheduleNeeds">Schedule Needs</Label>
          <Select onValueChange={v => setValue("scheduleNeeds", v as "Full-time" | "Part-time") }>
            <SelectTrigger id="scheduleNeeds" className="mt-1 w-full">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time" className="w-full">Full-time</SelectItem>
              <SelectItem value="Part-time" className="w-full">Part-time</SelectItem>
            </SelectContent>
          </Select>
          {errors.scheduleNeeds && (
            <p className="text-destructive text-sm mt-1">{errors.scheduleNeeds.message}</p>
          )}
        </div>
        {/* Fila 3: Required Skills (col-span-2) */}
        <div className="md:col-span-2">
          <Label htmlFor="requiredSkills">Required Skills</Label>
          <Input
            id="requiredSkills"
            placeholder="Type a skill and press Enter"
            className="mt-1 w-full"
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
        {/* Fila 4: Key Responsibilities (col-span-2) */}
        <div className="md:col-span-2">
          <Label htmlFor="keyResponsibilities">Key Responsibilities</Label>
          <Textarea id="keyResponsibilities" {...register("keyResponsibilities")}
            placeholder="Describe the main duties..." className="mt-1 min-h-[90px] w-full" />
          {errors.keyResponsibilities && (
            <p className="text-destructive text-sm mt-1">{errors.keyResponsibilities.message}</p>
          )}
        </div>
        {/* Fila 5: Botón (col-span-2, centrado) */}
        {!hideSubmitButton && (
          <div className="md:col-span-2 flex justify-center">
            <Button type="submit" size="lg" className="w-full md:w-auto mt-4 md:mt-0">
              Submit Request
            </Button>
          </div>
        )}
      </div>
    </form>
  )
});

export default SubmitHireRequestForm; 