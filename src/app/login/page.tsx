"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { isValidEmail } from "@/utils/validators";
import { useViewportStore } from "@/stores/viewport";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { viewport, setViewport } = useViewportStore()

    const validateInputs = (email: string, password: string) => {
        return isValidEmail(email) && password.length > 8
    }

    function getViewportWidth() {
        return window.innerWidth
    }

    useEffect(() => {
        setViewport(getViewportWidth())
        window.addEventListener("resize", () => {
            setViewport(getViewportWidth())
        })
    }, [])

    return (
        <div className="relative w-full max-w-[1440px] flex flex-col  items-center p-4">
            <div className="flex items-center justify-between mb-16">
                <img src="/logo.png" alt="company logo" className="" />
                {viewport < 640 ? null : <a href="/signup" className="absolute top-5 right-5 h-fit font-bold text-white text-xl leading-[100%] px-6 py-4 rounded-xl bg-[var(--primary-color)] cursor-pointer">
                    Sign up
                </a>}
            </div>
            <div className="w-full max-w-[560px] flex flex-col  items-start">
                <div className="mb-8">
                    <h1 className="font-semibold text-[40px] text-[#313131]">Log In</h1>
                    <h2 className="font-normal text-[#313131] opacity-80">Let's get you all set up so you can access your personal account.
                    </h2>
                </div>
                <div className="w-full mb-4">
                    <Label htmlFor="email" className="font-medium color-[#0C1421] mb-1">Email</Label>
                    <Input id="email" type="email" placeholder="john@medvirtual.com" value={email} onChange={e => setEmail(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-[#D4D7E3] bg-[#F7FBFF] font-normal text-[#313131]" />
                </div>

                <div className="w-full mb-6">
                    <Label htmlFor="password" className="font-medium color-[#0C1421] mb-1">Password</Label>
                    <div className="relative flex items-center justify-center">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-[#D4D7E3] bg-[#F7FBFF] font-normal text-[#313131] outline-[var(--primary-color)]" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-7 w-7 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="w-full flex items-center justify-between mb-10">
                    <div className="flex items-center justify-start gap-2">
                        <Checkbox id="remember" className="w-4 h-4 border-2 border-[#313131] cursor-pointer" />
                        <Label htmlFor="remember" className="font-medium color-[#313131] cursor-pointer">Remember me</Label>
                    </div>

                    <a href="/password-recovery" className="font-medium text-[var(--primary-color)] text-sm">Forgot Password?</a>
                </div>

                <div className="w-full flex flex-col gap-4 mb-14">
                    <Button className="h-max w-full font-bold text-white text-xl leading-[100%] px-4 py-4 rounded-xl bg-[var(--primary-color)] cursor-pointer hover:opacity-0.8" disabled={!validateInputs(email, password)}>
                        Log In
                    </Button>
                    {viewport < 640 ? <a href="/signup" className="w-full text-center font-bold text-[var(--primary-color)] text-xl leading-[100%] px-6 py-4 rounded-xl bg-transparent cursor-pointer">
                        Sign up
                    </a> : null}
                </div>


                <div className="w-full flex items-center gap-4 text-sm font-normal text-[#313131] mb-14">
                    <Separator className="flex-1" /><span className="opacity-60">Or log in with</span><Separator className="flex-1" />
                </div>

                <Button className="h-max w-full font-semibold text-[#1A1C1E] text-sm leading-[100%] px-4 py-4 rounded-xl bg-transparent border-[1px] border-[#EFF0F6] cursor-pointer mb-2 hover:bg-gray-200">
                    <img src="/google.png" alt="google logo" />
                    Continue with Google
                </Button>

                <Button className="h-max w-full font-semibold text-[#1A1C1E] text-sm leading-[100%] px-4 py-4 rounded-xl bg-transparent border-[1px] border-[#EFF0F6] cursor-pointer hover:bg-gray-200 mb-8">
                    <img src="/facebook.png" alt="facebook logo" />
                    Continue with Facebook
                </Button>
            </div>
        </div>
    );
}
