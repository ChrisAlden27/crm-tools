import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: "Follow-up ID and Status are required" }, { status: 400 });
    }

    const followUp = await prisma.followUp.update({
      where: { 
        id,
        userId: session.user.id // Ensure user owns this follow-up
      },
      data: { status },
    });

    return NextResponse.json(followUp);
  } catch (error) {
    console.error("FOLLOWUP_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
