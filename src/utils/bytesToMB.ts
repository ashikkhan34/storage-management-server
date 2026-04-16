// src/utils/storage.ts
export const bytesToMB = (bytes: number) => {
  return Math.ceil(bytes / (1024 * 1024));
};
