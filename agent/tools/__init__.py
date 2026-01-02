from __future__ import annotations

from .agent_tools import (
    BaseTool, FileReadTool, DirectoryListTool, KiwixQueryTool,
    WebSearchTool, UrlFetchTool, RagSearchTool, ToolResult,
    TerminalTool, SystemdTool, PackageTool, FileEditTool, SkillTool,
    GitHubSearchTool, GitHubFetchTool, _handle_file_error, _check_project_path
)

def get_all_tools():
    """Get all available tools"""
    return [
        FileReadTool(), DirectoryListTool(), KiwixQueryTool(),
        WebSearchTool(), UrlFetchTool(), RagSearchTool(),
        TerminalTool(), SystemdTool(), PackageTool(), FileEditTool(), SkillTool(),
        GitHubSearchTool(), GitHubFetchTool()
    ]

__all__ = [
    "BaseTool", "FileReadTool", "DirectoryListTool", "KiwixQueryTool",
    "WebSearchTool", "UrlFetchTool", "RagSearchTool", "ToolResult",
    "TerminalTool", "SystemdTool", "PackageTool", "FileEditTool", 
    "SkillTool", "GitHubSearchTool", "GitHubFetchTool",
    "_handle_file_error", "_check_project_path", "get_all_tools"
]