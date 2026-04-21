"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { textColorMap } from "../lib/colors";

const navItems = [
  { label: "실시간 신호", href: "/timing" },
  { label: "보유 주식", href: "/hold" },
  { label: "개별 주식", href: "/item" },
];

export default function Navbar() {
  const pathname = usePathname();
  const localeMatch = pathname.match(/^\/(ko|en)(?=\/|$)/);
  const localePrefix = localeMatch?.[0] ?? "";
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";

  return (
    <nav className="flex space-x-12 pb-0 px-0 mt-4 mb-4 border-b border-gray-200">
      {navItems.map(({ label, href }) => (
        <Link
          key={href}
          href={`${localePrefix}${href}`}
          className={`text-xl font-medium pb-[10px] ${
            pathWithoutLocale === href
              ? `${textColorMap["primary"].default} ${textColorMap["primary"].hover} ${textColorMap["primary"].active}
        border-b-2 border-primary`
              : `${textColorMap["muted"].default} ${textColorMap["muted"].hover} ${textColorMap["muted"].active}`
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
