---
layout: post
title: Writing a GIO App - The First Evolution of gio-head.js
date: 2018-7-29
categories: GNOME
---

## If you came across this by accident sorry! It's currently a work-in-progress.

*This is the first in a three post series! I recommend reading [Creating Promisify for GJS](https://avizajac.com/gnome/2018/07/25/creating-promisify.html) after this one!*

To start off I want to give some context as to why my code and mindset in these three posts may be a bit strange sounding/looking.

At GUADEC 2018 (Almería, Spain) during my portion of the internship lightning talks I briefly mentioned how I approach problems via a blackbox implementation mindset. I tend to avoid reading anything except for documentation; however, after a miserable week in the beginning of my internship head slamming on walls from being stubborn trying to do it alone (I don't like wasting people's time if I have nothing good to show yet) I've since learned to also reach out and ask for help and get feedback, too.

So many thank you's to my wonderful mentor Philip Chimento for being really patient with me as I figure out the balance of working on my own and asking for feedback/help/code review/more information/resources/there's so much whoops. Also whoops that these three posts have taken me way longer than I had imagined because I kept erasing everything and beginning from scratch again.

In a separate post I'll expand on my struggle with these issues. For now if you've ever wanted to understand how GIO apps work or been curious as to how my code looks like in-progress before clean up these three posts are for you! Whatver the reason may be, here's how I wrote my first GIO application 🐰✨

## The Concept

Philip suggested I re-implement the **head** utility, which by default prints the first ten lines of a file (e.g. **head FILENAME**), to understand what I'd be working on this summer. It grew to be way more than the simple program I had imagined it'd be with finding random bugs that need to be fixed, learning how GNOME is set up, and more. Every time I thought I could breathe in peace that I was done I'd get another [awesome!] feedback change leading me to learning new super cute ES6 shortcuts, de/re-sugaring things, monkey patching, and so on!

I had only ever used, never written, the **head** utility before so I immediately opened a billion tabs of GNOME's [Gio](https://developer.gnome.org/gio/stable/) and [GLib](https://developer.gnome.org/glib/stable/) documentation, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) and the man page to make sure I definitely understood it.

This was the [nice disaster](https://gitlab.gnome.org/llzes/gjs/blob/10aeae0cef5012588acf8d2f8b11a24e790a82d0/examples/gio-head.js) I had at one point with all the original notes to myself (plus where instead of printing the first ten lines, it printed the first line ten times oops):

```
// Import GLib and GIO 
const {GLib,Gio}=imports.gi;

// https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#g-main-loop-new
// Parameters for g_main_loop_new ()
// context      GMainContext   a GMainContext, when 'null' default contexts are used
// is_running   gboolean       set to 'true' when running but if g_main_loop_run() gets called it'll turn to 'true'
let loop=GLib.MainLoop.new(null,false);

function head(filename){
    // UPDATE: This is incorrect in that there's a better option! I thought this was correct before:
    // "g_file_new_for_path() if you have a path."
    // let file=Gio.file_new_for_path(filename);
    // To expand and implement more HEAD features: g_file_new_for_commandline_arg()
    // UPDATE: Technically speaking even putting the filename in is an argument. Using this instead now!
    // "g_file_new_for_commandline_arg() for a command line argument."
    let file=Gio.file_new_for_commandline_arg(filename);
    // https://developer.gnome.org/gio/stable/GFile.html#g-file-load-contents-async
    // Parameters for g_file_load_contents_async ()
    // file          GFile                 Input GFile!
    // cancellable   GCancellable          Optional GCancellable object, null to ignore
    // callback      GAsyncReadyCallback   When request is satisfied call a GAsyncReadyCallback
    // user_data     gpointer              the data to pass to the callback function
    file.load_contents_async(null,function(f,res) {
        let raw_content;
        let content_params;
        let lines=0;
        let rabbit;
        try{
            // https://developer.gnome.org/gio/stable/GFile.html#g-file-load-contents-finish
            // Parameters for g_file_load_contents_finish ()
            // file       GFile          Input GFile
            // res        GAsyncResult   A GAsyncResult
            // contents   char           Location for contents of the file
            // length     gsize          Location for length of the contents in the file, or 'null' if it isn't necessary
            // etag_out   char           Location for if an entity tag is needed put it here else put 'null' if it isn't necessary
            // error      GError         A GError or 'null'
            // 
            // 'res' results:
            raw_content=f.load_contents_finish(res)[1];
            // Tried to print out the other parameter values but they all failed with 'fail' or 'undefined'. I'm not entirely sure how to access the length and contents.
            // content_params=f.load_contents_finish(res)[3];
            // Try making everything in the file into a string.
            content_formatted=raw_content.toString();
            // The next two lines worked when I checked to see if I could count how many lines had a linebreak but that only confirmed that I could get linebreaks in the formatted content.
            look_lines=content_formatted.split('\n')
            line_count=look_lines.length-1;
            while(lines<10){
                rabbit+=content_formatted.substring(content_formatted.charAt(0)[lines]+1,content_formatted.lastIndexOf('\n'));
                lines++;
            }
            print(`***PLEASE WORK:***\n${rabbit}\n***ORIGINAL:***\n${content_formatted}`);
        }
        catch(error){
            logError(error);
        }
        finally{
            loop.quit();
        }
    });
    /// This turns the is_running gboolean to true for g_main_loop_new ()
    loop.run();
}

// Check for basic usage error else run head()
if(ARGV.length!==1){
    printerr("Usage: gio-name.js filename");
}
else{
    head(ARGV[0]);
}
```

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

## The Loop

Cool! So now we're past importing. But how do we get our program actually running? We create a loop to keep it nicely together! In GNOME there's **GMainLoop** which *"is a convenient, thread-safe way of running a GMainContext to process events until a desired exit condition is met, at which point g_main_loop_quit() should be called. Typically, in a UI program, this will be the user clicking ‘exit’. In a socket handling program, this might be the final socket closing." [What is GMainLoop](https://developer.gnome.org/programming-guidelines/stable/main-contexts.html.en)*

The way we can import and use it is via [g_main_loop_new ()](https://developer.gnome.org/glib/stable/glib-The-Main-Event-Loop.html#g-main-loop-new) like:

```
let loop = GLib.MainLoop.new(null, false);
```

With loop now imported we want to be able to call it to run **loop.run()** then after have it leave the loop with **loop.quit()**. Yet looking at how the core part of my original code was first written (truncated code via [...]:

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

You'll notice that **loop.run();** occurs outside of the **load_contents_async()** callback with **loop.quit()** in the **finally{}** block.


[](https://gitlab.gnome.org/llzes/gjs/blob/d243b11d2191d0a8a6ad4a85838ddf5346bd372e/examples/gio-head.js)
```
const head = async(filename)=>{
    let file = Gio.file_new_for_commandline_arg(filename);
    try {
        /* Toggle from 'null' to 'cancel' if operation should be cancelled */
        let [, raw_content] = await file.load_contents_async(null/*cancel*/);
        let content_formatted = raw_content.toString();
        print(content_formatted.split('\n', 10).join('\n'));
    } catch (error) {
        logError(error);
    } finally {
        loop.quit();
    }
};

if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    cancel.cancel();
    loop.run();
}
```

## load_contents_async() and load_contents_finish() callbacks

## What is up with that null?

```
file.load_contents_async(null,function(f,res) {
```

```
const cancel = new Gio.Cancellable();
```

```
/* Toggle from 'null' to 'cancel' if operation should be cancelled */
let [, raw_content] = await file.load_contents_async(null/*cancel*/);
```

More of this will be explained and covered in the next post on Promisify!

## The if/else at the end


```
// Check for basic usage error else run head()
if(ARGV.length!==1){
    printerr("Usage: gio-name.js filename");
}
else{
    head(ARGV[0]);
}
```

```
if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    cancel.cancel();
    loop.run();
}
```