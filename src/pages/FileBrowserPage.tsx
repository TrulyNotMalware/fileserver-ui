import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Footer } from '@/components/layout/Footer';
import { FileTable } from '@/components/modules/FileTable';
import { useDownload, useFiles, useUpload } from '@/hooks/query/useFiles';

export function FileBrowserPage() {
  const { pathname } = useLocation();
  const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const segments =
    currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);

  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);

  const { data: files = [], isLoading, error } = useFiles(currentPath);
  const download = useDownload();
  const upload = useUpload(currentPath);

  const handleDownload = async (filePath: string) => {
    setDownloadingPath(filePath);
    try {
      await download.mutateAsync(filePath);
    } finally {
      setDownloadingPath(null);
    }
  };

  const handleUpload = (file: File) => {
    upload.mutate(file);
  };

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col border-x border-gray-200'>
        <Breadcrumb segments={segments} />

        <main className='flex-1'>
          <FileTable
            files={files}
            currentPath={currentPath}
            isLoading={isLoading}
            error={error}
            isUploading={upload.isPending}
            downloadingPath={downloadingPath}
            onDownload={handleDownload}
            onUpload={handleUpload}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
