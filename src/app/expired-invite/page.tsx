"use client"
import { useEffect, useState } from "react";

export default function ExpiredInvite() {
    const [viewport, setViewport] = useState(0)

    function getViewportWidth() {
        return window.innerWidth
    }

    useEffect(() => {
        setViewport(getViewportWidth())
        const handleResize = () => {
            setViewport(getViewportWidth())
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="relative w-full max-w-[1440px] flex flex-col  items-center p-4">
            <div className="flex items-center justify-between mb-[28vh]">
                <img src="/logo.png" alt="company logo" className="w-56" />
                {viewport < 640 ? null : <a href="/signup" className="absolute top-5 right-5 h-fit font-bold text-primary-foreground text-xl leading-[100%] px-6 py-4 rounded-xl bg-primary cursor-pointer">
                    Sign up
                </a>}
            </div>
            <div className="w-full max-w-[560px] flex flex-col  items-start">
                <div className="mb-8">
                    <h1 className="text-center font-semibold text-[40px] text-foreground leading-[100%] mb-4">Looks like the invite is expired</h1>
                    <h2 className="text-center font-semibold text-muted-foreground">{'Your invitation from Sarah Kim has expired. Please contact her again to request a new invite.'}</h2>
                </div>

                <div className="w-full flex flex-col gap-4 mb-14">
                    {viewport < 640 ? <a href="/signup" className="w-full text-center font-bold text-primary text-xl leading-[100%] px-6 py-4 rounded-xl bg-transparent cursor-pointer">
                        Sign up
                    </a> : null}
                </div>
            </div>
        </div>
    );
}
