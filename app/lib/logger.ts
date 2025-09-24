// Simple logger utility for development
export const logInfo = (message: string, data?: unknown) => {
  console.log(`[INFO] ${message}`, data || '');
};

export const logError = (message: string, data?: unknown) => {
  console.error(`[ERROR] ${message}`, data || '');
};

export const logWarn = (message: string, data?: unknown) => {
  console.warn(`[WARN] ${message}`, data || '');
};
