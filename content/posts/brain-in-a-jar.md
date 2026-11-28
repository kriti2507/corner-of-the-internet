---
title: A brain in a jar needs hands
date: 2026-11-28
summary: Why a language model needs tools at all, and what changed when we stopped treating Sakana App as a chat box.
tags: [sakana-app, agents, tools]
series: tools
part: 1
---

Ask a chatbot with no tools what the weather is like where you are right now. Go on, I'll wait.

Best case, it admits it can't know. Worst case, it tells you it's a pleasant 22°C with light cloud. Not because it looked out of your window, but because "pleasant, partly cloudy" is a statistically reasonable thing for weather to be. It isn't lying. It physically can't look outside.

When I joined Sakana in June, a big chunk of my job turned out to be this exact problem. The model was smart. The app around it was a chat box. My work for the next two months was turning that chat box into an agent: something that can read your files, run code, follow instructions written for a task, and call other services. This series is what I learned doing it, minus anything that would get me a stern message on Slack.

## The brain in a jar

Here's the picture I keep in my head. A language model on its own is a brain in a jar. A ridiculously well-read brain, which absorbed a huge chunk of everything people ever wrote, and then at some point in training the lid clicked shut. It knows a lot about the world up to that moment. It can do nothing in the world after it.

That gap shows up in three very practical ways.

**It's frozen in time.** Its knowledge stops where its training data stopped. Today's news, a price, last night's match: all answered from a snapshot that might be months old. It also doesn't know the snapshot is old, which is the fun part.

**It can't touch anything.** Text in, text out, that's the whole contract. It can write a lovely email and can't send it. It can write the exact query you need and can't run it. It will say "I'll book that for you!" with total sincerity and then book nothing.

**It's weirdly bad at exact things.** A model predicts plausible text, and plausible and correct are different animals. Multiply two big numbers, count the letters in a word, add up a column in a spreadsheet, and you often get something that looks right and isn't. (The strawberry saga was real. We were all there.)

The part that scared me most as an engineer: a model without tools doesn't fail like normal software. No crash, no red text, no stack trace. It hands you a calm, well-formatted, wrong answer in exactly the voice it uses when it's right.

## Giving it hands

The fix is boring on paper. A tool is a real function that the model can ask your code to run. Live weather? Give it a function that calls a weather service. Exact maths? Let it run code. Something that happened today? Let it search.

You've watched this happen even if you never noticed. The pause before a chatbot answers something current, when it runs a search first: that's a tool. When you drop a messy spreadsheet into a chat and it crunches the real numbers instead of eyeballing them, it's quietly writing and running code somewhere: also a tool.

In both cases the actual work happens outside the model. The model's job is narrower than it looks. Pick a function, pick the arguments, hand off, and wait for real code to bring back a real answer.

The model proposes. Your code disposes.

## What "adding tools" actually meant

Here's the thing nobody tells you. "Add tool calling" sounds like one feature. In practice it was a whole family of them, and each one was its own small system:

- **Files as a tool.** Reading an attached PDF, image or slide deck, built so that a new file type is one more handler and not a rewrite.
- **A code sandbox.** A small computer the model can run code on, to make charts, documents and files you can download. That's part 2.
- **Skills.** Written instructions the model loads when a task matches, like a recipe card for "make a good slide deck". That's part 3.
- **A way to plug in outside tools.** Which is where MCP comes in, and it gets its own series.
- **Guards around all of it.** The moment a model can do things, you have to decide what it's allowed to do.

The biggest lesson for me wasn't about any one of these. It was learning to see the agent as a set of small, separate pieces that can each be added without touching the rest. If adding a file type means editing the agent loop, the design is wrong. If adding a skill means redeploying everything, the design is wrong. A good agent is mostly a good place to plug things in.

I used to think the clever part of AI engineering was the prompt. Now I think it's the plumbing, and knowing which pipe to add next.

Next up: what happens when you give the brain in a jar an actual computer.
