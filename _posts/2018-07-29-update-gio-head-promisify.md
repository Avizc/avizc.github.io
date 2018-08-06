---
layout: post
title: The Evolution of gio-head.js and Future Direction of Promisify
date: 2018-7-29
categories: GNOME
---

## Coming soon huzzah!

*This is the third (and last one) in a three post series! I recommend pausing here, read [Writing a GIO App - The First Evolution of gio-head.js](https://avizajac.com/gnome/2018/07/29/creating-gio-head.html) then [Creating Promisify for GJS](https://avizajac.com/gnome/2018/07/29/creating-promisify.html) before coming back to this one!*

In the first and second post I covered how I wrote **gio-head.js** and the **Promisify** feature. For reference here are the two current versions of them starting off with **gio-head.js**:

```
const {GLib, Gio} = imports.gi;
imports.searchPath.push('.');
const {promisify} = imports.promisify;
const cancel = new Gio.Cancellable();
let loop = GLib.MainLoop.new(null, false);
const Gio_File_prototype = Gio.File.new_for_path('').constructor.prototype;

promisify(Gio_File_prototype, 'load_contents_async', 'load_contents_finish');

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


And **Promisify**:

```
const promisify = (
    GioType,
    asyncStuff,
    finishStuff
) => {
    GioType[`original_${asyncStuff}`] = GioType[asyncStuff];
    GioType[asyncStuff] = function(...args) {
        if (args.every(arg=>typeof arg !== 'function')) return new Promise((resolve, reject)=>{
            this[`original_${asyncStuff}`](...args, function(source, res) {
                try {
                    let result = source[finishStuff](res);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            
        });
        else return this[`original_${asyncStuff}`](...args);
    };
};
```

I want to make this even more 3cute5world by hiding all of the weird Promisify stuff you currently see all over the **gio-head.js** file. Right now in **gio-head.js** I'm currently having to hardcode this in along with all of the related importing:

```
promisify(Gio_File_prototype, 'load_contents_async', 'load_contents_finish');
```

Sure, people could manually hardcode it themselves too but that isn't nice and means extra code for them to deal with in their applications. People should be able to just develop new things without worrying about any of this. So a possible option of where the **Promisify** feature could reside and live in is the **overrides** section of GJS. To find the GJS overrides in your own build, check out these files by going here:

```
(llzes)avi@localhost:~$ cd ~/jhbuild/checkout/gjs/modules/overrides
(llzes)avi@localhost:~/jhbuild/checkout/gjs/modules/overrides$ ls -la
total 72
drwxr-xr-x. 2 avi avi  4096 Jun 21 14:07 .
drwxr-xr-x. 5 avi avi  4096 Jun 21 14:07 ..
-rw-r--r--. 1 avi avi   199 May 25 22:30 cairo.js
-rw-r--r--. 1 avi avi   159 May 25 22:30 .eslintrc.json
-rw-r--r--. 1 avi avi 14580 May 25 22:30 Gio.js
-rw-r--r--. 1 avi avi  8941 May 25 22:30 GLib.js
-rw-r--r--. 1 avi avi 19879 Jun 21 14:07 GObject.js
-rw-r--r--. 1 avi avi  4739 May 25 22:30 Gtk.js
```

Something to think about: GJS (GNOME's JavaScript language binding), is connecting to the original GNOME platform libraries (written in C using GObject) through GObject Introspection, middleware that connects the two togther. [From my post on GObject Introspection, GObject, GIR, Typelib, and language bindings](https://avizajac.com/gnome/2018/05/22/aboard-the-gi-train.html):

*[GObject Introspection](https://gitlab.gnome.org/GNOME/gobject-introspection/tree/master) is middleware that connects the [GNOME Desktop](https://www.gnome.org/) platform libraries written in C using GObject to any language binding like [GJS](https://gitlab.gnome.org/GNOME/gjs/tree/master/gjs) (JavaScript). What's really awesome about this is that regardless of your favourite managed runtime (e.g. JavaScript with GJS, Python with PyGObject) you can import and use the original class that's written in C without having to re-do it or duplicate work that someone else already did to access it in their preferred mutual runtime. It builds all the metadata required inside the GObject library (using the annotations from the GTK-Doc comments) so any language binding can share and use it natively via importing the GObject Introspection framework into their specific language. Users can write applications in something they're comfortable with compared to writing complex applications in only C.*

Code doesn't always directly translate over well, however, as certain runtimes have different ways of handling things, different approaches as to how things should be written, it might not be supported in that language binding yet, anything different and necessary goes here. Remember how I monkey patched my **_async** function in the last post so it could support both the original callback and my Promise-styled API? If there needs to be something changed for just that one language binding, overrides in your language binding is your best friend.

I could put **Promisify** in the **overrides** now and add a lot more glue to make it work. But that would be hardcoding it in and there are so many more methods out there that aren't **load_contents_async** and **load_contents_finish**, plus the pain to hardcode and document all of them would be a nightmare. In addition there are other language bindings out there that would mutually benefit from a shared solution so they don't repeat all of the same work in their own overrides.

This is where the key part of my internship comes in, [stemming from issue #28 in GObject-Introspection](https://gitlab.gnome.org/GNOME/gobject-introspection/issues/28#note_75381). Now in the middleware level I'm adding three new annotations to the GIR: (async-func FUNC), (finish-func FUNC), (sync-func FUNC), that are automatically generated based off of a specific list of heuristics detailed in the issue by Philip.

If you want to check out what the generated GIR looks like, after you run a build in GObject Introspection open up the GIR file like this (replace vi with whatever editor you like):

```
(llzes)avi@localhost:~/jhbuild/checkout/glib$ vi ~/.cache/jhbuild/build/gobject-introspection/Gio-2.0.gir
```

As an example of what the changes would look like, this is what the method name line in the GIR currently looks like for **load_contents_async**:

```
<method name="load_contents_async"
c:identifier="g_file_load_contents_async">
```

After this all gets done, the GIR will automatically add the new annotations based off the heuristics. In this case **load_contents_async** fits the **_async** heuristic so it'll tag on the **_finish** annotation like so:

```
<method name="load_contents_async"
c:identifier="g_file_load_contents_async" finish-func="load_contents_finish">
```

In the new GIR the **(finish-func)** annotation is pointing us to the **_finish** pairing of **load_contents_async**. The same is also happening in the reverse, with **load_contents_finish** entry now containing **async-func="load_contents_async"**. Imagine this happening for all of the valid **_async** and **_finish** methods out there (plus **_sync**, too) happening automatically.

Language bindings like GJS will parse the GIR like they normally do but now with the added benefit of being able to directly hook onto these annotations for their own purpose. As an example in GJS right now in **Promisify** I have **asyncStuff** and **finishStuff**, with these new annotations I can hook them up directly into it and use them instead of manually going through the entire process myself (or someone else) in the overrides. Isn't this great?

So that's where my project has currently left me, lost somewhere inside of several files in GObject Introspection. Also sorry to Federico for accidentally helping break his build at 5AM (still surprised I made the GUADEC morning bus!) while trying to help me find something related to the attributes oops. Hurray for several hours of lockpicking at the same time though huzzah whoo! 🐰🔓✨

I'm super excited to finish this so we can finally have modern JavaScript in GJS with how we handle asynchronous operations (at the very least it's keeping it super pretty on the surface!), help implement and support hooking up to other similiar things in the other language bindings like Vala and Rust, and overall make things 3cute5me for everyone. See you all next time where I'll hopefully have something actually running by then!

*3cute5me = 2cute4me (too cute for me), by adding +1 to each they're now {3,5}, the first two twin prime numbers!*