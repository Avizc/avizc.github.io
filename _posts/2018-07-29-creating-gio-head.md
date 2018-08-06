---
layout: post
title: Writing a GIO App - The First Evolution of gio-head.js
date: 2018-7-29
categories: GNOME
---

*This is the first in a three post series! I recommend reading [Creating Promisify for GJS](https://avizajac.com/gnome/2018/07/29/creating-promisify.html) after this one!*

To start off I want to give some context as to why my code and mindset in these three posts may be a bit strange sounding/looking.

At GUADEC 2018 (Almería, Spain) during my portion of the internship lightning talks I briefly mentioned how I approach problems via a blackbox implementation mindset. I tend to avoid reading anything except for documentation; however, after a miserable week in the beginning of my internship head slamming on walls from being stubborn trying to do it alone (I don't like wasting people's time if I have nothing good to show yet), I've since learned to also reach out and ask for help and get feedback, too.

So many thank you's to my wonderful mentor Philip Chimento for being really patient with me as I figure out the balance of working on my own and asking for feedback/help/code review/more information/resources/there's so much whoops. Also whoops that these three posts have taken me way longer than I had imagined because I kept erasing everything and beginning from scratch again.

In a separate post I'll expand on my struggle with these issues. For now if you've ever wanted to understand how GIO apps work or been curious as to how my code looks like in-progress before clean up these three posts are for you! Whatver the reason may be, here's how I wrote my first GIO application 🐰✨

## The Concept

Philip suggested I re-implement the **head** utility in JavaScript (GJS) with asynchronous callbacks, later converted to [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), new language features in ES7, to understand what I'd be working on this summer. This post will be covering the traditional callbacks version of the re-implemented **head** utility, with the next post moving us to the new modernised version using Async/Await thanks to the Promisify feature. For anyone who's unfamiliar with **head**, it's a utility that by default prints the first ten lines of a file (e.g. **head FILENAME**).

My **head** project grew to be way more than the simple program I had imagined it'd be with finding random bugs that need to be fixed, learning how GNOME is set up, and more. Every time I thought I could breathe in peace that I was done I'd get another [awesome!] feedback change leading me to learning new super cute ES6 shortcuts, de/re-sugaring things, monkey patching, and so on!

I had only ever used, never written, the **head** utility before so I immediately opened a billion tabs of GNOME's [Gio](https://developer.gnome.org/gio/stable/) and [GLib](https://developer.gnome.org/glib/stable/) documentation, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) and the man page to make sure I definitely understood it.

[This was one of the iterations](https://gitlab.gnome.org/llzes/gjs/blob/10aeae0cef5012588acf8d2f8b11a24e790a82d0/examples/gio-head.js) I had at one point with all the original notes to myself, plus where instead of printing the first ten lines, it printed the first line ten times oops:

<img src="/images/2018/July/oops-gio-head.png">
<img src="/images/2018/July/oops-gio-head-2.png">
<img src="/images/2018/July/oops-gio-head-3.png">

Yikes. Thankfully 43 minutes after that I pushed my [first working re-implementation](https://gitlab.gnome.org/llzes/gjs/blob/7ed1a5dcfecdc55fc80408d372547b024eec5b65/examples/gio-head.js) and shortly after a [cleaned up version](https://gitlab.gnome.org/llzes/gjs/blob/2894896baa7fe2c447b78bebd130cc4737482390/examples/gio-head.js):

```
const {GLib,Gio}=imports.gi;

let loop=GLib.MainLoop.new(null,false);

function head(filename){
    let file=Gio.file_new_for_commandline_arg(filename);
    file.load_contents_async(null,function(f,res) {
        let raw_content;
        let content_formatted;
        let look_lines;
        let line;
        try{
            raw_content=f.load_contents_finish(res)[1];
            content_formatted=raw_content.toString();
            look_lines=content_formatted.split('\n',10);
            for(let lines=0;lines<look_lines.length;lines++){
                print(look_lines[line]);
            }
        }
        catch(error){
            logError(error);
        }
        finally{
            loop.quit();
        }
    });
    loop.run();
}

if(ARGV.length!==1){
    printerr('Usage: gio-head.js filename');
}
else{
    head(ARGV[0]);
}
```

Before you ask, "Avi what is up with your coding style," or, "Why do you hate spaces between everything?" (Answer: You're lucky I even entered empty lines between stuff here!) after this I had to make [new ESLint rules](https://gitlab.gnome.org/GNOME/gjs/merge_requests/152) as no one else had wrote the same way I do before oops. So there you go, much more "normal looking" code after this!

Some of this was covered under my notes in my code earlier but to break down the necessities to understand the situation (and a little more):

## Importing

At the very top of each file (for me) I imported GLib and GIO:

```
const {GLib, Gio} = imports.gi;
```

Clean and simple, right? Later on when I created a second file I had to import my function from there to **gio-head.js**. I tried to default back to how I've always done imports outside of GJS like:

```
import {Promisify} from 'promisify';
import {Promisify} from './promisify';
```

This didn't work which confused me. Turns out it's not supported in GJS! So to import my function into this file I had to do:

```
imports.searchPath.push('.');
const {promisify} = imports.promisify;
```

## The Main Loop

Cool! So now we're past importing. But how do we get our program actually running? We create a loop to keep it nicely together! In GNOME there's **GMainLoop** which *"is a convenient, thread-safe way of running a GMainContext to process events until a desired exit condition is met, at which point g_main_loop_quit() should be called. Typically, in a UI program, this will be the user clicking ‘exit’. In a socket handling program, this might be the final socket closing." [What is GMainLoop](https://developer.gnome.org/programming-guidelines/stable/main-contexts.html.en)*

A crucial thing to be aware of is that no main loop means no asynchronous operations as it'd exit immediately. A way to remember this is that asynchronous operations don't hold things up for you: it's like when you're packing a bag (main loop) and throwing things (asynchronous operations) into it, holding your belongings (program) together; synchronous operations hold things up for you until you're done so you don't need the main loop: it's like your friends who make sure you actually pack in order (execute the program) your stuff (synchronous operations) from a list top-to-bottom.

The way we can import and use it in this example is via [g_main_loop_new ()](https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#g-main-loop-new) like:

```
let loop = GLib.MainLoop.new(null, false);
```

The reason we have to import this, from GLib as an example here, is that there are actually more than one GMainLoops' you can choose from, whether it be from GLib, GTK 3 or 4, and whichever one you choose for the event loop is used to run your program. This lets you be really flexible when you write a program for whatever your needs specifically are. 

With the main loop now imported we want to be able to call it to run **loop.run()** then after have it leave the loop with **loop.quit()**. Yet looking at how the core part of my original code was first written (truncated code via [...]:

```
file.load_contents_async(null,function(f,res) {
    [...]
    try{
        raw_content=f.load_contents_finish(res)[1];
        [..]
        }
    }
    catch(error){
        logError(error);
    }
    finally{
        loop.quit();
    }
});
loop.run();
```

You'll notice that **loop.run();** occurs outside of the **load_contents_async()** callback with **loop.quit()** that terminates the program in the **finally{}** block. Weird right?

This is actually totally normal it turns out and occurs because the loop isn't asynchronous! From my notes or at least my understanding of how this works:

* While it's going from top-to-bottom, while it hasn't quite hit **loop.run()** yet, it's still reading and prepping my **load_contents_async()** and **load_contents_finish()** callbacks waiting for it to be called to run
* **loop.run()** needs the termination clause, or **loop.quit()**, to understand when to terminate because as it reads through the file it's preparing to launch the callbacks after it has read them with the instruction of when to terminate, otherwise it'll be stuck

With that knowledge in mind, we're actually able to move our **loop.run()** from the program itself to however we launch it. [This is how it's set up now with all the new changes that I'll be covering in the next two posts](https://gitlab.gnome.org/llzes/gjs/blob/d243b11d2191d0a8a6ad4a85838ddf5346bd372e/examples/gio-head.js) so don't worry if it looks really weird now but once again I'm sticking [...] in places to truncate things that you all don't need to care about yet:

```
const head = async(filename)=>{
    [...]
    } finally {
        loop.quit();
    }
};

if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    loop.run();
}
```

You can see that **loop.run()** is now after our **head(ARGV[0])**! This makes things more efficient for us by first checking if the conditions we're requesting aren't met (and if so return an error message), else we now first run through the program we've wrote, **head()**, then proceed to run it with **loop.run()** as everything is ready to go for us at this point. Huzzah!

## load_contents_async() and load_contents_finish() callbacks

This part makes me really excited as it's really about language capabilities and features! Callback functions have typically been how we've run asynchronous operations. It works, but later on it gets hard to read as it tends to self obfuscate itself into callback hell. That's where things like Promises kick in, with it being much easier to read, your Promise can only either pass or fail once, **try/catch** work much better with handling errors, and so on. Even better are **Async/Await** functions in ES7 whoo!

Buuuuut the original GNOME libraries were built with callback functions to handle asynchronous operations, that [usually] end in **_async()** and **_finish()**. A skeleton example would be [**g_file_load_contents_async()**](https://developer.gnome.org/gio/stable/GFile.html#g-file-load-contents-async) and [**g_file_load_contents_finish()**](https://developer.gnome.org/gio/stable/GFile.html#g-file-load-contents-finish) nested, as it's the **_async()** and **_finish()** functions I used for my project:

```
file.load_contents_async(null,function(f,res) {
    [...]
    raw_content=f.load_contents_finish(res)[1];
});
```

While this does work, it'd be fantastic to convert and move over our code eventually so a developer would only have to call a single function and also not worry about all the parameters and things that go into it. Wouldn't it be great being able to just do:

```
const head = async(filename)=>{
    [...]
    try {
        [...]
        let [, raw_content] = await file.load_contents_async(null/*cancel*/);
        [...]
    } catch (error) {
        logError(error);
    } finally {
        loop.quit();
    }
};
```

No more worrying about **load_contents_finish()** and all the parameters outside of either **null** or **cancel** in this case. Awesome right? I'll be covering this much more in-depth in the next two posts, just keep this in the back of your mind for now as context.

## What is up with that null/*cancel*/ thing?

Huzzah I'm glad that you, cough I, asked! Maybe or maybe you didn't notice but maybe you saw a difference in the two skeleton code samples I provided. In the past before with the original function it looked like:

```
file.load_contents_async(null,function(f,res) {
```

And my newest version of the code now looks like:

```
/* Toggle from 'null' to 'cancel' if operation should be cancelled */
let [, raw_content] = await file.load_contents_async(null/*cancel*/);
```

The **null** comes from the optional **cancellable** parameter of **g_file_load_contents_async()**:

```
// Parameters for g_file_load_contents_async ()
    // file          GFile                 Input GFile!
    // cancellable   GCancellable          Optional GCancellable object, null to ignore
    // callback      GAsyncReadyCallback   When request is satisfied call a GAsyncReadyCallback
    // user_data     gpointer              the data to pass to the callback function
```

There are times where you'd want to use **cancellable**, aka a [GCancellable](https://developer.gnome.org/gio/stable/GCancellable.html) object, to cancel synchronous and asynchronous operations. For now if you're curious and wanting to play around you can create it like this:

```
const cancel = new Gio.Cancellable();
```

More of this will be explained and covered in the next post on Promisify!

## The if/else at the end

While this has mostly been covered in the part on main loops, I thought it was important to still show these two versions side-by-side like so.

Version 1:

```
// Check for basic usage error else run head()
if(ARGV.length!==1){
    printerr("Usage: gio-name.js filename");
}
else{
    head(ARGV[0]);
}
```

Version 2:

```
if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    cancel.cancel();
    loop.run();
}
```

I think it's always good to compare the difference between versions of your code to see how far you've come, and get a further understanding of how things work. Earlier we learned that it was okay to place **loop.run()** after calling the **head()** program, but additionally in Version 2 I am also triggering the **cancellable** object to cancel the operation by calling **cancel.cancel()**. In the real **head** utility I wouldn't actually want to cancel the operation but I added this functionality in so I could test **cancellable**, making sure it still worked with my **Promisify** function.

See you all in the next post on Promisify!