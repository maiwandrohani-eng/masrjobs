import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { loadPublishedCatalog } from "@/lib/db/catalog-queries";

/** Public catalog must reflect org verification promptly after admin approval. */
export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ opportunities: [], organizations: [] });
  }
  try {
    const catalog = await loadPublishedCatalog(prisma);
    return NextResponse.json(catalog);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { opportunities: [], organizations: [], error: "CATALOG_QUERY_FAILED" },
      { status: 500 },
    );
  }
}
