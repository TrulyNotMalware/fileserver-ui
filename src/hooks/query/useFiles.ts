import { filesApi } from '@/api/files';
import type { FileItem } from '@/types/file';
import { entryToFileItem } from '@/types/file';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const filesKeys = {
  list: (path: string) => ['files', path] as const,
};

export function useFiles(path: string) {
  return useQuery({
    queryKey: filesKeys.list(path),
    queryFn: async () => {
      const res = await filesApi.getFiles(path);
      const items: FileItem[] = (res.entries ?? []).map(entryToFileItem);
      return items;
    },
  });
}

export function useDownload() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const { blob, filename } = await filesApi.download(filePath);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });
}

export function useUpload(currentPath: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => filesApi.upload(currentPath, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesKeys.list(currentPath) });
    },
  });
}
