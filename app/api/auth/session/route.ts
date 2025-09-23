import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Session API called');
    
    // Check for admin session cookie
    const sessionCookie = request.cookies.get('admin-session');
    
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value);
        
        // Check if session is not expired (24 hours)
        const sessionAge = Date.now() - sessionData.loginTime;
        if (sessionAge < 24 * 60 * 60 * 1000) {
          console.log('Session result: Found and valid');
          return NextResponse.json({
            isAuthenticated: true,
            user: {
              id: sessionData.id,
              email: sessionData.email,
              role: sessionData.role
            }
          });
        } else {
          console.log('Session result: Expired');
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
      }
    }
    
    console.log('Session result: Not found or expired');
    return NextResponse.json({
      isAuthenticated: false,
      user: null
    }, { status: 401 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
