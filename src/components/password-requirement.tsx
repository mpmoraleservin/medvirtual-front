import { CircleCheck, CircleX } from "lucide-react"

export default function PasswordRequirement({ text, isCompliant }: {
    text: string
    isCompliant: boolean
}) {
    return (
        <div className={`flex items-center gap-1 p-[2px] px-2 font-medium text-xs ${isCompliant ? "text-chart-2" : "text-muted-foreground"} ${isCompliant ? "bg-chart-2/20" : "bg-muted"} rounded-full`}>
            {isCompliant ? <CircleCheck size={12} className="text-chart-2" /> : <CircleX size={12} className="text-muted-foreground" />}
            {text}
        </div>
    )
}