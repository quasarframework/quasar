# Artifact maintenance and CI handoff

The checked-in artifact represents one exact Quasar source commit. Its manifest and every response expose that provenance, while `generated/integrity.json` records the consumed source hashes.

## Recommended post-release workflow

After this pull request is accepted, Quasar maintainers can add a repository-level GitHub Actions workflow. It should run after a Quasar release is published, and also support manual dispatch for recovery or pre-release verification.

The job should:

1. Check out the released source revision rather than an arbitrary moving branch.
2. Install the repository dependencies with the repository's pinned pnpm version.
3. Ensure the public `ui/dist/api` contracts are generated for that revision.
4. Run the following from `mcp/`:

   ```bash
   pnpm install --ignore-workspace --frozen-lockfile
   pnpm generate
   pnpm validate
   pnpm evaluate
   pnpm test
   pnpm test:immutability
   pnpm pack
   ```

5. Verify that generation changed only `mcp/generated/`.
6. Upload the tarball and generated artifact as workflow artifacts.
7. Either open an automated artifact-refresh pull request or attach the result to the release workflow for maintainer review.

Publishing `@quasar/mcp` should remain a separate, explicitly approved job. The workflow above prepares and verifies the package but does not publish it.

## Review gates

- All schema and integrity validation must pass.
- The retrieval benchmark must have no failed cases.
- The stdio integration test must start and stop the packaged binary cleanly.
- Installation and an MCP request from the packed tarball should be smoke-tested.
- Changes outside `mcp/` should fail the artifact-refresh job.

The root workflow is intentionally not included in this pull request so maintainers can align it with Quasar's release credentials, protected environments, and existing release orchestration.
