---
title: MCP, explained without the word "protocol"
date: 2026-11-28
summary: What MCP is in plain words, why everyone is plugging into it, and why connecting a real server took me far longer than writing the code to connect.
tags: [sakana-app, agents, mcp]
sakana: true
order: 6
---

I'm going to explain MCP without using the word "protocol". This is harder than it sounds, because the P in MCP stands for it. Wish me luck.

## The problem it solves

In an earlier note I wrote about giving a model hands: functions it can ask your code to run. Search, run code, read a file.

That works beautifully when you build every tool yourself. It stops working the moment you want the model to use someone else's stuff. Your calendar. A ticket tracker. A company's internal docs. Every one of those has its own way of being talked to, its own login, and its own idea of what a "list of events" looks like.

The old way: for every service, you write a custom adapter in your app. Ten services, ten adapters. Then someone else builds an AI app, and they write the same ten adapters. Then a third team does it again. Everyone is writing the same plumbing, slightly differently, forever.

## The waiter and the menu

Here's the picture that finally made it click for me.

Think of a restaurant. The kitchen is the service: your calendar, your docs, whatever. The model is a customer who's hungry and can't walk into the kitchen.

Without MCP, every customer needs to learn every kitchen's private ordering system. It's chaos.

With MCP, every kitchen hands out a menu in the same format: here's what I can make, here's what you need to tell me for each dish. And there's a waiter who knows how to read any menu, take the order to the kitchen, and bring back the food.

The service publishes the menu (that's the MCP server). Your app is the waiter (that's the MCP client). The model reads the menu, picks something, and the waiter does the rest. A new kitchen opens? Same menu format. Nothing new to learn.

And the old rule from the earlier notes still holds. The model proposes. Your code disposes. The waiter can always say "sorry, the kitchen's closed for you".

## Why everyone is excited

Because now a service writes its menu once, and every AI app that knows how to be a waiter can use it. That's why the list of available servers grew so fast this year. For an app like Sakana App, it means the agent can reach things we would never have built adapters for ourselves.

## Where it makes life harder

Here's the part the hype skips.

**Writing the waiter was the easy bit.** The client side, the plumbing that reads menus and sends orders, took me about two days. Connecting one real, third-party server took the rest of the time I had. [VERIFY: fine to share the rough split like this?]

**Logging in is the real work.** A menu is useless if the kitchen doesn't let you in. Most useful servers need the user to sign in and give permission, and every server has its own opinions about how that works. Getting the sign-in flow right, safely, for a real person clicking through it in a chat app, was most of the job.

**Every menu is a little different.** In theory they all follow the same format. In practice one server describes its tools beautifully and another gives you a tool called `do_thing` with an argument called `data`. The model has to guess, and models guess with great confidence.

**More tools, more confusion.** Plug in a few servers and suddenly the model is reading a menu with dozens of dishes. It gets slower to choose and more likely to pick the wrong one. More hands is not automatically better if the brain can't decide which hand to use.

**You're trusting someone else's kitchen.** A server can return anything, including text that tries to give the model instructions. Whatever comes back from a server has to be treated as information, not orders.

## What I took away

MCP is genuinely a good idea, and connecting to it is worth it. But it moves the hard part rather than removing it. You stop writing adapters, and start spending your time on sign-ins, permissions, and deciding which tools the model should even see.

Next time: what actually happens between "the user clicks connect" and "the model can use it", minus the parts I'm not allowed to show you. [VERIFY: keep this teaser only if you plan a part 2.]
