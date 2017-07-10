---
layout: post
title: "Play Date at the Airlines - Part 5: Fun Things Observed"
date: 2017-7-10
---

Oh golly this is what I’ve been wanting to write in the last few posts, I can’t wait to share now! As with the last one I’ll provide things the airlines can/should do to alleviate/fix the issues. And remember to not do anything that’ll get you in trouble, everything I’m saying here are things I’ve observed or researched into that I found interesting.

Disclaimer: Everything here was done in research, observance, Google-ing, no SSI.

## Contents

* [Introduction](https://avizc.github.io/2017/07/08/play-date-at-airlines-part-1.html)
* [Things to know about airlines](https://avizc.github.io/2017/07/08/play-date-at-airlines-part-2.html)
* [Airline Culture and Common Issues](https://avizc.github.io/2017/07/08/play-date-at-airlines-part-3.html)
* [Inner Airline Employee Views and Issues](https://avizc.github.io/2017/07/10/play-date-at-airlines-part-4.html)
* Fun Things Observed
    * Legacy system errors
    * New system errors
    * Humans being humans
    * Social media
* Passenger walk through
* Conclusion

Airlines are very aware of some prominent issues and security weak points. It’s what they do or don’t do that counts. When I was attempting to report issues the response typically was:

* “No one else would have thought of this but you.”
* “Non-airline people would never understand our system.”
* “It’d be a felony if someone tried to do that.”

Yet while working on my CFP and talking to my friends for feedback on things I discovered or different vulnerabilities, as fun and hilarious those conversations were with them giving even more examples I may add to this post eventually, a common response to most of the things I found was, "I have actually found [said issue] myself before."

## Legacy system errors

One massive complaint from anyone in the airlines are the errors with old legacy software. For example the boarding pass readers are really old in terms of the software being run on them. There was a situation I observed listening to at [airline] where the gate agent was rushing to board and an unknown passenger who had not paid, aka did not have an eTicket, was able to get onto the flight without triggering the boarding pass scanner or the gate agent. That unknown passenger happened to be sitting in an exit row which only popped up on the scanner an event for the exit row notice only as that’s the most prominent event in order of relevance.

That’s pretty scary.

A lot of glitches occur frequently in the new systems causing agents to go into the legacy systems. Computer outage protocols are a thing but why do that when you could go into the legacy system? On the other hand newer employees with not much experience outside of brief training exercises don’t know or retain any information once they get into live production on how to use the legacy system. So there’s that divide that is growing, too.

## New system errors

Did I also mention that at least with United’s new system all of the errors show up fully openly on the application? You can see the exact blocks of code that caused it right there. I wasn’t working on learning full-stack web development then but even I knew then that is really bizarre and not normal to have your errors be right there ruining the app.

Folks are told to just ignore them or the coolest new trick to debugging it yourself, right click and hit refresh!

It was looking at the code blocks and causing errors exactly how I ended up succeeding in getting signed in in a web browser for any machine I wanted to be on. I wasn’t completely sure what the parameters were until then. From the time I found the exposed URL to getting the parameters in to signing in and going into restricted flights was about 10 minutes. Someone with more experience than me for sure could and would have done more. I still remember the feeling of going, “Holy flying macarons I’m in a restricted flight.”

The other part of getting myself successfully on the system was that every single thing I needed is right there everywhere. Someone has spent too much time in their life dutifully labelling the machines in a very publicly viewable way.

And sure maybe the public can’t really do anything with the machine ID since they’re internal and wouldn’t make sense. That is if someone doesn’t recognise what a label with some stuff on it directly attached to a monitor means. 

Except what if a frequent traveller started writing all of them down? Found themselves in a browser? Signed in? Since no one had thought to prevent that get request before apparently. What else have they not done yet?

If you're already inside of the system as an employee and know how to get into any restricted or locked flight the implications of consequences are even higher. In the event of a crash the airlines immediately remove access to the flight and the flight manifest from the rest of the system. That way they prevent inside folks from leaking to the public and media on who all the potential lost souls were.

But what if you can get direct access to that machine that was locked down?

Outside of that at ticket counters, gates, and so on you’ll see and find phone numbers, legacy system entries for specific things, and other joyous fun things everywhere. Ask if you can use a phone sometime maybe even.

There’s a label on that, too.

## Humans being humans

Human error occurs pretty frequently. Sometimes the lack of communication causes a massive rush and fear such as when no one informs the gate agents passengers have deplaned and are coming up the jetbridge which causes a lot of confusion when alarms are blaring while they’re working on something else at the gate. Or an inexperienced agent accidentally breaking a PNR sometimes to the point you have to redo the entire reservation.

There are also a lot of things airline folks aren’t supposed to give you. That includes the PBT (Passenger Boarding Total)/ flight totals. They shouldn’t tell you if a specific passenger is on a flight ever. They’re also supposed to not  tell you the planes off and on times along with the real-time flight movement, aircraft specific information, and more. What I mean here by on and off is:

* Out - This is when they release the brakes at the gate
* Off - This is when the aircraft is officially off the tarmac in the air
* On - This is when the wheels touch down on the tarmac landing
* In - This is when they set the brakes at the gate

You may say, “But I can track any flight on [flight tracking site]!” That’s not fully accurate, either. Sure it might be close enough margin wise for you to be satisfied with but by FAA and rules internationally (that all vary) if you’re the public you’re in a different class than say, the airline operating the flight. The public does not need to know the exact location of where the flight is at the given moment. Depending on where the flight is you can expect a delay of half a minute to minutes from the true flight movement location.

Also I am very specific when I say “release the brakes” or “set the brakes” here. I won’t go much into detail here or explain more because of things but it can lead to some really fun times for passengers anyways. If I find the exact thing I want to describe here online I'll share it.

And yes, you may have the aircraft type you’re on but every airline has their own variations of them and things they know about their planes that folks outside of it do not need to know.

Going back to the human side of things there are a lot of things airline folks aren’t supposed to give you. That includes the PBT (Passenger Boarding Total) or flight totals. They shouldn’t tell you if a specific passenger is on a flight ever.

… but airline folks are family so this happens a lot:

“Hi, sorry I hope I’m not bothering you but I’m trying to get back home with my family tonight plus I’ve got work tomorrow. I haven’t had any luck with flights because everyone is oversold. We’re on the standby list for another flight but is there space for [x] on this flight or are you expecting a full flight?”

A few things can happen here. Either your gate agent will strictly adhere to rules (as they should) or the agent will tell you everything. This can play out a few different ways:

* “Can I have your itinerary?”
* “Did you go on [airline booking portal that shows the numbers]?”
* “Here let me check for you. Yup, we have [x] seats available.”
* ”We’re currently booked at [x] right now, there should be seats for sure.”
* “We’re a full flight sorry.”
* “We have plenty of seats open!”

On the agent asking for your itinerary or about the booking numbers sometimes you might also hear:

* “I’m actually with [other airline] but wanted to just check here so I could switch my family over.”
* ”I’m booked with another airline right now but at this point I’m pretty desperate to get home and want to buy tickets as long as it’s not oversold.”

You can get the idea from here.

Or maybe you’re waiting in line about delayed baggage when you hear:

“Hi, so I tried to non-rev my grandmother from [city] but she can’t speak English and I ended up having to buy tickets for her splitting it into two trips. I’m getting really nervous and wanted to know [if they’ve started boarding/if she’s already onboard/when they’ll be in the air/saw on Flightaware they’ve pushed back but don’t see that it’s in the air yet].”

Once again either the agent will either follow protocol by saying they’re not allowed to disclose passenger information or to look at the boards outside in the airport. Or they’ll ask for an itinerary, a name, a flight, etc.

Since we want to be helpful to each other since it’s one big family, right?

Also maybe you’re waiting in line to get rebooked and hear a conversation happening with someone who also works at the airlines talking to the gate agent on how to rebook them like:

“Hey I know you’re new to this but there’s a way faster way to do this. Open up [legacy system]. Yup, there we go. Signed in? Yeah? Cool so now type this in…”

A lot of inexperienced agents type in entries directly from airline employees from other stations simply because they were told to do it. Not much you can do without access to the systems unless you can get someone else to do it for you.

## Social media

Airlines especially in recent times have also been really hit by bad PR whether it be dragging paid passengers off their aircrafts unconscious, forcing mothers to place children on their laps for entire flights, roughly grabbing expensive violins, you get the picture. They know the root of it begins at customer service and care so what are they doing to fix this?

Start employee campaigns of course particularly on social media since what other way is there to raise morale than the beauty of cute photos and selfies with your coworkers?

Take a look sometime at hashtags on Twitter, Facebook, Instagram! You never know what you’ll see there, tehe!
