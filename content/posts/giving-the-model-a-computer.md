---
title: Giving the model a computer
date: 2026-11-28
summary: What building the code sandbox in Sakana App taught me about lifecycles, fonts, network rules, and checking files nobody opens.
tags: [sakana-app, agents, tools]
sakana: true
order: 2
---

The single most useful tool you can give a language model is a computer.

Not a calculator, not a search box. A small, throwaway machine where it can write code and run it. Once the model can run Python, a lot of its weak spots stop being weak. Maths becomes exact, a spreadsheet gets actually analysed, and "make me a chart" produces a real chart instead of a description of one.

So in July I spent a lot of my life inside sandboxes. Here's what they taught me.

## A tiny, disposable computer

The idea: every conversation that needs to run code gets its own isolated environment. The model writes code, the sandbox runs it, the output (text, an error, a file) goes back to the model, and the model decides what to do next. If the code does something silly, it does something silly in a box that gets thrown away.

The files are the fun part. A chart, a PDF report, an HTML page, a cleaned-up CSV. The model makes the file in the sandbox, and you get something you can download and actually use.

## Lesson 1: the lifecycle is the product

My first version did the obvious thing. Start a sandbox when needed, kill it when done. It worked beautifully for one user, which is the most dangerous way for anything to work.

People don't use a chat app in neat sessions. They ask something, wander off for lunch, come back, and ask a follow-up about the same file. Killing the sandbox meant losing their files. Keeping every sandbox alive meant running out of room for everyone else.

The answer was boring and correct: pause instead of kill. A paused sandbox keeps its state but stops using resources, and wakes up when the conversation does. Add timeouts, add a restart for when things go wrong, and suddenly concurrency stopped being a fire.

If I had to squeeze this into one line: design for the user who leaves halfway through, because that's every user.

## Lesson 2: preinstall what the model reaches for

The model imports whatever it thinks is normal. If that library isn't there, it tries to install it, or works around it, or fails in a creative way. So we built our own sandbox image with the things it actually reaches for already installed.

My favourite bug of the summer lives here. Lots of people in Japan want charts with Japanese labels, and matplotlib, Python's go-to plotting library, doesn't come with a Japanese font. So every Japanese label came out as a neat row of empty boxes. (The internet calls these tofu. I call them a very polite way of saying "I can't read this".)

The fix was one font package. Finding it took looking at real outputs instead of trusting that "the chart rendered" meant "the chart was right".

## Lesson 3: network access is a decision

A box that can run any code and reach the whole internet is a box someone will eventually misuse. A box with no network can't install a package or fetch the dataset you linked. Neither extreme works.

So the network rules became their own small piece of the system, chosen on purpose, with room to change them as needs change. I won't go into what we allow. I will say that the conversation about what the sandbox may reach took longer than building the sandbox. [VERIFY: true, or should this go?]

## Lesson 4: someone has to open the files

Here's a sneaky one. When a model writes text, you read it while testing, so you notice when it's bad. When it makes a PDF, nobody opens the PDF. It "succeeded". It also had a table running off the edge of the page.

I ended up writing automation to check the quality of outputs instead of eyeballing a handful, and used what it found to improve both the sandbox setup and the instructions the model follows (more on those next time). Generated files need testing like any other code.

## What I'd tell myself in June

Start with the user who leaves. Open the actual file, not the success message. And put the language your users write in on the font list on day one.

Next up: skills, or how I chose which ones to build by looking at what people actually asked for.
