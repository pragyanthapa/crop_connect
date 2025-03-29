import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 });
    }

    // Since we're using the Web Speech API in the frontend, we don't need server-side transcription
    // This endpoint is kept for compatibility but will return a success response
    return NextResponse.json({ 
      transcript: "Speech recognition is handled by the browser's Web Speech API",
      status: "success"
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
