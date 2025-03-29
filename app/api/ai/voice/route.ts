import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { text, targetVoice } = await req.json();
    if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const { data } = await axios.post(
      "https://api.deepseek.com/v1/audio/speech",
      {
        input: text,
        voice: targetVoice || "nova",
        model: "deepseek-voice"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    return new NextResponse(Buffer.from(data), {
      headers: { "Content-Type": "audio/mpeg" }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error || "Voice generation failed" },
      { status: 500 }
    );
  }
}
