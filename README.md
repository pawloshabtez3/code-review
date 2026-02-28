# AI Code Review Assistant

## Architecture decisions
- Next.js App Router with strict TypeScript and server-side AI calls.
- Zod schemas validate all inputs and AI responses.
- API route handles prompt construction, Gemini call, validation, and storage.

## AI limitations
- Responses are probabilistic and can miss context or produce incomplete findings.
- The API enforces JSON-only output but cannot guarantee perfect structure.

## Security considerations
- Gemini API key is server-side only.
- Input length is capped to reduce token abuse.
- Basic in-memory rate limit placeholder is included.

## AI validation
- The API parses AI output as JSON and validates it with Zod.
- Invalid AI responses return a safe error to the client.

## Trade-offs
- Rate limiting is per-instance and in-memory only.
- Supabase integration is optional and only used when env vars are present.

## Local setup
1. Copy `.env.example` to `.env.local` and set environment variables.
2. Install dependencies: `npm install`.
3. Run the dev server: `npm run dev`.

## Database
Apply the schema in `lib/db/schema.sql` to create the `reviews` table.
