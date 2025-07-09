"use client"

import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-black text-white py-16 [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 text-[#66b497]">Metamarc API</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                            Making UNIMARC specifications accessible through modern API technology.
                            Built for librarians, developers, and the entire cataloging community.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-[#66b497] transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#66b497] transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#66b497] transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[#66b497] mb-4 text-sm uppercase tracking-wide">Product</h4>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>
                                <a href="#features" className="hover:text-[#66b497] transition-colors">Features</a>
                            </li>
                            <li>
                                <a href="#api-preview" className="hover:text-[#66b497] transition-colors">API Docs</a>
                            </li>
                            <li>
                                <a href="#pricing" className="hover:text-[#66b497] transition-colors">Pricing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#66b497] transition-colors">Status</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[#66b497] mb-4 text-sm uppercase tracking-wide">Support</h4>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>
                                <a href="#faq" className="hover:text-[#66b497] transition-colors">FAQ</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#66b497] transition-colors">Documentation</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#66b497] transition-colors">Contact</a>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-[#66b497] transition-colors">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© 2025 Metamarc API — Built by developers for the community.</p>
                    <p className="mt-1">
                        This is an independent project and is not officially affiliated with any organization.
                    </p>
                </div>
            </div>
        </footer>
    )
}
