"use client";

import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons-react";

export function FooterComponent() {
  return (
    <footer className="bg-black text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-fuchsia-500 via-amber-500 to-magenta-500 bg-clip-text text-transparent">
              محيطك
            </h3>
            <p className="text-sm text-gray-400">
              This is a slogan which we should change before presenting. I hope
              you're not reading this.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:info@mohituq.com"
                  className="text-sm hover:text-gray-300 flex items-center"
                >
                  <IconMail size={18} className="mr-2" />
                  info@mohituq.com
                </Link>
              </li>
              <li>
                <p className="text-sm">
                  Saadiyat Marina District - Abu Dhabi, UAE
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-gray-300">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-gray-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">App</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/source" className="text-sm hover:text-gray-300">
                  Source
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm hover:text-gray-300">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} محيطك. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link
              href="https://github.com/qcecothing"
              className="text-gray-400 hover:text-white"
            >
              <IconBrandGithub size={24} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/mohituq"
              className="text-gray-400 hover:text-white"
            >
              <IconBrandTwitter size={24} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://linkedin.com/company/mohituq"
              className="text-gray-400 hover:text-white"
            >
              <IconBrandLinkedin size={24} />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
