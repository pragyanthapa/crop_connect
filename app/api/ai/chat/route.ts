import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
      return NextResponse.json(
        { error: "AI service is not properly configured" },
        { status: 500 }
      );
    }

    // Initialize the Google AI SDK
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("Sending message to Gemini API:", message);
    const result = await model.generateContent(
      `You are an AI farming assistant. Please provide helpful advice about farming and agriculture. User's question: ${message}`
    );
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get AI response" },
      { status: 500 }
    );
  }
}
