import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  segments: string[];
}

interface Crumb {
  to: string;
  label: string;
  isLast: boolean;
}

// Build crumbs by accumulating a running prefix instead of recomputing
// segments.slice(0, i+1).join('/') per row — the original form is O(n²)
// (js-combine-iterations). useMemo keeps the array reference stable so
// downstream memoized children don't re-render on unrelated parent renders.
function buildCrumbs(segments: string[]): Crumb[] {
  const lastIdx = segments.length - 1;
  const crumbs: Crumb[] = new Array(segments.length);
  let prefix = '';
  for (let i = 0; i < segments.length; i++) {
    prefix += '/' + segments[i];
    crumbs[i] = { to: prefix, label: segments[i], isLast: i === lastIdx };
  }
  return crumbs;
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  const crumbs = useMemo(() => buildCrumbs(segments), [segments]);

  return (
    <nav className='flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm'>
      <Link
        to='/'
        className='flex items-center text-gray-500 transition-colors hover:text-blue-600'
        title='Home'
      >
        <Home size={14} />
      </Link>

      {crumbs.map((c) => (
        <span key={c.to} className='flex items-center gap-1'>
          <ChevronRight size={14} className='text-gray-400' />
          {c.isLast ? (
            <span className='font-medium text-gray-700'>{c.label}</span>
          ) : (
            <Link
              to={c.to}
              className='text-gray-500 transition-colors hover:text-blue-600'
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
