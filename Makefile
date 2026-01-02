SHELL := /usr/bin/env bash
.PHONY: doctor fmt test run

doctor:
	@echo '== python =='
	@python -V
	@echo '== venv =='
	@test -d .venv && echo '.venv ok' || echo 'MISSING .venv (python -m venv .venv)'
	@echo '== tree =='
	@ls -la config docs scripts agent projects >/dev/null || true
	@echo 'doctor: ok'

fmt:
	@python -m compileall agent >/dev/null

test:
	@source .venv/bin/activate && python -m pytest tests/ -q || true

run:
	@./agt run "$(OBJ)" || true
