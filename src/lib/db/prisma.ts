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

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

// Convenience alias
export const db = prisma;

// Default export for backward compatibility
export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
