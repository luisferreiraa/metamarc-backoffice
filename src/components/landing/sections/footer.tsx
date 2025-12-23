// src/components/landing/sections/footer.tsx

/**
 * @fileoverview This component renders the footer section for the Metamarc API landing page.
 * It includes company information, navigation links (Product, Support), and copyright details.
 */

"use client"

import Link from "next/link"        // Used for internal navigation links.
import { Mail } from "lucide-react"     // Icon for email contact.

/**
 * @function Footer
 * @description A static component rendering the footer layout with links and information.
 * 
 * @returns {JSX.Element} The rendered footer element. 
 */
export function Footer() {
    return (
        // Main footer element with black background and white text.
        <footer className="bg-black text-white py-16 [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                {/* Main grid layout for content sections */}
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Column 1 & 2: Project Description and Socials (takes 2 columns on medium screens) */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 text-[#66b497]">Metamarc API</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                            Making UNIMARC specifications accessible through modern API technology.
                            Built for librarians, developers, and the entire cataloging community.
                        </p>
                        {/* Contact Link */}
                        <div className="flex space-x-5">
                            <a href="mailto:probo.shouse@gmail.com" className="text-gray-400 hover:text-[#66b497] transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 3: Product Links */}
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
                        </ul>
                    </div>

                    {/* Column 4: Support Links */}
                    <div>
                        <h4 className="font-semibold text-[#66b497] mb-4 text-sm uppercase tracking-wide">Support</h4>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            {/* Links that point to anchor IDs or external pages */}
                            <li>
                                <a href="#faq" className="hover:text-[#66b497] transition-colors">FAQ</a>
                            </li>
                            <li>
                                {/* Placeholder link for documentation */}
                                <a href="#" className="hover:text-[#66b497] transition-colors">Documentation</a>
                            </li>
                            <li>
                                {/* Internal link to the login page (or homepage if "/" is the login route) */}
                                <Link href="/" className="hover:text-[#66b497] transition-colors">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright and Attribution Section (Separated by a horizontal line) */}
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
