---
layout: '../../layouts/MarkdownPostLayout.astro'
title: 'Building Redoc Output from OpenAPI Specs'
description: 'A procedural guide for turning a SwaggerHub OpenAPI export into publishable Redoc documentation.'
pubDate: 2023-06-25
author: Karl Oberio
tags: ["work", "openapi", "redoc", "technical-writing"]
role: 'Technical writer'
tools: ["SwaggerHub", "OpenAPI", "Redoc", "YAML"]
audience: 'Documentation maintainers publishing API reference docs'
outcome: 'A repeatable publishing procedure for generated API documentation'
---

## Summary

This sample turns a short internal procedure into a publishable workflow. It assumes the reader has access to SwaggerHub and needs to produce static Redoc output from an existing OpenAPI definition.

## Sample Procedure

### Export the OpenAPI Definition

1. Open the API in SwaggerHub.

2. Select **Export**.

   SwaggerHub opens a menu with the available export formats.

3. Select **Download API** > **YAML Resolved**.

   The resolved YAML file includes referenced schemas and components in a single file. Use the resolved version when the publishing pipeline expects one complete OpenAPI document.

4. Save the file in the documentation repository.

   Use a filename that includes the API name and version, for example `payments-api-v1.yaml`.

### Generate Redoc Output

Run Redoc against the resolved OpenAPI file:

```sh
npx @redocly/cli build-docs payments-api-v1.yaml --output payments-api-v1.html
```

Open the generated HTML file locally and check that:

- The API title, version, and server URL are correct.
- Authentication details appear near the top of the reference.
- Schema examples render without missing references.
- Required and optional fields are labelled correctly.

### Publish the Output

Commit the generated HTML file only if the repository stores static build output. If the site builds documentation during deployment, commit the YAML file and update the build script instead.

## What This Demonstrates

The procedure gives the reader enough context to make the right export choice, not just click through a sequence of menus. It also includes verification steps because generated reference docs can look complete while still carrying broken examples or unresolved schema links.
