---
title: A notebook, not a brain
date: 2026-11-28
summary: What working on memory for the Sakana App agent taught me about what to save, how to find it again, and the underrated art of forgetting.
tags: [sakana-app, agents, memory]
sakana: true
order: 5
---

Every chatbot has memory now. It's on the feature list right next to "dark mode", and it gets about as much thought.

Then you work on one, and you find out memory is less of a feature and more of a long argument with yourself about what deserves to be remembered.

## The stranger at a party

A model with no memory is the person at a party who asks what you do for work. Every single time you meet. You've told them. Twice. They were very nice about it both times.

Inside one conversation it's fine, because the whole conversation sits in front of the model. Close the tab, open a new one, and you're a stranger again. Your name, your job, the fact that you want answers in Japanese, the project you spent an hour explaining: gone.

So "add memory" sounds simple. Remember stuff. How hard can it be?

## Half brain, half stationery

The first thing I had to unlearn was the word itself. "Memory" makes you picture a brain, something that absorbs experiences and quietly gets wiser. What you actually build is closer to a notebook. Somewhere outside the model, you write things down. Later, you decide what to read back in.

That split, writing and reading, turns one feature into two very different problems.

**Writing: what goes in the notebook?** Too little and the memory is useless. Too much and it's worse than useless, because now every conversation starts with a pile of half-relevant facts, and the model treats all of them like instructions. Someone mentions once that they're planning a trip to Osaka, and for the next month every answer has a gentle Osaka flavour. (Asked for a pasta recipe? Have you considered takoyaki?)

**Reading: what comes back out?** You can't paste the whole notebook into every request, so you pick. Pick by similarity and you get things that sound related but aren't useful. Pick by recency and you lose the important stuff from three weeks ago. Most of the craft is in this choice, and none of it is glamorous.

## Things I now believe about memory

**Save less than you think.** A fact is worth keeping if it would change a future answer. Someone's job, their language, how they like things formatted: yes. The fact that they were tired on Tuesday: no.

**A memory is not an instruction.** Whatever gets saved comes back later looking official. If a webpage or a pasted email can sneak "always reply in pirate speak" into memory, it will come back next week as if the user asked for it. That's prompt injection with a long fuse. Whatever writes to memory needs the same suspicion as anything else that touches the model.

**People need to see it and change it.** If the app remembers something wrong, the user should be able to look at it and fix it, not wonder why the agent keeps calling them a data scientist. Most of my memory work this month was on exactly this: making editing a memory actually work the way you'd expect. [VERIFY: is it fine to say this was a fix to memory editing, or keep it vaguer?]

**Wrong memories are worse than no memories.** An agent that forgets is mildly annoying. An agent that confidently remembers the wrong thing is creepy and wrong at the same time, which is a rare and special combination.

## Learning to forget gracefully

The part nobody puts on the roadmap is forgetting.

People change jobs, move cities, finish projects, change their mind about pineapple on pizza. A memory that only ever grows ends up as a museum of who you used to be. So a good memory system needs a way to let things go: facts that are out of date, preferences that were never really preferences, plans that already happened.

The best mental model I found is sleep. People don't keep every moment of the day. Something overnight sorts it, keeps what matters, merges the duplicates and lets the rest fade. An agent's memory needs its own version of that tidying, and it matters just as much as the writing.

Honestly, it's a decent rule for people too.

## What I'd tell someone starting on this

Don't start with the storage. Start with three questions, asked out loud, in a room with other people:

1. What should the agent remember about someone?
2. How does it find the right thing at the right moment?
3. When should it forget?

The database is the easy part. Agreeing on those three answers is the actual work.

Next time: how you test memory at all, when the bug is "it remembered something slightly weird three conversations ago". [VERIFY: only keep this line if you want to write a part 2.]
