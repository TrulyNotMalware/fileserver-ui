import type { FilesResponse } from '@/types/file';

import { download, request } from './client';

export const filesApi = {
  /** GET /files?path=<path> — 디렉터리 목록 조회 */
  getFiles: (path: string) =>
    request<FilesResponse>(`/files?path=${encodeURIComponent(path)}`),

  /** GET /files/download?path=<path> — 파일/디렉터리(zip) 다운로드 */
  download: (filePath: string) =>
    download(`/files/download?path=${encodeURIComponent(filePath)}`),

  /** POST /files/upload?path=<filePath> — 파일 업로드 */
  upload: (dirPath: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const filePath = `${dirPath === '/' ? '' : dirPath}/${file.name}`;
    return request<void>(`/files/upload?path=${encodeURIComponent(filePath)}`, {
      method: 'POST',
      body: formData,
    });
  },
};
