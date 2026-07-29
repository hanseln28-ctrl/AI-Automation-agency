import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'warn', 'error']
          : ['error'],
    });

    // Verify connection in production on startup
    if (process.env.NODE_ENV === 'production') {
      client.$connect().catch((err) => {
        console.error('[Prisma] Failed to connect to database:', err.message);
      });
    }

    return client;
  } catch (error) {
    console.error(
      '[Prisma] Failed to initialize client:',
      error instanceof Error ? error.message : error,
    );
    throw new Error(
      'Database connection failed. Check DATABASE_URL and DIRECT_URL.',
    );
  }
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Lazy Prisma client proxy.
 *
 * Defers `new PrismaClient()` (which calls `env("DATABASE_URL")`)
 * to request time. During `next build`, API route modules are evaluated
 * for route registration but never actually called — without lazy init,
 * PrismaClient's constructor fails because DATABASE_URL is only available
 * at runtime on Vercel.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const client = getPrisma();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

// Convenience alias
export const db = prisma;

// Default export for backward compatibility
export default prisma;
