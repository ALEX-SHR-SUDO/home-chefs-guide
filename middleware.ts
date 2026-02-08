import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In production, you can add authentication here
    // For now, we'll just add a warning header
    const response = NextResponse.next();
    response.headers.set('X-Admin-Warning', 'Admin panel - ensure proper authentication in production');
    
    // Optional: Add basic auth or check for environment variable
    // Example: Check if we're in production and require auth
    if (process.env.NODE_ENV === 'production' && process.env.ADMIN_PASSWORD) {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !checkBasicAuth(authHeader, process.env.ADMIN_PASSWORD)) {
        return new NextResponse('Authentication required', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Panel"',
          },
        });
      }
    }
    
    return response;
  }

  return NextResponse.next();
}

function checkBasicAuth(authHeader: string, expectedPassword: string): boolean {
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Validate both username and password for security
    // Username should be 'admin' for this simple implementation
    return username === 'admin' && password === expectedPassword;
  } catch {
    return false;
  }
}

export const config = {
  matcher: '/admin/:path*',
};
