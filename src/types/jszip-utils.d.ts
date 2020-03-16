type GetBinaryContentCallback = (error: Error, data: any) => void;

interface JSZipUtils {
  getBinaryContent(path: string, callback: GetBinaryContentCallback): void
}

declare module 'jszip-utils' {
  declare var JSZipUtils: JSZipUtils;

  export = JSZipUtils;
}

