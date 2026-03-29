import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  segments: string[];
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav className='flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm'>
      <Link
        to='/'
        className='flex items-center text-gray-500 transition-colors hover:text-blue-600'
        title='Home'
      >
        <Home size={14} />
      </Link>

      {segments.map((segment, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;

        return (
          <span key={to} className='flex items-center gap-1'>
            <ChevronRight size={14} className='text-gray-400' />
            {isLast ? (
              <span className='font-medium text-gray-700'>{segment}</span>
            ) : (
              <Link
                to={to}
                className='text-gray-500 transition-colors hover:text-blue-600'
              >
                {segment}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
