import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { FileItem } from '@/types/file';

import { FileTable } from './FileTable';

import { render, screen } from '@testing-library/react';

const sample: FileItem[] = [
  {
    name: 'a.txt',
    type: 'file',
    size: 12,
    modTime: new Date().toISOString(),
    isHidden: false,
  },
];

function renderTable(canUpload: boolean) {
  return render(
    <MemoryRouter>
      <FileTable
        files={sample}
        currentPath='/'
        isLoading={false}
        error={null}
        isUploading={false}
        downloadingPath={null}
        onDownload={vi.fn()}
        onUpload={vi.fn()}
        canUpload={canUpload}
      />
    </MemoryRouter>,
  );
}

describe('FileTable upload gating', () => {
  it('hides the upload button when canUpload is false (guest)', () => {
    renderTable(false);
    expect(screen.queryByRole('button', { name: /upload/i })).toBeNull();
  });

  it('shows the upload button when canUpload is true (admin)', () => {
    renderTable(true);
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });
});
