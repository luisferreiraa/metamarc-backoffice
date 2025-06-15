"use client"

import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#170224] text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">UNIMARC API</h3>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            Making UNIMARC specifications accessible through modern API technology. Built for librarians, developers,
                            and the entire cataloging community.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-300">
                            <li>
                                <a href="#features" className="hover:text-white transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#api-preview" className="hover:text-white transition-colors">
                                    API Docs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-slate-300">
                            <li>
                                <a href="#faq" className="hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
                    <p>© 2024 UNIMARC API | Made for the UNIMARC community by passionate developers.</p>
                    <p className="mt-2 text-sm">
                        This is an independent project and is not officially affiliated with the UNIMARC organization.
                    </p>
                </div>
            </div>
        </footer>
    )
}