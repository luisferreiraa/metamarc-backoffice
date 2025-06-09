"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/landing" className="text-2xl font-bold text-slate-800">
                            Metamarc API
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-slate-800 transition-colors">
                            Features
                        </a>
                        <a href="#who-needs" className="text-gray-600 hover:text-slate-800 transition-colors">
                            Who Needs This
                        </a>
                        <a href="#api-preview" className="text-gray-600 hover:text-slate-800 transition-colors">
                            API Preview
                        </a>
                        <a href="#faq" className="text-gray-600 hover:text-slate-800 transition-colors">
                            FAQ
                        </a>
                        <div className="flex items-center space-x-3">
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant={"defaultPink"}>Get Started</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <a href="#features" className="text-gray-600 hover:text-slate-800 transition-colors">
                                Features
                            </a>
                            <a href="#who-needs" className="text-gray-600 hover:text-slate-800 transition-colors">
                                Who Needs This
                            </a>
                            <a href="#api-preview" className="text-gray-600 hover:text-slate-800 transition-colors">
                                API Preview
                            </a>
                            <a href="#faq" className="text-gray-600 hover:text-slate-800 transition-colors">
                                FAQ
                            </a>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Link href="/">
                                    <Button variant="ghost" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

