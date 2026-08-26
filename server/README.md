---
title: Visitor Management API
emoji: 🪪
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Visitor Management API

REST backend for the Visitor Management System (React Native app).
Built with **Node.js + Express + TypeScript + MongoDB** — see the main repo:
https://github.com/adityat54544/visitor-management-mvp

- Live API: `https://<owner>-visitor-api.hf.space/api`
- Health check: `GET /api/health`
- Auth: JWT (Bearer tokens)

**Secrets** (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`) are injected via Space *Secrets* — never committed.
