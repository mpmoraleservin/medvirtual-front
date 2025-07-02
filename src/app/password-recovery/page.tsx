"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");

  return (
    <div className="relative w-full max-w-[1440px] flex flex-col  items-center justify-center p-4">
      <div className="absolute top-0 flex items-center justify-between">
        <img src="/logo.png" alt="company logo" className="w-56 mt-4" />
      </div>
      <div className="w-full max-w-[560px] flex flex-col  items-start mt-8">
        <div className="mb-8">
          <a href="/login" className="flex items-center mb-4 cursor-pointer">
            <ChevronLeft size={24} className="mr-1"/>
            <h3 className="font-medium text-sm text-foreground">
              Back to login
            </h3>
          </a>
          <h1 className="font-semibold text-[40px] leading-[110%] text-foreground mb-1">
            Forgot your Password?
          </h1>
          <h2 className="font-normal text-foreground opacity-80">
           {' Don\'t worry, happens to all of us. Enter your email below to recover your password.'}
          </h2>
        </div>

        <div className="w-full mb-10">
          <Label htmlFor="email" className="font-medium text-foreground mb-1">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@medvirtual.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-5 rounded-lg border-[1px] border-border bg-input font-normal text-foreground"
          />
        </div>

        <div className="w-full flex flex-col gap-4 mb-8">
          <Button
            className="h-max w-full font-bold text-primary-foreground text-xl leading-[100%] px-4 py-4 rounded-xl bg-primary cursor-pointer hover:opacity-0.8"
            disabled={!isValidEmail(email)}
            onClick={() => {}}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
