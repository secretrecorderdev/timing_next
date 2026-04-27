"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { textColorMap } from "@/shared/ui/colors";

const navItems = [
  { label: "실시간 신호", href: "/timing" },
  { label: "보유 주식", href: "/hold" },
  { label: "개별 주식", href: "/item" },
];

export default function Navbar() {
  const pathname = usePathname() ?? "/ko/timing";
  const localeMatch = pathname.match(/^\/(ko|en)(?=\/|$)/);
  const localePrefix = localeMatch?.[0] ?? "";
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";

  return (
    <nav className="-mx-3 mb-4 mt-4 overflow-x-auto border-b border-gray-200 px-3 pb-0 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-6 sm:gap-12">
      {navItems.map(({ label, href }) => (
        <Link
          key={href}
          href={`${localePrefix}${href}`}
          className={`shrink-0 px-1 pb-[10px] text-lg font-medium sm:px-2 sm:text-xl ${
            pathWithoutLocale === href
              ? `${textColorMap["primary"].default} ${textColorMap["primary"].hover} ${textColorMap["primary"].active}
        border-b-2 border-primary`
              : `${textColorMap["muted"].default} ${textColorMap["muted"].hover} ${textColorMap["muted"].active}`
          }`}
        >
          {label}
        </Link>
      ))}
      </div>
    </nav>
  );
}
