.PHONY: help setup backend-install frontend-install backend-dev frontend-dev

help:
	@echo "Available targets:"
	@echo "  make setup            Install backend and frontend dependencies"
	@echo "  make backend-install  Install backend dependencies"
	@echo "  make frontend-install Install frontend dependencies"
	@echo "  make backend-dev      Start backend in dev mode"
	@echo "  make frontend-dev     Start frontend (Expo) in LAN mode"

setup: backend-install frontend-install

backend-install:
	cd backend && npm install

frontend-install:
	cd frontend && npm install

backend-dev:
	cd backend && npm run dev

frontend-dev:
	cd frontend && npx expo start --lan
