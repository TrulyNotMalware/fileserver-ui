import { File, FileCode, FileImage, FileText, Folder } from 'lucide-react';

import type { FileType } from '@/types/file';

const EXT_ICON_MAP: Record<string, React.ReactNode> = {
  md: <FileText size={16} className='text-blue-400' />,
  txt: <FileText size={16} className='text-gray-400' />,
  json: <FileCode size={16} className='text-yellow-500' />,
  ts: <FileCode size={16} className='text-blue-500' />,
  tsx: <FileCode size={16} className='text-blue-400' />,
  js: <FileCode size={16} className='text-yellow-400' />,
  jsx: <FileCode size={16} className='text-yellow-300' />,
  go: <FileCode size={16} className='text-cyan-400' />,
  css: <FileCode size={16} className='text-purple-400' />,
  html: <FileCode size={16} className='text-orange-400' />,
  png: <FileImage size={16} className='text-green-400' />,
  jpg: <FileImage size={16} className='text-green-400' />,
  jpeg: <FileImage size={16} className='text-green-400' />,
  svg: <FileImage size={16} className='text-green-500' />,
  ico: <FileImage size={16} className='text-green-400' />,
};

interface FileIconProps {
  name: string;
  type: FileType;
}

export function FileIcon({ name, type }: FileIconProps) {
  if (type === 'directory') {
    return <Folder size={16} className='fill-yellow-400/30 text-yellow-400' />;
  }

  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_ICON_MAP[ext] ?? <File size={16} className='text-gray-400' />;
}
