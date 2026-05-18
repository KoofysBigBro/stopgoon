type ApiErrorMeta = Record<string, unknown>;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: 'UnknownError',
    message: typeof error === 'string' ? error : 'Unknown error',
    stack: undefined,
  };
}

export function logApiError(route: string, error: unknown, meta: ApiErrorMeta = {}) {
  const normalized = normalizeError(error);

  console.error('[api-error]', {
    route,
    ...normalized,
    meta,
    timestamp: new Date().toISOString(),
  });
}
