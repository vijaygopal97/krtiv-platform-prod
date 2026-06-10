#!/usr/bin/env python3
"""
Analyze nginx access logs for krtiv.ai (or any combined-format log).

Usage (on the server):
  sudo python3 analyze_krtiv_traffic.py /var/log/nginx/access.log --since 2026-03-15
  sudo python3 analyze_krtiv_traffic.py /var/log/nginx/krtiv.access.log --since 2026-03-15 --exclude-assets

Outputs:
  - Page path hit counts (GET 2xx/3xx only, optional)
  - Top referrers
  - Top client IPs
  - Optional: rough country for top IPs (uses public ip-api.com, max 45/min — use --no-geo to skip)

Requires: Python 3.8+ (stdlib only except urllib for optional geo).
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

# Nginx combined log: IP - - [DD/Mon/YYYY:HH:MM:SS +offset] "METHOD path HTTP/1.x" status size "referer" "ua"
LOG_LINE = re.compile(
    r'^(?P<ip>[\d.]+|[0-9a-fA-F:.]+)\s+-\s+-\s+\[(?P<time>[^\]]+)\]\s+'
    r'"(?P<method>\w+)\s+(?P<path>[^\s"]+)\s+HTTP/[^"]+"\s+'
    r'(?P<status>\d+)\s+(?P<size>\S+)\s+"(?P<referer>[^"]*)"\s+"(?P<ua>[^"]*)"'
)

MONTHS = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
}


def parse_time(s: str) -> datetime | None:
    # 17/Mar/2026:09:13:29 +0000
    try:
        parts = s.split()
        d, mon, y, t = parts[0].split("/")
        h, m, sec = t.split(":")
        month = MONTHS.get(mon)
        if not month:
            return None
        return datetime(int(y), month, int(d), int(h), int(m), int(sec), tzinfo=timezone.utc)
    except (ValueError, IndexError):
        return None


def normalize_path(path: str) -> str:
    """Strip query string; collapse trailing slash for grouping."""
    p = path.split("?", 1)[0]
    if len(p) > 1 and p.endswith("/"):
        p = p.rstrip("/")
    return p or "/"


ASSET_PREFIXES = (
    "/_next/", "/favicon", "/robots.txt", "/sitemap", ".ico", ".png", ".jpg",
    ".jpeg", ".webp", ".gif", ".svg", ".css", ".js", ".woff", ".mp4", ".woff2",
)


def is_static_asset(path: str) -> bool:
    pl = path.lower()
    if pl.startswith("/_next/"):
        return True
    for s in ASSET_PREFIXES:
        if s in pl or pl.endswith(s.lstrip("/")):
            return True
    return False


def referrer_label(ref: str) -> str:
    if not ref or ref == "-":
        return "(direct / bookmark / app)"
    try:
        u = urlparse(ref)
        host = u.netloc or ref[:80]
        return host[:120]
    except Exception:
        return ref[:120]


def fetch_country(ip: str) -> str:
    """Single IP lookup via ip-api.com (free, 45 req/min)."""
    import urllib.request
    import json
    url = f"http://ip-api.com/json/{ip}?fields=status,country,countryCode"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            data = json.loads(r.read().decode())
        if data.get("status") == "success":
            return f"{data.get('country', '?')} ({data.get('countryCode', '?')})"
    except Exception as e:
        return f"(lookup failed: {e})"
    return "?"


def main() -> int:
    ap = argparse.ArgumentParser(description="Analyze nginx access logs for krtiv.ai traffic.")
    ap.add_argument("logfile", nargs="?", default="/var/log/nginx/access.log", help="Path to access log")
    ap.add_argument("--since", required=True, help="Include entries on or after this date (YYYY-MM-DD), UTC")
    ap.add_argument("--exclude-assets", action="store_true", help="Skip static assets and /_next/")
    ap.add_argument("--all-methods", action="store_true", help="Include POST/HEAD etc. (default: GET only)")
    ap.add_argument("--min-status", type=int, default=200, help="Min HTTP status (default 200)")
    ap.add_argument("--max-status", type=int, default=399, help="Max HTTP status (default 399)")
    ap.add_argument("--top", type=int, default=30, help="Top N rows per section")
    ap.add_argument("--no-geo", action="store_true", help="Do not resolve country for IPs (faster, offline)")
    ap.add_argument("--geo-limit", type=int, default=25, help="Max IPs to geolookup (default 25)")
    args = ap.parse_args()

    try:
        since_dt = datetime.strptime(args.since, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        print("Invalid --since; use YYYY-MM-DD", file=sys.stderr)
        return 1

    path = Path(args.logfile)
    if not path.is_file():
        print(f"Log file not found: {path}", file=sys.stderr)
        return 1

    page_hits: Counter[str] = Counter()
    referrers: Counter[str] = Counter()
    ips: Counter[str] = Counter()
    status_counts: Counter[int] = Counter()
    total_lines = 0
    matched = 0
    skipped_date = 0

    with path.open("r", errors="replace") as f:
        for line in f:
            total_lines += 1
            m = LOG_LINE.match(line.strip())
            if not m:
                continue
            t = parse_time(m.group("time"))
            if t is None or t < since_dt:
                skipped_date += 1
                continue
            method = m.group("method")
            if not args.all_methods and method != "GET":
                continue
            try:
                st = int(m.group("status"))
            except ValueError:
                continue
            if not (args.min_status <= st <= args.max_status):
                continue
            raw_path = m.group("path")
            np = normalize_path(raw_path)
            if args.exclude_assets and is_static_asset(np):
                continue
            page_hits[np] += 1
            referrers[referrer_label(m.group("referer"))] += 1
            ips[m.group("ip")] += 1
            status_counts[st] += 1
            matched += 1

    print("=" * 72)
    print(f"krtiv.ai traffic report")
    print(f"Log file: {path}")
    print(f"Since (UTC): {args.since}  |  Lines read: {total_lines}  |  Matched (filtered): {matched}")
    print("=" * 72)

    print(f"\n--- Top pages (path) — top {args.top} ---")
    for p, c in page_hits.most_common(args.top):
        print(f"  {c:8d}  {p}")

    print(f"\n--- Top referrers (where traffic said it came from) — top {args.top} ---")
    for r, c in referrers.most_common(args.top):
        print(f"  {c:8d}  {r}")

    print(f"\n--- Top client IPs — top {args.top} ---")
    top_ips = ips.most_common(args.top)
    for ip, c in top_ips:
        print(f"  {c:8d}  {ip}")

    if not args.no_geo and top_ips:
        print(f"\n--- Rough country (ip-api.com) for top {min(args.geo_limit, len(top_ips))} IPs ---")
        import time
        for i, (ip, c) in enumerate(top_ips[: args.geo_limit]):
            if ip.startswith("127.") or ip == "::1":
                print(f"  {c:8d}  {ip}  (local)")
                continue
            country = fetch_country(ip)
            print(f"  {c:8d}  {ip}  →  {country}")
            if i < args.geo_limit - 1:
                time.sleep(1.35)  # stay under ~45/min

    print(f"\n--- HTTP status breakdown (matched lines) ---")
    for st in sorted(status_counts.keys()):
        print(f"  {st}: {status_counts[st]}")

    print("\nNotes:")
    print("  • 'Direct' means no Referer header (bookmarks, typed URL, mobile apps, privacy).")
    print("  • Historical data exists only for dates still present in this log file (rotation may remove old lines).")
    print("  • For ongoing analytics, use a dedicated access_log for krtiv (see docs/TRAFFIC-ANALYTICS.md).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
