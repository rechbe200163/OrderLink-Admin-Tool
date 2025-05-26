import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const includeAddress =
    req.nextUrl.searchParams.get('includeAddress') || false;

  if (includeAddress) {
    const siteConfig = await prisma.siteConfig.findFirst({
      where: {
        deleted: false,
      },
      include: {
        address: true,
      },
    });
    if (!siteConfig) {
      return NextResponse.json(
        { error: 'Site configuration not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      siteConfig,
    });
  }
  const siteConfig = await prisma.siteConfig.findFirst({
    where: {
      deleted: false,
    },
  });

  if (!siteConfig) {
    return NextResponse.json(
      { error: 'Site configuration not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    siteConfig,
  });
}
