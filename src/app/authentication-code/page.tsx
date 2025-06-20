"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function AuthenticationCode() {
    const [code, setCode] = useState("")
    const [sendAgainTimer, setSendAgainTimer] = useState(60)
    const [wrongCode, setWrongCode] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setSendAgainTimer(old => {
                if (old > 0) return old -1
                return old
            })
        }, 1000)

        return () => {
            clearInterval(interval)
            setWrongCode(true)
        }
    }, [])

    function sendCode(){
        setWrongCode(true)
    }

    return (
        <div className="relative w-full max-w-[1440px] flex flex-col  items-center justify-center p-4">
            <div className="absolute top-0 flex items-center justify-between">
                <img src="/logo.png" alt="company logo" className="w-56 mt-4" />
            </div>
            <div className="w-full max-w-[560px] flex flex-col  items-start mt-8">
                <div className="mb-8">
                    <h1 className="font-semibold text-[40px] leading-[110%] text-[#313131] mb-1">Verify Authentication Code</h1>
                    <h2 className="font-normal text-[#313131] opacity-80">Enter the verification code we just sent to your email.
                    </h2>
                </div>

                <div className="w-full flex items-center justify-center mb-10 font-bold">
                    <InputOTP maxLength={6} className="text-[32px] text-[#077999] font-bold" spellCheck={false} value={code} onChange={(v) => setCode(v)}>
                        <InputOTPGroup className="mx-1 sm:mx-2" >
                            <InputOTPSlot index={0} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `} />
                        </InputOTPGroup>
                        <InputOTPGroup className="mx-1 sm:mx-2">
                            <InputOTPSlot index={1} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `} />
                        </InputOTPGroup>
                        <InputOTPGroup className="mx-1 sm:mx-2">
                            <InputOTPSlot index={2} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="mx-1 sm:mx-2">
                            <InputOTPSlot index={3} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `} />
                        </InputOTPGroup>
                        <InputOTPGroup className="mx-1 sm:mx-2">
                            <InputOTPSlot index={4} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `} />
                        </InputOTPGroup>
                        <InputOTPGroup className="mx-1 sm:mx-2">
                            <InputOTPSlot index={5} className={`w-10 h-10 xxs:w-14 xxs:h-14 xs:w-18 xs:h-18 text-lg xxs:text-xl xs:text-[32px] text-[#077999] ${wrongCode ? "border-[#F7492E]" : "border-[#A4A7AE]" } `}/>
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {wrongCode && (<p className="w-full text-center font-semibold text-[#F7492E] mb-10">Wrong code, please try again</p>)}

                <div className="w-full flex flex-col gap-4 mb-8">
                    <Button className="h-max w-full font-bold text-white text-xl leading-[100%] px-4 py-4 rounded-xl bg-[var(--primary-color)] cursor-pointer hover:opacity-0.8" disabled={code.length < 6} onClick={sendCode}>
                        Verify
                    </Button>
                </div>

                <div className="w-full">
                    <button className={`w-full font-semibold ${sendAgainTimer === 0 ? "text-[#077999] cursor-pointer" : "text-gray-500"}`} disabled={!(sendAgainTimer === 0)}>
                        Send code again
                        {sendAgainTimer != 0 && (<span className="font-medium"> - {sendAgainTimer}</span>)}
                    </button>
                </div>
            </div>
        </div>
    );
}
