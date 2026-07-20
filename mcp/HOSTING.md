# Hosted MCP deployment boundary

The initial `@quasar/mcp` package uses stdio and requires no network service. Quasar's existing DigitalOcean infrastructure can later expose the same read-only tools through the MCP Streamable HTTP transport without changing the generated artifact format.

## Recommended hosted shape

- Add a small HTTP entry point beside the stdio entry point; both should construct the server through `createServer()`.
- Build an immutable container containing the verified npm package and generated artifact.
- Terminate TLS at the existing Quasar ingress or reverse proxy.
- Keep the service stateless. The artifact is read-only and can be shared by every request.
- Add request-size, response-size, concurrency, timeout, and rate limits at the edge.
- Expose a health endpoint that reports the package version, Quasar version, and source commit without loading arbitrary resources.
- Log operational metadata, tool names, duration, status, and artifact version, but not full user prompts or returned documentation content by default.
- Deploy a newly verified artifact after a Quasar release and retain the previous image for rollback.

## Deferred decisions

- Public anonymous access versus an API key or Quasar-account authentication.
- A single current documentation dataset versus version-addressable datasets.
- Regional replicas and CDN caching for immutable resources.
- Usage telemetry and retention policy.
- The public endpoint name and discovery metadata.

No hosted transport or DigitalOcean configuration is included in the initial pull request. This keeps infrastructure credentials and deployment policy outside the documentation package while preserving a clean path to hosting.
