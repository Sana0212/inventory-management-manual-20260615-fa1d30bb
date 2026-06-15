import React from 'react';
import Link from 'next/link';

interface BreadcrumbsProps {
  items: {
    label: string;
    route?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-4 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
            Core Portal
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <span className="mx-2 text-slate-400">/</span>
            {item.route ? (
              <Link href={item.route} className="hover:text-indigo-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-800 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
