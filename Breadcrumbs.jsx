import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Breadcrumbs({ pages }) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm text-[var(--nea-text-secondary)]"
    >
      {pages.map((page, index) => (
        <React.Fragment key={page.name}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <Link
            to={page.href ? createPageUrl(page.href) : '#'}
            className={index === pages.length - 1 ? "font-semibold text-[var(--nea-text-title)]" : "hover:text-[var(--nea-text-primary)] transition-colors"}
          >
            {page.name}
          </Link>
        </React.Fragment>
      ))}
    </motion.nav>
  );
}