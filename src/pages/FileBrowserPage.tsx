import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Footer } from '@/components/layout/Footer';
import { FileTable } from '@/components/modules/FileTable';
import { useMe } from '@/hooks/query/useAuth';
import { useDownload, useFiles, useUpload } from '@/hooks/query/useFiles';

export function FileBrowserPage() {
  const { pathname } = useLocation();
  // Normalize once per pathname change (rerender-derived-state-no-effect).
  const currentPath = useMemo(
    () => (pathname === '/' ? '/' : pathname.replace(/\/$/, '')),
    [pathname],
  );
  const segments = useMemo(
    () => (currentPath === '/' ? [] : currentPath.split('/').filter(Boolean)),
    [currentPath],
  );

  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);

  const { data: files = [], isLoading, error } = useFiles(currentPath);
  const download = useDownload();
  const upload = useUpload(currentPath);
  const { data: me } = useMe();
  const canUpload = me?.role === 'admin';

  // Stable callbacks so memoized children (FileTable / FileRow) do not
  // re-render solely because the parent re-rendered.
  const handleDownload = useCallback(
    async (filePath: string) => {
      setDownloadingPath(filePath);
      try {
        await download.mutateAsync(filePath);
      } finally {
        setDownloadingPath(null);
      }
    },
    [download],
  );

  const handleUpload = useCallback(
    (file: File) => {
      upload.mutate(file);
    },
    [upload],
  );

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
            canUpload={canUpload}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
