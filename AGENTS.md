# AGENTS.md

Portable instructions for any coding or runtime agent working on this repository.

Agents may: read and edit the code, search NASA catalogues (NASA Image Library, NTRS, PDS), fetch
data through the app's server cache, and explain or narrate results.

Agents may not: compute distances, dates, sols or statistics themselves. Call the pure functions in
the codebase instead. Do not estimate a missing number; show the cached value with its timestamp, or
say it is unavailable.

Every claim shown to a user needs a source URL. Keys live in `.env` and are never committed.
See `CLAUDE.md` for commands and `README.md` for the code map.
