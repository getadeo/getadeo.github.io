---
title: "API Design Lessons After 5 Years"
date: 2026-03-20
tags: ["software engineering", "api"]
description: "Things I wish I knew when I started designing APIs."
---

After building APIs at three different companies, here are patterns that held up.

## Be boring with naming

`POST /users` creates a user. `GET /users/:id` fetches one. Don't get creative — predictability is a feature.

## Version from day one

Even if you think you won't need it. The cost of adding `/v1/` upfront is near zero. The cost of migrating later is not.

## Pagination is not optional

Every list endpoint needs it. Cursor-based beats offset-based for anything that changes frequently.

## Error responses deserve as much thought as success responses

A good error response has: a machine-readable code, a human-readable message, and enough context to debug without checking logs.
