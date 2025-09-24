import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    try {
      const payload = jwt.verify(token, secret) as any;
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        }
      });
    } catch (err) {
      // Invalid/expired token
      const res = NextResponse.json({ isAuthenticated: false }, { status: 200 });
      res.cookies.delete('auth-token');
      return res;
    }
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}


