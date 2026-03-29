import { Link } from 'react-router-dom';
import { Archive, Download, Loader2 } from 'lucide-react';

import { FileIcon } from '@/components/elements/FileIcon';
import { Button } from '@/components/ui/Button';
import type { FileItem } from '@/types/file';
import {
  formatAbsoluteTime,
  formatRelativeTime,
  formatSize,
} from '@/utils/format';

interface FileRowProps {
  file: FileItem;
  currentPath: string;
  onDownload: (filePath: string) => void;
  isDownloading: boolean;
}

export function FileRow({
  file,
  currentPath,
  onDownload,
  isDownloading,
}: FileRowProps) {
  const base = currentPath === '/' ? '' : currentPath;
  const filePath = `${base}/${file.name}`;

  const href = file.type === 'directory' ? `${base}/${file.name}` : '#';

  return (
    <tr className='group border-b border-gray-100 transition-colors hover:bg-gray-50/80'>
      {/* Name */}
      <td className='px-4 py-2.5'>
        <div className='flex items-center gap-2.5'>
          <span className='flex-shrink-0'>
            <FileIcon name={file.name} type={file.type} />
          </span>
          {file.type === 'directory' ? (
            <Link
              to={href}
              className='text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline'
            >
              {file.name}
            </Link>
          ) : (
            <button
              onClick={() => onDownload(filePath)}
              className='text-left text-sm text-gray-800 hover:text-blue-600 hover:underline'
            >
              {file.name}
            </button>
          )}
        </div>
      </td>

      {/* Size */}
      <td className='w-24 px-4 py-2.5 text-sm text-gray-500 tabular-nums'>
        {formatSize(file.size)}
      </td>

      {/* ModTime */}
      <td className='w-44 px-4 py-2.5 text-sm text-gray-500'>
        <span title={formatAbsoluteTime(file.modTime)}>
          {formatRelativeTime(file.modTime)}
        </span>
      </td>

      {/* Actions */}
      <td className='w-36 px-4 py-2.5'>
        <Button
          variant='outline'
          size='sm'
          className='whitespace-nowrap'
          onClick={() => onDownload(filePath)}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 size={12} className='animate-spin' />
          ) : (
            <Archive size={12} />
          )}
          {file.type === 'directory' ? 'Archive Zip' : 'Download'}
          {!isDownloading && <Download size={12} className='text-gray-400' />}
        </Button>
      </td>
    </tr>
  );
}
