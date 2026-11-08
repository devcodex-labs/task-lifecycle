# Markdown render width

This file is the sole owner of controllable rendered width for Markdown this session generates or updates.
Page must-create duty, lifecycle and other Page formatting stay in [grok-bot-page.md](grok-bot-page.md).
Reading this file does not load that Page file, does not create a Page and does not apply Page items.

## When the floor applies

Apply this file when this session generates or updates Markdown and can control the rendered layout.
That includes a project analysis and any other Markdown, with or without a Page.
The Markdown source does not itself have a pixel width.
Do not insert HTML or CSS into a `.md` file to force a width.
On a layout this session controls, the body must not be narrower than 1024px when the available viewport permits it.
Narrow viewports use available width. Do not pick a column layout that narrows a wide viewport.
Public pages.grok.bot links with the platform 960px cap are exempt from the 1024px floor.
The cap is a platform limit, not a chosen narrow layout.

## Surfaces this session does not control

A host chat attachment preview, a platform Markdown renderer, or any other viewer this session cannot set,
is outside this floor. Do not claim that preview or renderer meets 1024px.
State the limit: the width is whatever that surface applies.
Generating or updating the `.md` does not prove the floor was rendered.

## What this file does not change

It does not require a Page, a formal source, an approval SHA or any Page layout item.
It does not add a confirmation stop. It does not authorize a commit, a push or a release.
