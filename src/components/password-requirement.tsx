import { CircleCheck, CircleX } from "lucide-react"

export default function PasswordRequirement({ text, isCompliant }: {
    text: string
    isCompliant: boolean
}) {
    return (
        <div className={`flex items-center gap-1 p-[2px] px-2 font-medium text-xs ${isCompliant ? "text-[#027A48]" : "text-[#343C44]"} ${isCompliant ? "bg-[#ECFDF3]" : "bg-[#343C440D]"} rounded-full`}>
            {isCompliant ? <CircleCheck size={12} color="#027A48" /> : <CircleX size={12} />}
            {text}
        </div>
    )
}