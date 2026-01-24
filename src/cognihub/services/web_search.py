from __future__ import annotations

import os

import httpx
from bs4 import BeautifulSoup

from ..stores import webstore


async def ddg_search(http: httpx.AsyncClient, query: str, n: int = 8) -> list[str]:
    q = (query or "").strip()
    if not q:
        return []
    url = "https://duckduckgo.com/html/"
    headers = {
        "User-Agent": os.getenv(
            "WEB_UA",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        )
    }
    r = await http.post(url, data={"q": q}, headers=headers, timeout=15.0, follow_redirects=True)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    links: list[str] = []
    for a in soup.select("a.result__a"):
        href = str(a.get("href", ""))
        if href and href.startswith("http") and not webstore._is_blocked_url(href):
            links.append(href)
        if len(links) >= n:
            break
    return links
