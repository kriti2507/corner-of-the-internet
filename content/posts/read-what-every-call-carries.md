---
title: Read what every call carries
date: 2026-11-28
summary: Small, boring fixes from making the Sakana App agent faster and cheaper, and the habit behind all of them.
tags: [sakana-app, agents, tools]
sakana: true
order: 4
---

The most useful debugging habit I picked up this year is embarrassingly simple. Print the full request your app sends to the model. Every word. Then read it like a stranger would.

You'll find things. I found things.

## The title that knew too much

Most chat apps give each conversation a short title. Ours used a quick model call: here's the first message, give me five words.

When I finally printed that request, it was carrying the instructions for the code sandbox and the full list of tools the agent can use. To write a title. Imagine briefing someone on fire safety, the building's floor plan, and the office kitchen rules before asking them to name a folder.

Nothing was broken. The titles were fine. It was just slow and wasteful in a way no test would ever catch, because nobody tests the title.

The fix was deleting things. My favourite kind of fix.

## Tools that pile up

An agent works in a loop. The model calls a tool, the result goes back into the conversation, the model calls another tool, and so on. Every result stays in the context, which is everything the model reads on its next turn.

So when the agent did the same kind of thing many times in one task, the context filled up with near-identical tool calls and results. The model was spending its attention rereading its own homework.

The fix was to stop letting every feature add things to the context in its own way, and put one piece in charge of deciding what goes in: a single place that builds the context for each turn. Once there's one door, you can decide what walks through it.

## Don't send the same picture twice

If someone attaches an image and keeps chatting about it, you don't need to process that image from scratch on every turn. Doing the work once and remembering the result made follow-up questions noticeably faster. [VERIFY: fine to mention this without numbers?]

## Someone else should press the buttons

This one isn't code. Before a release, the person who built a feature is the worst person to test it. You know which buttons to press and, more importantly, which ones not to. I pushed for features to be checked by someone other than their author before we shipped, and it caught things that I, the author, would have walked past every time.

## The habit behind all of it

None of these fixes were clever. They came from looking at what the system was actually doing, instead of what I assumed it was doing. Read the request. Open the file. Watch someone else use it.

The agent is only as good as what you put in front of it on each turn, so it's worth knowing exactly what that is.
