---
layout: post
title: Creating Promisify for GJS
date: 2018-7-29
categories: GNOME
---

## Coming soon huzzah!

*This is the second in a three post series! I recommend reading [Writing a GIO App - The First Evolution of gio-head.js](https://avizajac.com/gnome/2018/07/29/creating-gio-head.html) before this one if you haven't yet, and if you've finished this one head over to [The Evolution of gio-head.js and Future Direction of Promisify](https://avizajac.com/gnome/2018/07/29/update-gio-head-promisify.html) after!*

In the first post we covered how I first got to writing **gio-head**, learning and understanding how GIO and GLib work, then using that theoretical knowledge into writing an actual program (also having to finally use ESlint on my code oh golly). From there I did a ton of constant cleaning up from code review (thanks Philip!) for various reasons like learning new modern JavaScript syntax. If you want to directly check out where I'm at with this part of the project [here is my branch](https://gitlab.gnome.org/llzes/gjs/commits/wip/prototype-callbacks-to-promises) you can check out!

## Some quick setup for the rest of this post

In the first post I showed an early iteration of **head** that didn't work, and later on the first working iteration I got. If this is your first time seeing and/or using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), hopefully seeing these two side-by-side will help! In this example I'll be starting off with a **gio-head.js** version based off of [this commit](https://gitlab.gnome.org/llzes/gjs/blob/4466c3cd6df937af0094126cb9498f918dc5f43c/examples/gio-head.js) albeit cleaned up. No array literals, trailing commas, rest parameters, or other new cute JavaScript stuff yet! If you want to run this yourself in your GJS build (if you don't have a build yet and are on a Chromebook [here are some instructions](https://avizajac.com/2018/05/26/chromebook-to-gjs.html) I wrote that may not be up to date so be careful):

```
# Open up to the correct directory
(llzes)avi@localhost:~$ cd ~/jhbuild/checkout/gjs/examples
# Create and save the file however you want to. Here's an example:
(llzes)avi@localhost:~/jhbuild/checkout/gjs/examples$ vi gio-head-$i.js
# Now lets run this thing! Going to have it print the README
(llzes)avi@localhost:~/jhbuild/checkout/gjs/examples$ gjs-console gio-head-$i.js README
```

Substitute **$i** with a number and increment it so you don't get confused, or whatever method of naming you like. That said here we go! (I'm calling this **gio-head-2.js** for the rest of this post):

```
const {GLib, Gio} = imports.gi;

let loop = GLib.MainLoop.new(null, false);

function head(filename) {
    let file = Gio.file_new_for_commandline_arg(filename);
    file.load_contents_async(null, function(f, res) {
        try {
            let raw_content = f.load_contents_finish(res)[1];
            let content_formatted = raw_content.toString();
            print(content_formatted.split('\n', 10).join('\n'));
        } catch (error) {
            logError(error);
        } finally {
            loop.quit();
        }
    });
}

if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    loop.run();
}
```

Oh golly it's a little bit more cleaned up from the first post now! But we want to modernise this so lets first convert this over to arrow functions (I'm calling this **gio-head-3.js** for the rest of this post):

```
const {GLib, Gio} = imports.gi;

let loop = GLib.MainLoop.new(null, false);

const head = (filename) => {
    let file = Gio.file_new_for_commandline_arg(filename);
    file.load_contents_async(null, function(f, res) {
        try {
            let raw_content = f.load_contents_finish(res)[1];
            let content_formatted = raw_content.toString();
            print(content_formatted.split('\n', 10).join('\n'));
        } catch (error) {
            logError(error);
        } finally {
            loop.quit();
        }
    });
}

if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    loop.run();
}
```

That wasn't too scary I hope! The only file difference here between the two is that we went from beginning the program with **function head(filename) {** in gio-head-2.js to **const head = (filename) => {** in gio-head-3.js. Cool! But these two versions are still using the callback functions setup with **load_contents_finish()** nested inside **load_contents_async()**.

We eventually want to [get the code looking something like this](https://gitlab.gnome.org/llzes/gjs/blob/609aadada4f3e24e20d48e3d70492935ce1b1fce/examples/gio-head.js) (I'm calling this **gio-head-5.js** for the rest of this post) albeit if you try to run it right now it won't run:

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

From the imports to new modern JavaScript stuff to everything else that's different, that was quite a bit to throw out there, sorry! Considering it's the current point I'm at until the next stage of the project gets completed, in this post I'll be building up to that point from **gio-head-3.js** to **gio-head-5.js**. Feel free to check the differences out now if you want to but by the end of this post and the third post hopefully things will be more clear!

## So what is Promisify?

In **gio-head-5.js** you may have noticed these two specific lines in the file:

```
const {promisify} = imports.promisify;

promisify(Gio_File_prototype, 'load_contents_async', 'load_contents_finish');
```

The first line above is importing my **Promisify** function in from a separate file. If you need an [import refresher in GJS here you go!](https://avizajac.com/gnome/2018/07/29/creating-gio-head.html#importing) The second line, on the other hand, is important to us right now but at some point that entire line and all of the importing stuff related to Promisify will disappear as it'll be happening behind the scenes (more about that in the next post)!

That still doesn't cover what **Promisify** is though, so what is it? If you're unfamiliar with [Node's util.promisify](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) it essentially takes a function written in the Node callback style and returns a version of it that returns a Promise. My **Promisify** is conceptually based off of it, though I realise at some point it should have a different name to not confuse people coming over to GJS from a more "typical" JavaScript development environment (e.g. Node).

## The (rough) beginnings of load_contents_promise()

[Thanks to this issue](https://gitlab.gnome.org/GNOME/gobject-introspection/issues/28#note_75381) I knew from the start I would have to expand my Promisify prototype out so it could apply to any function that ends in **_async** and **_function**. So the first thing I did was try to make a single function called **load_contents_promise()** (my terrible naming convention has carried over from locksport oops) and have it return a Promise that hid **load_contents_async()** and **load_contents_finish()** away from my **head** program. This took me quite a lot longer than I thought it would as it didn't feel intuitive to me as to how I'd actually do this and wrap it as a Promise. Before this project I *thought* I knew how to write and use Promises. This really forced me to dive more in to understand it.

Eventually I finally made progress and started getting there! The following [is a cleaned up version of the original](https://gitlab.gnome.org/llzes/gjs/blob/c43919a4c5cf276a7c4d49012f3c646b0f275aff/examples/gio-head.js) I successfully made.

<img src="/images/2018/July/load_contents_promise-1.png">

A few things to note immediately compared to **gio-head-3.js**:

* There is a new function called **load_contents_promise()** that returns a new Promise, and inside of that new Promise is my entire **load_contents_async()** and **load_contents_finish()** hardcoded in.
* **load_contents_promise()** currently has three parameters: file, cancellable=null, content
* **async** and **await** have been added to the new **head** version (e.g. **const head = async(filename) => {** and **let raw_content = await load_contents_promise(file);**)
* Speaking of, before in **gio-head-3.js** my line **let raw_content = f.load_contents_finish(res)[1];** in **head** is now in the new **head** looking like **let raw_content = await load_contents_promise(file);** with a rather familiar looking line **let result = f.load_contents_finish(res)[1];** in **load_contents_promise**

While I got my new Promise to work successfully, there was still quite a lot to do after. For one I went from a **file.load_contents_STUFF()** setup to **load_contents_STUFF(file)** which would break code compatibility faster than I eat dessert! I also went through several commits [here](https://gitlab.gnome.org/llzes/gjs/commit/9be85871a4e73724a4bca1727fea2c78176a13fc), [here](https://gitlab.gnome.org/llzes/gjs/commit/5919962ac4f50993d3ce93dc6a4c7660c73366a8), [here](https://gitlab.gnome.org/llzes/gjs/commit/8527b7132600e21d54decc5630086b9317222ebb), [here](https://gitlab.gnome.org/llzes/gjs/commit/249cadcdc3574e4da573bcb817019b8becc4d25e), [here](https://gitlab.gnome.org/llzes/gjs/commit/bb13756fa7755d8f443d7cc7a34fc9ac01ab82cc), [here](https://gitlab.gnome.org/llzes/gjs/commit/b69df09ad5ae733389c9e5997f8cc54c9b6485eb), where I'd lose parameters in **load_contents_promise()** or gain them back again, my **head** kept getting more modernised with cool new ES6 and ES7 things, I made a second file for **load_contents_promise()** to live in, I added random bizarre stuff that I'd remove later while trying to get it in the right setup of **file.load_contents_promise()**, **load_contents_promise** sometimes had null in it when called in **head** and sometimes it didn't, or sometimes it had **cancel** instead, etc.

## Did I hear cancel just now?

Huzzah yes! [Here's a little bit from the first post too](https://avizajac.com/gnome/2018/07/29/creating-gio-head.html#what-is-up-with-that-nullcancel-thing) on **cancellable**. While I was struggling to get back to the **file.load_contents_STUFF()** setup without adding a ton of unnecessary code into my **head** program I had to work on making sure **cancellable** would still work for people who need it in their programs (as it doesn't make sense for my **head** to have it).

This part was trickier than I thought, as it also kept being modified through my flurry of commits. No matter what, here are two major things that stuck through from the time I figured it out to even now:

```
const cancel = new Gio.Cancellable();

[...]

if (ARGV.length !== 1) {
    printerr('Usage: gio-head.js filename');
} else {
    head(ARGV[0]);
    cancel.cancel();
    loop.run();
}
```

Here are a few examples of where I kept trying to call **null** and/or **cancel** in **head** with the accompanying **load_contents_promise()** parameters until it worked:

```
// Example 1: https://gitlab.gnome.org/llzes/gjs/commit/5919962ac4f50993d3ce93dc6a4c7660c73366a8
// This is the first time I got cancellable working-ish!
// head
let [, raw_content] = await load_contents_promise(null, file);
// load_contents_promise()
const load_contents_promise = (cancellable = null, file)=>{
    return new Promise((resolve, reject)=>{
        file.load_contents_async(cancellable, function(f, res) {

// Example 2: https://gitlab.gnome.org/llzes/gjs/commit/bb13756fa7755d8f443d7cc7a34fc9ac01ab82cc
// There is horrifying code here but for now check out that /*, cancel*/ there plus where I flipped the parameters!
// head
let [, raw_content] = await file.load_contents_promise(/*, cancel*/);
// load_contents_promise()
const load_contents_promise = (file, cancellable = null)=>{
    return new Promise((resolve, reject)=>{
        file.load_contents_async(cancellable, function(f, res) {
// Example 3: https://gitlab.gnome.org/llzes/gjs/commit/a129cce2b6afb1398f7d5b7a8c12e734ea48bd82
// This is the first commit I have with the current null/*cancel*/ setup
// head
let [, raw_content] = await file.load_contents_promise(null/*cancel*/);
🐰🐰🐰
```

## Monkey patching and making load_contents_promise() more generic

Bun bun bun! So in exaxmple 3 above I left emojis instead of the new code. Why? I made some changes that helped make the code a bit more generic and I also did monkey patching to make this all work! This was my first time monkey patching so it was a series of rabbit holes for sure.

What *is* monkey patching if you're unfamiliar with it like I was? It's when you add/modify/remove code at runtime without actually changing the source code, wherever it came from. You save the original source code and afterwords modify it. This way you can still call the original source code later on in your code but at the same time you can also override the default behaviour it usually returns at runtime.

Before I tried monke ypatching [in the commit before, I had some weird code](https://gitlab.gnome.org/llzes/gjs/blob/b69df09ad5ae733389c9e5997f8cc54c9b6485eb/examples/gio-head.js) that looked like this:

<img src="/images/2018/July/load_contents_promise-2.png">

Not only would people have to write extra lines of code into their programs but this wouldn't be feasible on getting every **_async** and **_finish** function onboard with the future of Promisify, wherever this goes. This is also where I thought I finally understood monkey patching with **prototype** and when it failed, I was very confused as to ~~how it all went wrong~~ why it wasn't working.

Turns out that oops, it wasn't just me, there's an actual bug here! In an ideal world (that doesn't exist quite yet) my code would look something like:

```
Gio.File.prototype.load_contents_STUFF = function(){
    [...]
}
```

Unfortunately right now we can't call it like that and instead we'll be calling it like this for now:

```
const Gio_File_prototype = Gio.File.new_for_path('').constructor.prototype;
Gio_File_prototype.load_contents_STUFF = function(){
    [...]
}
```

At this moment in time not only do we need an extra line of code, it's also being called like **Gio_File.prototype** instead of **Gio.File.prototype**.

I was suggested to completely try re-naming my stuff to make sure I wasn't confusing myself in the process, hence why there's a function named **cheesecake**, replacing the former name of **load_contents_promise** to make sure I wasn't just lost in naming. On the other hand I finally got this monkey patched version working!

<img src="/images/2018/July/load_contents_promise-3.png">
<img src="/images/2018/July/load_contents_promise-4.png">

I was super excited that it finally worked! After the excitement finally died down a little bit I began cleaning the code up such as [moving the cheesecake](https://gitlab.gnome.org/llzes/gjs/commit/b19e05ab6d75abcb6aab477de1515198bf895ba9) into the prototype where the return used to be and is now commented out here:

```
Gio_File_prototype.load_contents_promise = function(cancellable){
    // return cheesecake(this, cancellable);
    const cheesecake = (file, cancellable = null)=>{
        return new Promise((resolve, reject)=>{
            file.load_contents_async(cancellable, function(f, res) {
                try {
                    let result = f.load_contents_finish(res);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };
    return cheesecake(this, cancellable);
}
```

Something I forgot about and was reminded of was that at some point I wouldn't be hardcoding **load_contents_async()** and **load_contents_finish()** in, and other **_async()** and **_finish()** functions may not have the same parameters, the parameters in the same order, etc. It ended up collapsing even further, using [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) for what the hardcoded parameters used to be [in a following commit](https://gitlab.gnome.org/llzes/gjs/commit/a129cce2b6afb1398f7d5b7a8c12e734ea48bd82):

```
Gio_File_prototype.load_contents_promise = function(...args){
    return new Promise((resolve, reject)=>{
        this.load_contents_async(...args, function(f, res) {
            try {
                let result = f.load_contents_finish(res);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}
```

This is getting us so much closer to an ideal Promisify feature! There's still work to do though as we're still stuck with calling **load_contents_promise()**, plus I'm still keeping all of this extra code that doesn't belong to the **head** program inside of the same file.

## Hello, Promisify, a function that returns functions!

I created a new file called **promisify.js**! But then I got stuck again, how *do* you create a function that creates a function? In hindsight I should have thought more OOP here. This summer has tested my blackbox implementing a ton as a lot of my summer was working on things I had never seen or done before. I also learned a ton by getting into the habit of desugaring everything I touched once I knew what sugaring was!

The first thing I did was remove all of the monkey patching to the new file, commented it out, then created a generic function that looked like:

```
const promisify = (
    [...]
) => {
    [...]
}
```

That's something! Yet what *would* I put inside of Promisify? Looking at my line **Gio_File_prototype.load_contents_promise = function(...args){** I noted to myself that **Gio_File_prototype** was GIO and the type (in this case File) so I created my first required parameter for all of my future functions created by this function as **GioType**. In **load_contents_promise**, while I'm trying to now make this applicable for any function that has a corresponding **_async** and **_finish** function, it was easier for me to remember this as **load_contents_async()** and **load_contents_finish()** at the time, which led to my **asyncStuff** and **finishStuff** parameters. The callback is still happening, there's no avoiding it, but at least this way it's hiding all of this from the application side where **head** resides at.

Another thing I had to think about now was that I couldn't expect people to start writing **load_contents_promise()** everywhere in their code. It wouldn't be backwards compatible plus imagine the nightmare of having to document all of the new **_promise** functions. Yikes.

We want people to use something they're already familiar with and nothing beats an easy to read change like **load_contents_async(null/\*cancel*/\)**, and sticking an **await** right in front of it! (We'll talk about backwards compatibility a little later). So with that my new Promisify [started off roughly like this](https://gitlab.gnome.org/llzes/gjs/commit/fdcc9b4a3484b6321ddfc979ef7294b90dbd262d), getting rid of the **Gio_File.prototype.load_contents_promise** in exchange for **Gio_File.prototype.load_contents_async**. *This did not work yet.*

```
var promisify = ( /* Apparently const isn't supported thus using var */
    GioType, /* Gio_File_prototype */
    asyncStuff, /* load_contents_async */
    finishStuff /* load_contents_finish */
) => {
    // Gio_File_prototype.load_contents_promise = function(...args){
    return GioType[asyncStuff] = function(...args){
        return new Promise((resolve, reject)=>{
            /* this[asyncStuff] == this.load_contents_async */
            // this.load_contents_async(...args, function(source,res){
            this[asyncStuff](...args, function(source) {
                try {
                    /* source[finishStuff] == source.load_contents_finish */
                    // let result=source.load_contents_finish(res);
                    let result = source[finishStuff];
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
```

Over in **head** I ran back into a familiar issue I had before:

```
try {
    let load_contents = promisify.load_contents_async(Gio_File_prototype,load_contents_async,load_contents_finish);
    /* To cancel the operation toggle the 'null' with the 'cancel' param */
    let [, raw_content] = await file.load_contents(null/*cancel*/);
```

This got ugly really fast again [in the next commit](https://gitlab.gnome.org/llzes/gjs/commit/ae5496521c4ff4b1e760e37947867b2ac8a54fb6). To make up for it I did move the line importing Promisify outside of **head**.:

```
[...]
Gio_File_prototype.load_contents_promise = promisify(Gio_File_prototype, 'load_contents_async','load_contents_finish');

const head = async(filename)=>{
    let file = Gio.file_new_for_commandline_arg(filename);
    let content_formatted;
    try {
        /* To cancel the operation toggle the 'null' with the 'cancel' param */
        let [, raw_content] = await file.load_contents_promise(null/*cancel*/);
[...]
```

Oops, **load_contents_promise** is back! But it still wouldn't work *and* it got stuck indefinitely after trying to run, why?

It turns out that when I did **GioType[asyncStuff** in Promisify, while I had based it off of **Gio_File_prototype.load_contents_promise**, I got lost in my own code as that base confused me from what I was trying to do. I was now creating two new methods at runtime: **file.load_contents_promise()** and **file.load_contents_async()**.

From there I was accidentally overwriting **file.load_contents_async()**, the original **load_contents_async()**, with my new version of it. So when **file.load_contents_async()** was called it essentially called itself, hence the infinite loop.

I was a bit desperate to have my long awaited (tehe!) code to finally work and in a moment of desperation [I wrote the following commit](https://gitlab.gnome.org/llzes/gjs/blob/a29b725fcbd1c1501543766a27fc8c7677da14c2/examples/promisify.js):

```
var promisify = ( /* Apparently const isn't supported thus using var */
    GioType, /* Gio_File_prototype */
    newFuncName,
    asyncStuff, /* load_contents_async */
    finishStuff /* load_contents_finish */
) => {
    return GioType[newFuncName] = function(...args){
        return new Promise((resolve, reject)=>{
            this[asyncStuff](...args, function(source,res) {
                try {
                    let result = source[finishStuff](res);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
```

Once I called it properly in **head** with **Gio_File_prototype.load_contents_promise = promisify(Gio_File_prototype, 'load_contents_new', 'load_contents_async','load_contents_finish');** holy flying macarons it worked! My immediate reaction in the moments after was rather surprisingly negative instead of positive, as all I could think was that *it so simple and I had missed it the entire time an-*

Have I mentioned that Philip is an amazing mentor? Huzzah! While I felt really bad as I had missed it for a few days, I got reassured by Philip that it wasn't as simple as I was making it out to be in my head. Plus making a function that returns functions? (Still ecstatic this actually worked tehe). I learned a ton of new things as I went through the process via black box implementing it, learning new things, learning and reinforcing all of the things I thought I had known but didn't quite know yet entirely.

Seriously though, huzzah to functions that return functions!

## Cleaning up Promisify

After I finally got Promisify working, Philip wrote me a list of three possible things to improve the prototype:

* Overwriting the original async function **[Completed]**
* Allow *both* the callback version and the new Promise-style API with the same function **[Completed]**
* Discard useless boolean return value **[To Do]**

The first thing I wanted to do was completely avoid the entire **file.load_contents_promise()** thing I was doing again and just go for **file.load_contents_async()** to keep the **head** program clean. To do this I had to get rid of the **newFuncName** parameter I had created and only have three possible parameters in my new Promisify: **GioType**, **asyncStuff**, **finishStuff**.

The process to get to this, once more, was a little eventful from fun errors like:

```
(llzes)avi@localhost:~/jhbuild/checkout/gjs/examples$ gjs-console gio-head.js gio-cat.js

(gjs-console:21947): Gjs-WARNING **: 17:11:27.757: JS ERROR: InternalError: too much recursion
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
promisify/GioType[asyncStuff]@/home/avi/jhbuild/checkout/gjs/examples/promisify.js:22:9
```

Oops! To make sure I understood monkey patching I did a coding exercise by monkey patching the **get_path()** method where I learned I couldn't use ES6 arrow functions and had to actually use **function () {}**. I was still stumped after on how to fix my Promisify so Philip sent me this lovely shorthand guide which saved my life from confusion:

```
function wrapper() {
    some_other_function();
    _real_get_path();
}
_real_get_path = get_path;
get_path = wrapper;
```

I was also confusing myself with **this** at one point but ultimately got myself [to this](https://gitlab.gnome.org/llzes/gjs/blob/65d54771b2a1e7aab6b5b01f0827d0aab2aea51c/examples/promisify.js) (tehe):

```
var promisify = (
    GioType,
    asyncStuff,
    finishStuff
) => {
    GioType[`original_${asyncStuff}`] = GioType[asyncStuff];
    GioType[asyncStuff] = function(...args) {
        return new Promise((resolve, reject)=>{
            this[`original_${asyncStuff}`](...args, function(source, res) {
                try {
                    let result = source[finishStuff](res);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            
        });
    };
};
```

Huzzah whoo! I saved the original **file.load_contents_async()** under the name **file.original_load_contents_async()** in case I'd need it, and monkey patched from there.

But then came the question of what happens to all of the folks who want to use callbacks or virtually any code that already exists with an **_async** function? This is running behind the scenes so it'd be very unreasonable to expect everyone to convert over to the new Promise-styled API I've created, it wouldn't be backwards compatible, plus imagine all of the documentation that would to be fixed.

To fix this and make it backwards compatible I checked to see if people were using callbacks or not! The way I went about this one was expanding the paramters and checking if any of the arguments was a function or not. [After I got it working](https://gitlab.gnome.org/llzes/gjs/commit/7ab0b066e0ab5790260c75dbd38e216e652a80b9) I began cleaning it up like usual. Something I did when I first got it working was using a for-loop:

```
for(let i=0; i<args.length; i++){
    if (typeof args[i]==="function") {
        return this[asyncStuff];
    } else { 
        return new Promise((resolve, reject)=>{
            [...] 
        }
    }
``` 

This is hard to read and also helped hide a logic issue I had. So the first step I took [was replacing the for-loop with every()](https://gitlab.gnome.org/llzes/gjs/blob/d243b11d2191d0a8a6ad4a85838ddf5346bd372e/examples/promisify.js):

```
if (args.every(arg=>typeof arg === 'function')) return;
else return new Promise((resolve, reject)=>{
    [...]
});
```

That made things much cleaner for us to read! But right now there's a weird logic issue to fix. [Here is the commit showing the git diff of the two files for a more pleasant experience](https://gitlab.gnome.org/llzes/gjs/commit/609aadada4f3e24e20d48e3d70492935ce1b1fce) otherwise here is the new if/else logic:

```
if (args.every(arg=>typeof arg !== 'function')) return new Promise((resolve, reject)=>{
    [...]
});
else return this[`original_${asyncStuff}`](...args);
```

For this to work properly I needed to know for sure that I've checked every argument and that every argument is *not* a function. So the key differences between the two is:

* In the first, if *any* of the arguments are a function then do the callback version, else return the new Promise-styled API. This is an issue as it'll stop the moment it sees an argument that is a function and not run through all of the arguments before continuing.
* In the second, if *all* of the arguments are not a function then do the Promise-styled API, else return the original **_async()** callback.

Holy flying macarons that's a world of a difference. But huzzah this is fanastic since we're now at the current version of Promisify (at lest until the next stage is completed)! Here is how Promisify looks now (and you should be able to now fully run **gio-head-5.js** with the following code saved in **promisify.js**):

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