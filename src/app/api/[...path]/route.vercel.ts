import { handleNodeApi } from "@/server/node-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) { return handleNodeApi(request); }
export async function POST(request: Request) { return handleNodeApi(request); }
