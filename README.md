# Krtiv.ai — production code mirror

Private backup of the live **Krtiv.ai** stack from `developer@143.244.137.169:/home/developer/Krtiv/`.

## Layout

- `frontend/` — Next.js site (krtiv.ai)
- `backend/` — Krtiv API
- `scripts/` — server helper scripts

## Not tracked (see `.gitignore`)

- `node_modules/`, `.next/`, `.env*`, logs

## Update this mirror

From the Signpost workspace root:

```bash
./scripts/github-backup/github-backup-krtiv.sh "describe your change"
```
