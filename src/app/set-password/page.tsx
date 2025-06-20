"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CircleCheck, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import PasswordRequirement from "@/components/password-requirement";
import { isPasswordCompliant } from "@/utils/validators";

export default function SetPassword() {
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

  useEffect(() => {
    toast.custom(() => (
      <div className="flex items-center gap-3 font-[Instrument_Sans] rounded-lg px-4 py-2 bg-[#EAF7EE] border-1 border-green-500 font-medium leading-[120%] text-gray-900 shadow-lg">
        <CircleCheck size={40} color="white" fill="#40C662" />
        Verification successful. You can now set a new password.
      </div>
    ));
  });

  return (
    <div className="relative w-full max-w-[1440px] flex flex-col  items-center justify-center p-4">
      <div className="absolute top-0 flex items-center justify-between">
        <img src="/logo.png" alt="company logo" className="w-56 mt-4" />
      </div>
      <div className="w-full max-w-[560px] flex flex-col  items-start mt-8">
        <div className="mb-8">
          <h1 className="font-semibold text-[40px] leading-[110%] text-[#313131] mb-1">
            Set a Password
          </h1>
          <h2 className="font-normal text-[#313131] opacity-80">
            {
              "Your password has been reset. Set a new one to access to your account."
            }
          </h2>
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

        <div className="w-full flex flex-col gap-4 mb-8">
          <Button
            className="h-max w-full font-bold text-white text-xl leading-[100%] px-4 py-4 rounded-xl bg-[var(--primary-color)] cursor-pointer hover:opacity-0.8"
            disabled={!isInfoComplete()}
            onClick={() => {}}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
