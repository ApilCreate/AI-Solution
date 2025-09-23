import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API endpoint working',
    timestamp: new Date().toISOString(),
    success: true 
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'POST test successful',
    timestamp: new Date().toISOString(),
    success: true 
  });
}