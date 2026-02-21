import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { clientId, date, notes, objective } = await req.json();
    
    if (!clientId || !date) {
      return NextResponse.json({ error: "Client and Date are required" }, { status: 400 });
    }

    const followUp = await prisma.followUp.create({
      data: {
        clientId,
        date: new Date(date),
        objective: objective || notes || "Follow-up",
        notes,
        userId: session.user.id,
      },
    });
    return NextResponse.json(followUp, { status: 201 });
  } catch (error) {
    console.error("FOLLOWUP_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
