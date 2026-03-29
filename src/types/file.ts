export type FileType = 'file' | 'directory';

export interface FileItem {
  name: string;
  type: FileType;
  size: number | null;
  modTime: string;
  isHidden: boolean;
}

// ─── API response types ────────────────────────────────────────────────────

export interface FileEntry {
  name: string;
  size?: number;
  mod_time: string;
  is_dir: boolean;
}

export interface FilesResponse {
  path: string;
  entries: FileEntry[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function entryToFileItem(entry: FileEntry): FileItem {
  return {
    name: entry.name,
    type: entry.is_dir ? 'directory' : 'file',
    size: entry.size ?? null,
    modTime: entry.mod_time,
    isHidden: entry.name.startsWith('.'),
  };
}
