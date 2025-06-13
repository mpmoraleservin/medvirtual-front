"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import PasswordRequirement from "@/components/password-requirement";
import { isPasswordCompliant } from "@/utils/validators";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function InviteSignup() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function isInfoComplete(): boolean {
    const pwd = isPasswordCompliant(password);

    return confirmPassword === password && pwd;
  }

  function passwordComplianceProgess(password: string): number {
    let value = 0;
    if (/[A-Z]/.test(password)) value += 25;
    if (/[0-9]/.test(password)) value += 25;
    if (/[!@#$%^&*]/.test(password)) value += 25;
    if (password.length >= 8) value += 25;

    return value;
  }

  return (
    <div className="relative w-full max-w-[1440px] flex flex-col  items-center p-4">
      <div className="flex items-center justify-between mb-16">
        <img src="/logo.png" alt="company logo" className="" />
      </div>
      <div className="w-full max-w-[560px] flex flex-col  items-start">
        <div className="mb-8">
          <h1 className="font-semibold text-[40px] text-[#313131] mb-4 leading-[110%]">
            Welcome to MedVirtual 👋
          </h1>
          <h2 className="text-[#414651] leading-[100%] font-semibold mb-4">
            {"You've been invited by Sarah Kim"}
          </h2>
          <h3 className="font-normal text-[#414651]">
            {
              "Set up your password to activate your MedVirtual account and start using the platform."
            }
          </h3>
        </div>

        <div className="w-full mb-2">
          <Label
            htmlFor="password"
            className="font-medium color-[#0C1421] mb-1"
          >
            Password
          </Label>
          <div className="relative flex items-center justify-center">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-5 rounded-lg border-[1px] border-[#D4D7E3] bg-[#F7FBFF] font-normal text-[#313131] outline-[var(--primary-color)]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 h-7 w-7 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Progress
          value={passwordComplianceProgess(password)}
          className={`h-1 mb-2 ${
            passwordComplianceProgess(password) == 100
              ? "[&>div]:bg-green-500"
              : "[&>div]:bg-yellow-500"
          }`}
        />
        <div className="w-full flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-black opacity-70 ">
            Your password must contain:
          </p>
          <span className="text-xs text-black opacity-70 font-bold">
            {passwordComplianceProgess(password) == 100 ? "Strong" : "Weak"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <PasswordRequirement
            text="At least 1 uppercase letter (A–Z)"
            isCompliant={/[A-Z]/.test(password)}
          />
          <PasswordRequirement
            text="At least 1 number (0–9)"
            isCompliant={/[0-9]/.test(password)}
          />
          <PasswordRequirement
            text="At least 8 characteres"
            isCompliant={password.length >= 8}
          />
          <PasswordRequirement
            text="At least 1 special character (! @ # $ % ^ & *)"
            isCompliant={/[!@#$%^&*]/.test(password)}
          />
        </div>

        <div className="w-full mb-8">
          <Label
            htmlFor="confirm_password"
            className="font-medium color-[#0C1421] mb-1"
          >
            Confirm Password
          </Label>
          <div className="relative flex items-center justify-center">
            <Input
              id="confirm_password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-5 rounded-lg border-[1px] border-[#D4D7E3] bg-[#F7FBFF] font-normal text-[#313131] outline-[var(--primary-color)]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 h-7 w-7 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 mb-10">
          <Checkbox
            id="remember"
            className="w-4 h-4 border-2 border-[#717680] cursor-pointer"
          />
          <Label
            htmlFor="remember"
            className="font-medium color-[#717680] cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <div className="w-full flex flex-col gap-4 mb-14">
          <Button
            className="h-max w-full font-bold text-white text-xl leading-[100%] px-4 py-4 rounded-xl bg-[var(--primary-color)] cursor-pointer hover:opacity-0.8"
            disabled={!isInfoComplete()}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
