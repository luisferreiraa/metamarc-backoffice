"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-black sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/landing" className="text-xl font-bold text-[#66b497] [font-family:var(--font-poppins)]">
                            Metamarc API
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-15 [font-family:var(--font-poppins)]">
                        <a href="#features" className="text-white hover:font-bold transition-colors">
                            Features
                        </a>
                        <a href="#who-needs" className="text-white hover:font-bold transition-colors">
                            Who Needs This
                        </a>
                        <a href="#api-preview" className="text-white hover:font-bold transition-colors">
                            API Preview
                        </a>
                        <a href="#faq" className="text-white hover:font-bold transition-colors">
                            FAQ
                        </a>
                        <div className="flex items-center space-x-7">
                            <Link href="/login">
                                <Button variant={"none"}>Log in</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant={"main"}>Sign up</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen
                                ? <X className="h-7 w-7 text-[#66b497]" />
                                : <Menu className="h-7 w-7 text-[#66b497]" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 [font-family:var(--font-poppins)]">
                        <div className="flex flex-col space-y-4">
                            <a href="#features" className="text-white hover:text-[#66b497] transition-colors">
                                Features
                            </a>
                            <a href="#who-needs" className="text-white hover:text-[#66b497] transition-colors">
                                Who Needs This
                            </a>
                            <a href="#api-preview" className="text-white hover:text-[#66b497] transition-colors">
                                API Preview
                            </a>
                            <a href="#faq" className="text-white hover:text-[#66b497] transition-colors">
                                FAQ
                            </a>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Link href="/login">
                                    <Button variant={"main"} className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant={"main"} className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

