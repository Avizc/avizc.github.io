---
layout: post
title: "Play Date at the Airlines - Part 2: Things to Know About Airlines"
date: 2017-7-8
---

Disclaimer: Everything here was done either in research, observance, Google-ing, there's no SSI.

## Contents

* [Introduction](https://avizc.github.io/2017/07/08/play-date-at-airlines-part-1.html)
* Things to know about airlines
    * Hackers? Bug bounty?
    * No internal bug reporting
    * False sense of security
* [Airline Culture and Common Issues](https://avizc.github.io/2017/07/08/play-date-at-airlines-part-3.html)
* Inner airline culture
* Passenger walk through
* Fun things observed
* Conclusion

## Hackers? Bug bounty?

Airlines have a goal to essentially transport as many folks possible in an aeroplane to their destination and gain revenue. They really don’t like their issues being pointed out whether customer service related to security flaws. It’d be a bit rough revenue wise to keep passengers if all they hear is, “Massive security flaw found allowing anyone on the internet to do whatever on an airline’s system.” That and it’s against federal law to essentially do anything to an airline.

They really do not like hackers if that wasn’t already fairly obvious. One notable example would be sidragon, aka Christ Roberts, who was banned by United Airlines and detained by the FBI in April 2015 followed by a search warrant.

Shortly after this incident United Airlines came out with a [bug bounty program](https://www.united.com/web/en-US/content/Contact/bugbounty.aspx). Except it’s a rather flawed bug bounty program with giving out miles instead of a cash payout, the limitations on what you’re allowed to do are strict. A specific line that should be noted in their bug bounty program is:

"The researcher submitting the bug must not be a current or former employee of United Airlines, any Star Alliance™ member airline or any other partner airline, or a family member or household member of an employee of United Airlines or any partner airline."

Okay, cool. So I’ve got no intention of gaining a profit by submitting bugs, I just want to help out with internal vulnerabilities. But where can I report this to?

Nowhere.

## No internal bug reporting and why

From my own research of trying to report vulnerabilities I discovered there was no internal bug reporting program. There were e-mails that led to nowhere in my attempt to reach out to the team developing it. It wasn’t until I spoke to a developer in-person for a meeting I attended on the transition to the new system about it that a few weeks later it was fixed. This ended up being about three or four months from when I discovered it which means it was vulnerable most likely from who knows when?

Since this experience I’ve learned and realise now I could have tried out a lot more things that I’m fairly sure would or would have worked. I’m not sure of course without messing around with it myself. But I know that it wasn’t their priority since they’re internal systems.

As far as I am aware currently there is no airline with an internal bug bounty program or a place to report vulnerabilities to. I believe this is for several reasons whether it be they assume the folks working at the airlines aren’t technically capable of understanding the applications and how they work, the bureaucracy that exists structurally employee wise, the entire airline family culture that exists, and they’re really into scaring their own employees.

## False sense of security

When you undergo training they state all the federal fines and prison time for doing various things to the airlines. With the overall safety and security, PII, and other things employees have access to there are scary paragraphs and paragraphs of warnings on everything they do. So most folks are naturally not going to want to poke around or aren’t bothered enough to do so.

In an odd twist during training we were warned but also taught how to look up frequent flier numbers by finding information on celebrities. Sure everyone I knew at least forgot how to do it since the Premier Desk can easily do that for you but what about the folks like me who didn’t?

Not that it really matters because there are a slew of other ways an airline employee can get access to your information if they wanted to.

While finding things to support what would have been this talk I accidentally came across pages and pages of PDFs from various places with entries to several legacy systems. There are certain legacy systems like SABRE that are really common as they’re taught in hospitality, used by travel agents, and such. As a non-airline person you may not know if you came across an exact entry for entry document of a specific airline or if the document has part of the entries.

But if you read these documents that are currently publicly accessible you’ll start getting a quick understanding of how the login system works with sine numbers, agent sines, duty codes, and whatever else is required.

To an airline keeping (non-airline) people out is more important to them than (non-airline) folk knowing the stuff. So long as you don’t get access to it that’s what matters. That and waving around the federal prison and fines warning for employees. If someone does something wrong they’ll go to prison and that’s that. End of story.

Which is pretty scary to think of for anyone else like me.

Especially since I did discover I was able to open up everything including any flight, restricted or not, in a web browser with full access. They really need to set up proper vulnerability reporting internally. They do have a feature that allows you to submit issues with the application but it isn't for security vulnerability (plus isn't used widely by employees because do you really have time to report a weird glitch between rebooking customers?).
