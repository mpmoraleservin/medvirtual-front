"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import PasswordRequirement from "@/components/password-requirement";
import { isPasswordCompliant } from "@/utils/validators";
import { useViewportStore } from "@/stores/viewport";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Signup() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const { viewport, setViewport } = useViewportStore()

    function isInfoComplete(): boolean {
        const pwd = isPasswordCompliant(password);

        return (
            firstName.trim() !== "" &&
            lastName.trim() !== "" &&
            jobTitle.trim() !== "" &&
            companyName.trim() !== "" &&
            email.trim() !== "" &&
            pwd &&
            agreedToTerms
        );
    }

    function passwordComplianceProgess(password: string): number {
        let value = 0;
        if (/[A-Z]/.test(password)) value += 25
        if (/[0-9]/.test(password)) value += 25
        if (/[!@#$%^&*]/.test(password)) value += 25
        if (password.length >= 8) value += 25

        return value
    }

    function getViewportWidth() {
        return window.innerWidth
    }

    useEffect(() => {
        setViewport(getViewportWidth())
        window.addEventListener("resize", () => {
            setViewport(getViewportWidth())
        })
    }, [setViewport])

    return (
        <div className="relative w-full max-w-[1440px] flex flex-col  items-center p-4">
            <div className="flex items-center justify-between mb-16">
                <img src="/logo.png" alt="company logo" className="w-56" />
                {viewport < 640 ? null : <a href="/login" className="absolute top-5 right-5 h-fit font-bold text-primary-foreground text-xl leading-[100%] px-6 py-4 rounded-xl bg-primary cursor-pointer">
                    Log In
                </a>}
            </div>
            <div className="w-full max-w-[560px] flex flex-col  items-start">
                <div className="mb-8">
                    <h1 className="font-semibold text-[40px] text-foreground">Sign Up</h1>
                    <h2 className="font-normal text-foreground opacity-80">{'Let\'s get you all set up so you can access your personal account.'}</h2>
                </div>

                <div className="w-full flex flex-col sm:flex-row sm:gap-6">
                    <div className="w-full mb-4">
                        <Label htmlFor="first_name" className="font-medium text-foreground mb-1">First Name</Label>
                        <Input id="first_name" type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground" />
                    </div>
                    <div className="w-full mb-4">
                        <Label htmlFor="last_name" className="font-medium text-foreground mb-1">Last Name</Label>
                        <Input id="last_name" type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground" />
                    </div>
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:gap-6">
                    <div className="w-full mb-4">
                        <Label htmlFor="job_title" className="font-medium text-foreground mb-1">Job Title</Label>
                        <Input id="job_title" type="text" placeholder="Talent Recruiter" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground" />
                    </div>
                    <div className="w-full mb-4">
                        <Label htmlFor="company_name" className="font-medium text-foreground mb-1">Company Name</Label>
                        <Input id="company_name" type="text" placeholder="MedVirtual" value={companyName} onChange={e => setCompanyName(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground" />
                    </div>
                </div>

                <div className="w-full mb-4">
                    <Label htmlFor="email" className="font-medium text-foreground mb-1">Email</Label>
                    <Input id="email" type="email" placeholder="john@medvirtual.com" value={email} onChange={e => setEmail(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground" />
                </div>

                <div className="w-full mb-2">
                    <Label htmlFor="password" className="font-medium text-foreground mb-1">Password</Label>
                    <div className="relative flex items-center justify-center">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground outline-primary" />
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

                <Progress value={passwordComplianceProgess(password)} className={`h-1 mb-2 ${passwordComplianceProgess(password) == 100 ? "[&>div]:bg-chart-2" : "[&>div]:bg-chart-5"}`} />
                <div className="w-full flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-foreground opacity-70 ">Your password must contain:</p>
                    <span className="text-xs text-foreground opacity-70 font-bold">{passwordComplianceProgess(password) == 100 ? "Strong" : "Weak"}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    <PasswordRequirement text="At least 1 uppercase letter (A–Z)" isCompliant={/[A-Z]/.test(password)} />
                    <PasswordRequirement text="At least 1 number (0–9)" isCompliant={/[0-9]/.test(password)} />
                    <PasswordRequirement text="At least 8 characteres" isCompliant={password.length >= 8} />
                    <PasswordRequirement text="At least 1 special character (! @ # $ % ^ & *)" isCompliant={/[!@#$%^&*]/.test(password)} />
                </div>

                <div className="w-full flex items-center justify-between mb-10">
                    <div className="flex items-center justify-start gap-2">
                        <Checkbox id="remember" className="w-4 h-4 border-2 border-border cursor-pointer" checked={agreedToTerms} onCheckedChange={() => setAgreedToTerms(!agreedToTerms)} />
                        <Label htmlFor="remember" className="font-medium text-foreground text-sm cursor-pointer gap-1">I agree to the <a href="" className="m-0 cursor-pointer text-primary">Terms</a> and <a href="" className="m-0 cursor-pointer text-primary">Privacy Policies</a></Label>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4 mb-14">
                    <Button 
                        size="lg" 
                        className="w-full text-xl font-bold py-4 rounded-xl" 
                        disabled={!isInfoComplete()}
                    >
                        Sign Up
                    </Button>
                    {viewport < 640 ? (
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full text-xl font-bold py-4 rounded-xl" 
                            asChild
                        >
                            <a href="/login">Log in</a>
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
