import { useRef } from 'react';
import { Eye, EyeOff, Loader2, TriangleAlert, Upload } from 'lucide-react';

import { FileRow } from '@/components/modules/FileRow';
import { Button } from '@/components/ui/Button';
import { useFileStore } from '@/stores/fileStore';
import type { FileItem } from '@/types/file';

interface FileTableProps {
  files: FileItem[];
  currentPath: string;
  isLoading: boolean;
  error: Error | null;
  isUploading: boolean;
  downloadingPath: string | null;
  onDownload: (filePath: string) => void;
  onUpload: (file: File) => void;
}

export function FileTable({
  files,
  currentPath,
  isLoading,
  error,
  isUploading,
  downloadingPath,
  onDownload,
  onUpload,
}: FileTableProps) {
  const { showHidden, toggleHidden } = useFileStore();
  const uploadRef = useRef<HTMLInputElement>(null);

  const visibleFiles = showHidden ? files : files.filter((f) => !f.isHidden);
  const hiddenCount = files.filter((f) => f.isHidden).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className='flex items-center gap-2 border-b border-gray-200 px-4 py-2.5'>
        <Button
          variant='outline'
          size='sm'
          active={showHidden}
          onClick={toggleHidden}
        >
          {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
          {showHidden ? 'Hide hidden' : 'Show hidden'}
          {hiddenCount > 0 && (
            <span className='ml-0.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600'>
              {hiddenCount}
            </span>
          )}
        </Button>

        <div className='flex-1' />

        {/* Upload */}
        <input
          ref={uploadRef}
          type='file'
          className='hidden'
          onChange={handleFileChange}
        />
        <Button
          variant='outline'
          size='sm'
          onClick={() => uploadRef.current?.click()}
          disabled={isUploading}
          className='whitespace-nowrap'
        >
          {isUploading ? (
            <Loader2 size={13} className='animate-spin' />
          ) : (
            <Upload size={13} />
          )}
          {isUploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>

      {/* Table */}
      <table className='w-full text-left'>
        <thead>
          <tr className='border-b border-gray-200 bg-gray-50'>
            <th className='px-4 py-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
              Name
            </th>
            <th className='w-24 px-4 py-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
              Size
            </th>
            <th className='w-44 px-4 py-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
              ModTime
            </th>
            <th className='w-36 px-4 py-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className='px-4 py-16 text-center'>
                <Loader2
                  size={20}
                  className='mx-auto animate-spin text-gray-400'
                />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className='px-4 py-12 text-center'>
                <div className='flex flex-col items-center gap-2 text-sm text-red-500'>
                  <TriangleAlert size={20} />
                  <span>{error.message}</span>
                </div>
              </td>
            </tr>
          ) : visibleFiles.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className='px-4 py-12 text-center text-sm text-gray-400'
              >
                No files found
              </td>
            </tr>
          ) : (
            visibleFiles.map((file) => {
              const filePath = `${currentPath === '/' ? '' : currentPath}/${file.name}`;
              return (
                <FileRow
                  key={file.name}
                  file={file}
                  currentPath={currentPath}
                  onDownload={onDownload}
                  isDownloading={downloadingPath === filePath}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
