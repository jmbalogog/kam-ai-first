export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { email, password } = (await request.json()) as { email: string; password: string }

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ valid: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // VALID_USERS format: JSON array of {email, password} objects
    // Example: [{"email":"user@example.com","password":"pass123"}]
    const validUsersRaw = process.env.VALID_USERS || '[]'
    const validUsers: Array<{ email: string; password: string }> = JSON.parse(validUsersRaw)

    const isValid = validUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password.trim()
    )

    return new Response(JSON.stringify({ valid: isValid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ valid: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
