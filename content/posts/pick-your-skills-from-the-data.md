---
title: Pick your skills from the data
summary: How I chose which skills to build for Sakana App by looking at what people actually asked for, and why each skill is a small, separate piece.
date: 2026-11-28
tags: [sakana-app, agents, tools]
series: tools
part: 3
---

There's a moment in every AI product where someone in a meeting says "we should add a skill for X", and everyone nods, because X sounds useful. I've been that someone. This post is about not trusting her.

## What a skill is

A skill is a set of written instructions, sometimes with files or scripts attached, that the model loads only when the task matches. Think of a recipe card. The model can already cook. A card for "make a good slide deck" tells it which ingredients work, what order to do things in, and which mistakes to avoid.

The nice part is that skills live outside the model and outside the agent loop. Adding one doesn't mean retraining anything or rewriting the agent. It's one more card in the box.

## The tempting way to choose

My first list of skills came from my own head. It was a good list. It was also a list of things I would ask for, made by someone who builds AI for a living, which might be the least typical user on earth.

## The way I actually chose

Before writing a single skill, I went to the usage data and looked at what people were really asking Sakana App to do. Not anyone's individual chats, but patterns: which kinds of tasks came up most, and where the answers were weakest.

That changed the list. [VERIFY: say what actually surprised you here, for example a favourite that barely showed up or a boring task that was everywhere.] For the public release in August we shipped four skills, and they were the four the data pointed at.

The lesson isn't new, but it lands differently in your own product: your users are not you, and the data is the cheapest way to meet them.

## Skills fix quality, not just ability

What surprised me most is how much skills improved the quality of answers, not just what the agent could do. The model could already make a document without a skill. With one, it made a document people would actually send to their boss.

Most bad output isn't the model being unable. It's the model not knowing your standards. A skill is where you write the standards down. Together with the sandbox from the last post, it's the difference between "here is a PDF" and "here is a PDF with a table that fits on the page".

## One skill, one addable piece

This ties back to the thing I keep relearning at Sakana. The job isn't writing lots of code. It's breaking a fuzzy goal ("make outputs better") into small pieces that can each be added on their own ("a skill for this kind of task, checked by this evaluation"). Each skill was one of those pieces: scoped, testable, and easy to remove if it turned out to be useless.

## Where my head went next

Outside work, this left me with a question. If a skill is just know-how written down, can a big model write skills for a small one? My hackathon project this month is a harness where a large model studies the system and writes skills, to test whether a small model plus skills can get close to the big model alone.

Early days. Ask me again in a month.
