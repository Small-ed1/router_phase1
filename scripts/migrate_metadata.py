#!/usr/bin/env python3
from __future__ import annotations

import os
import sqlite3


def _db_path(env_key: str, default_path: str) -> str:
    return os.path.abspath(os.getenv(env_key, default_path))


def migrate_chat(db_path: str) -> None:
    if not os.path.exists(db_path):
        return
    con = sqlite3.connect(db_path)
    try:
        cols = {r[1] for r in con.execute("PRAGMA table_info(messages);").fetchall()}
        if "status" not in cols:
            con.execute("ALTER TABLE messages ADD COLUMN status TEXT DEFAULT 'final';")
        con.execute("UPDATE messages SET status='final' WHERE status IS NULL OR status=''")
        con.commit()
    finally:
        con.close()


def _embedding_dim(blob: bytes | None) -> int | None:
    if not blob:
        return None
    if len(blob) % 4 != 0:
        return None
    return len(blob) // 4


def migrate_web(db_path: str, default_embed_model: str) -> None:
    if not os.path.exists(db_path):
        return
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    try:
        cols = {r["name"] for r in con.execute("PRAGMA table_info(web_pages);").fetchall()}
        if "embed_model" not in cols:
            con.execute("ALTER TABLE web_pages ADD COLUMN embed_model TEXT;")
        if "embed_dim" not in cols:
            con.execute("ALTER TABLE web_pages ADD COLUMN embed_dim INTEGER;")

        rows = con.execute("SELECT id, embed_model, embed_dim FROM web_pages;").fetchall()
        for row in rows:
            page_id = int(row["id"])
            embed_model = row["embed_model"]
            embed_dim = row["embed_dim"]

            if not embed_dim:
                chunk = con.execute(
                    "SELECT embedding FROM web_chunks WHERE page_id=? LIMIT 1",
                    (page_id,),
                ).fetchone()
                embed_dim = _embedding_dim(chunk[0] if chunk else None)

            if not embed_model:
                embed_model = default_embed_model

            con.execute(
                "UPDATE web_pages SET embed_model=?, embed_dim=? WHERE id=?",
                (embed_model, embed_dim, page_id),
            )

        con.commit()
    finally:
        con.close()


def main() -> None:
    chat_db = _db_path("CHAT_DB", "data/chat.sqlite3")
    web_db = _db_path("WEB_DB", "data/web.sqlite3")
    default_embed_model = os.getenv("EMBED_MODEL", "embeddinggemma")

    migrate_chat(chat_db)
    migrate_web(web_db, default_embed_model)

    print("Migration complete.")


if __name__ == "__main__":
    main()
