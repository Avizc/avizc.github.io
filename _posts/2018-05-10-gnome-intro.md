---
layout: post
title: Hello GNOME!avi@wonderland:~$
date: 2018-5-10
categories: GNOME
---
Oh golly hi! My name is Avi and I love rabbits, cheesecake, and cute things. I'm really ecstatic to be starting off my summer next week as an Outreachy intern for GNOME with my mentor [Philip Chimento](http://ptomato.name/). Finding out I was accepted [was an emotional roller coaster for me.](https://avizajac.com/2018/04/23/outreachy-gnome-beginnings.html)

This summer I'll be working primarily on [GJS](https://gitlab.gnome.org/GNOME/gjs), GNOME's JavaScript interpreter/bindings; and [GObject Introspection](https://gitlab.gnome.org/GNOME/gobject-introspection), middleware that connects the [GNOME Desktop](https://www.gnome.org/) platform libraries written in C to any of the language bindings such as JavaScript (GJS).

One of the things I'll be working on is improving GNOME's asynchronous operations to modern JavaScript so it'll work automatically with JavaScript's Promises and async/await. This requires modifying GObject Introspection with new attributes and an API—that would help GJS and other language bindings like Rust—and rebuilding GJS to work with the new changes so it'll return a JavaScript Promise instead of falling into a ["Pyramid of Doom"](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)) (aka nested callbacks).

This will be done in JavaScript, Python, and C++! I haven't worked much with C++ yet so I'm looking forward to seeing how cute it is.

Contributing to GNOME has been a dream of mine since the first time I touched a machine running the GNOME Desktop environment. I'm really elated that I'll working in several different codebases and languages, implementing new features, talk and get feedback from my mentor and other maintainers, and do my part in helping GNOME.

Much love and thanks to the GNOME community and everyone else in my life. Sending lots of hugs 🐰💙✨