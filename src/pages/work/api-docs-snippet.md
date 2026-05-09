---
layout: '../../layouts/MarkdownPostLayout.astro'
title: 'API Docs Snippet'
pubDate: 2024-01-14
description: 'A concise introduction layer for a REST API reference, covering authentication, errors, and response conventions.'
author: Karl Oberio
tags: ["work", "api-docs", "technical-writing"]
role: 'Technical writer'
tools: ["OpenAPI", "REST APIs", "Markdown"]
audience: 'Developers integrating with a REST API'
outcome: 'A clearer starting point before generated endpoint reference'
---

## Summary

This sample shows the context I would place before a generated endpoint reference. The goal is to answer the questions developers usually ask first: how to authenticate, how errors are represented, and what response conventions they can rely on while building an integration.

## Sample Excerpt

### Authentication

The API uses bearer token authentication. Send the token in the `Authorization` header with every request:

```http
Authorization: Bearer <access-token>
```

Keep access tokens out of client-side code and source control. If a request does not include a valid token, the API returns `401 Unauthorized`.

### Error Responses

Errors use a consistent JSON response body so clients can display a useful message and log a stable error code.

```json
{
  "code": "invalid_request",
  "message": "The request body is missing a required field.",
  "requestId": "req_01HZY9X8F3A7Z2"
}
```

Use `code` for application logic and `message` for human-readable debugging. Include `requestId` when contacting support.

### Empty Fields

When a field has no value, the API returns `null` instead of omitting the property. This keeps response shapes stable across successful requests.

```json
{
  "id": "customer_123",
  "name": "Example Customer",
  "externalReference": null
}
```

Treat `null` as "known to be empty" rather than "unknown field." This distinction matters when syncing records into systems that require a fixed schema.

## What This Demonstrates

The sample keeps the introduction short, but it still gives developers practical rules before they enter the endpoint list. It also shows how I prefer to document behaviour: state the rule, show a small example, then explain what the reader should do with it.
