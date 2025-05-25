import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const siteConfig = await prisma.siteConfig.findFirst({
    where: {
      deleted: false,
    },
  });

  return NextResponse.json({
    siteConfig,
  });
}
