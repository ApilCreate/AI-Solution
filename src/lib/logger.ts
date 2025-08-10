interface LogMeta {
  [key: string]: any;
}

export function logInfo(message: string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  
  if (meta) {
    console.log(`[${timestamp}] INFO: ${message}`, meta);
  } else {
    console.log(`[${timestamp}] INFO: ${message}`);
  }
}

export function logError(error: Error | string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  if (meta) {
    console.error(`[${timestamp}] ERROR: ${errorMessage}`, {
      ...meta,
      stack: errorStack
    });
  } else {
    console.error(`[${timestamp}] ERROR: ${errorMessage}`, {
      stack: errorStack
    });
  }
}
