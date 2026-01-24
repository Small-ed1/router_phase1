from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Dict, Optional, Type
from pydantic import BaseModel


SideEffect = str  # "read_only" | "network" | "filesystem_write" | "dangerous"


@dataclass(frozen=True)
class ToolSpec:
    name: str
    description: str
    args_model: Type[BaseModel]
    handler: Callable[[Any], Awaitable[Dict[str, Any]]]
    side_effect: SideEffect = "read_only"
    requires_confirmation: bool = False
    enabled: bool = True


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: Dict[str, ToolSpec] = {}

    def register(self, spec: ToolSpec) -> None:
        if spec.name in self._tools:
            raise ValueError(f"Tool already registered: {spec.name}")
        self._tools[spec.name] = spec

    def get(self, name: str) -> Optional[ToolSpec]:
        return self._tools.get(name)

    def list_for_prompt(self) -> list[dict[str, str]]:
        """Minimal shape to feed the model."""
        out = []
        for t in self._tools.values():
            if t.enabled:
                out.append(
                    {
                        "name": t.name,
                        "description": t.description,
                        "side_effect": t.side_effect,
                        "requires_confirmation": str(t.requires_confirmation),
                    }
                )
        return out