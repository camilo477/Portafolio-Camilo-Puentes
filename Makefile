.DEFAULT_GOAL := dev
.NOTPARALLEL:

PORTFOLIO_PORT ?= 4321
PORTFOLIO_NVM_ROOT := $(if $(NVM_DIR),$(NVM_DIR),$(HOME)/.nvm)
PORTFOLIO_NODE_BIN := $(PORTFOLIO_NVM_ROOT)/versions/node/v$(shell cat .nvmrc)/bin

# Prefer the installed project version without changing the user's shell or default.
ifneq ($(wildcard $(PORTFOLIO_NODE_BIN)/node),)
export PATH := $(PORTFOLIO_NODE_BIN):$(PATH)
endif

.PHONY: help check-node install dev lint check build preview browsers test screenshots verify deploy

help:
	@printf '%s\n' \
		'Primera instalación: nvm install y make install' \
		'' \
		'make              Iniciar desarrollo y abrir el navegador' \
		'make install      Instalar dependencias desde package-lock.json' \
		'make dev          Igual que make; detener con Ctrl+C' \
		'make lint         Comprobar formato' \
		'make check        Validar Astro y TypeScript' \
		'make build        Compilar en web/dist/' \
		'make preview      Compilar y servir la versión estática' \
		'make browsers     Instalar Chromium para Playwright' \
		'make test         Compilar y ejecutar las pruebas de navegador' \
		'make screenshots  Compilar y generar capturas locales' \
		'make verify       Ejecutar formato, tipos, build y pruebas' \
		'make deploy PORTFOLIO_SSH=usuario@servidor  Publicar por SSH en Nginx' \
		'' \
		'Puerto alternativo: make dev PORTFOLIO_PORT=4322'

check-node:
	@command -v node >/dev/null 2>&1 || { printf '%s\n' 'Falta Node. Instala la versión indicada en .nvmrc.' >&2; exit 1; }
	@node -e "const expected = require('node:fs').readFileSync('.nvmrc', 'utf8').trim(); \
		const required = expected.split('.').map(Number); \
		const actual = process.versions.node.split('.').map(Number); \
		if (actual[0] !== required[0] || actual[1] < required[1] || (actual[1] === required[1] && actual[2] < required[2])) { \
			console.error('Node ' + process.versions.node + ' no es compatible. Ejecuta nvm install y nvm use para activar Node ' + expected + '.'); \
			process.exit(1); \
		}"
	@command -v npm >/dev/null 2>&1 || { printf '%s\n' 'Falta npm. Activa Node con nvm use.' >&2; exit 1; }

install: check-node
	npm ci

dev: check-node
	npm run dev -- --port "$(PORTFOLIO_PORT)" --ignore-lock --open /en/

lint: check-node
	npm run lint

check: check-node
	npm run check
	bash -n scripts/deploy-raspberry.sh scripts/pullportafolio infra/raspberry/activate-release.sh infra/raspberry/build-release.sh

build: check-node
	npm run build

preview: build
	npm run preview -- --port "$(PORTFOLIO_PORT)" --ignore-lock

browsers: check-node
	npx --no-install playwright install chromium

test: build
	npm test

screenshots: build
	npm run screenshots

verify: lint check test

deploy: lint check build
	bash scripts/deploy-raspberry.sh
