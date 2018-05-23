---
layout: post
title: Aboard the GObject Introspection Train!
date: 2018-5-17
---
# Hi! If you accidentally saw this you're looking at a draft in-progress.

*Topics covered in this post include: GObject Introspection, GObject, GIR, Typelib, language bindings like GJS, ~~my love of the Metro~~ some Metro facts. Links to all resources, documentation, inspiration, and anything else used are at the bottom of this post.*

In Washington, D.C., aka the District, the primary mode of public transport is WMATA's Metro (Metrorail) system. The heart of it being in DC with Metro Center, L'Enfant Plaza, and Gallery Place/Chinatown as the three major transfer stations with stations from there expanding into parts of Maryland and Virginia.

If you're also ~~obsessed and in love with~~ a fan of the Metro like I am (or just like long escalators) you likely know that [Wheaton station](https://www.wmata.com/rider-guide/stations/wheaton.cfm?y=33) on the Red Line in Silver Spring, Maryland has the longest single-span escalators in the Western Hemisphere! At a length of 230ft/70m with a vertical rise of 115ft/35m due to a 30 degree inclination, travelling at a speed of about 90ft/27m per minute, it is an approximate 2 minute and 45 second trip if you stand on a single step the entire duration (which I can personally vouch for).

Most likely if we are going to check out the escalators we'll begin at [Metro Center](https://www.wmata.com/rider-guide/stations/metro-center.cfm?y=33), the central hub station, hopping onto the Red Line.

You hop onto a train car, hopefully a darling 7000-series car (the newest train car series on the system).

Regardless of if it is a 7000, 6000, 5000, 3000, or 2000-series car (the 1000 and 4000-series are no longer in service), the train operator knows which one you're on. You can simply be a passenger in awe of the Metro and fall in love with it as it moves you along until you finally get to Wheaton to check out the escalators!

So I promise this isn't actually a post on ~~my love of~~ the Metro: it's a (bit imperfect) way to remember and understand how we go from the GObject-based C libraries to the language bindings such as GJS with GObject Introspection. Lets go back and start from the beginning again.

## Beginning at Metro Center

At Metro Center we begin with all of our GObject-based C libraries.

A GObject is a language-independent expression of Object Oriented Programming (OOP) concepts. OOP concepts aren't built into C but you can implement them so it becomes an API of sorts. From there we can write in C using GObject that will translate into whatever language you'd like to work in, which from there it'll use whatever is supported (e.g. classes in Java).

This example from Philip (with some editing from the chat) helped me personally understand GObjects:

*"If you're building a GNOME app using GTK then the first thing you need is a GTK window. "GtkWindow" is a GObject class. So if you're building your app in C, you call `gtk_window_new()` to create one; in JavaScript you call `new Gtk.Window()`; in Python it's `Gtk.Window()`, etc."*

Think of yourself as one of the many GObject-based C libraries: the Wheaton escalators all the way out in Silver Spring, Maryland can't directly access and import us (e.g. libraries, classes) nor any of our unique things about us (e.g. properties, methods), without some middleware!

In my case I'd have *avi.h* and *avi.c* in my Avi library/class based from [GObject boiler plate code](https://developer.gnome.org/gobject/unstable/howto-gobject.html) with all of the library sources, [GType's](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html), [GTK-Doc](https://developer.gnome.org/gtk-doc-manual/) comments on each of the unique things whether functions, properties, and so on outside of the boilerplate.

Inside of *avi.c* and *avi.h* my *Avi* class would have a property *fav-train-series*, aka whatever my favourite train car series is (the 7000-series!) and in an *avi_say_fav_series()* method somewhere around there it would return *fav-train-series*.

*Note: This and the following for the rest should all be assumed to be pseudocode for all I know unless stated otherwise. I have not tested these samples. Personal comments from me will be after a 🐰 emoji.*

To initialise my Avi class it would look something like this (original code from the [g_object_class_install_properties() function](https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#g-object-class-install-properties) and [g_type_class_add_private()](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html#g-type-class-add-private) documentation and following [Reimer's](http://helgo.net/simon/introspection-tutorial/stepone.xhtml) guide):

```
static void
avi_class_init (AviClass *klass)
{
    GObjectClass *gobject_class = G_OBJECT_CLASS (klass);

    🐰 GObject Introspection needs comments on functions (and more) following GTK-Doc standards, specially formatted documentation blocks, so that everything can be properly mapped by the language binding(s)
    🐰 https://developer.gnome.org/gtk-doc-manual/1.26/documenting_sections.html.en
    🐰 https://developer.gnome.org/gtk-doc-manual/
    /**
     * Avi:fav-train-series:
     *
     * Name of their favourite train series.
     */
    obj_properties[PROP_FAV_TRAIN_SERIES] =
        🐰 g_param_spec_string () https://developer.gnome.org/gobject/stable/gobject-Standard-Parameter-and-Value-Types.html#g-param-spec-string
        🐰 Parameters:
        🐰 const gchar *name
        🐰 const gchar *nick
        🐰 const gchar *blurb
        🐰 const gchar *default_value
        🐰 ParamFlags flags https://developer.gnome.org/gobject/stable/gobject-GParamSpec.html#GParamFlags
        🐰 Note: I hardcoded the 7000 in for this example so it'd always be 7000 if in a avi_say_fav_series() method it called the fav-train-series property.
        g_param_spec_string ("fav-train-series", 🐰 name, canonical name of the property specified
                             "Fav-Train-Series", 🐰 nick, nick name for the property specified
                             "Name of their favourite train series.", 🐰 blurb, description of the property specified
                             "7000", 🐰 default_value, default value for the property specified.
                             G_PARAM_READWRITE | G_PARAM_CONSTRUCT); 🐰 flags, flags for the property specified

    🐰 GObjectSetPropertyFunc () https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#GObjectSetPropertyFunc
    gobject_class->set_property = avi_set_property;
    🐰 GObjectGetPropertyFunc () https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#GObjectGetPropertyFunc
    gobject_class->get_property = avi_get_property;
    🐰 GObjectFinalizeFunc () https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#GObjectFinalizeFunc
    gobject_class->finalize = avi_finalize;

    🐰 g_object_class_install_properties () https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#g-object-class-install-properties
    g_object_class_install_properties (gobject_class,
                                       N_PROPERTIES,
                                       obj_properties);

    🐰 https://developer.gnome.org/gobject/stable/gobject-Type-Information.html#g-type-class-add-private
    🐰 Parameters:
    🐰 gpointer g_object (https://developer.gnome.org/glib/stable/glib-Basic-Types.html#gpointer)
    🐰 gsize private_size (https://developer.gnome.org/glib/stable/glib-Basic-Types.html#gsize)
    g_type_class_add_private (gobject_class,
                              sizeof (AviPrivate));
}
```

## Hopping onto a train car

Cool! So we know from Metro Center (GObject-based C library) and all the folks (classes) waiting to transfer there that we're not able to be directly accessed by Wheaton (a language interpreter/binding) or any other station since they're different stations (language bindings).

That's where the Metro trains, aka GObject Introspection, comes in!

[GObject Introspection](https://gitlab.gnome.org/GNOME/gobject-introspection/tree/master) is middleware that connects the [GNOME Desktop](https://www.gnome.org/) platform libraries written in C using GObject to any language binding like [GJS](https://gitlab.gnome.org/GNOME/gjs/tree/master/gjs) (JavaScript). What's really awesome about this is that regardless of your favourite managed runtime (e.g. JavaScript with GJS, Python with PyGObject) you can import and use the original class that's written in C without having to re-do it or duplicate work that someone else already did to access it in their preferred mutual runtime. It builds all the metadata required inside the GObject library (using the annotations from the GTK-Doc comments) so any language binding can share and use it natively via importing the GObject Introspection framework into their specific language. Users can write applications in something they're comfortable with compared to writing complex applications in only C.

There's a [few tools that GObject Introspection has](https://gitlab.gnome.org/GNOME/gobject-introspection/tree/master) that makes this possible. From the README:

* g-ir-scanner
  * A tool which generates GIR XML files by parsing headers, GTK-Doc comment blocks including annotations and introspecting GObject based libraries.  
* g-ir-compiler
  * A typelib compiler. It converts one or more GIR files into one or more typelib blobs.   
* g-ir-generate
  * A GIR generator, using the repository API. It generates GIR files from binary typelib which can be in a shared object, or a raw typelib blob.  
* g-ir-annotation-tool
  * Extracts annotations from source code files.
* g-ir-doc-tool
  * Generates API reference documentation from a GIR XML file.

Kind of like riding on the Metrorail system there's more than just standing around at a station and being a passenger that happens! Lets hop onto a train car now.

While we go inside the train car excited to see the escalators at Wheaton our train operator (GObject Introspection) needs to introspect us, the passengers, to get us to Wheaton. When they're getting ready to drive the train they include some instructions ([`#include <girepository.h>`](https://gitlab.gnome.org/GNOME/gobject-introspection/blob/master/girepository/girepository.h)) in the main driver cab (e.g. the *main* function). This requires having the GObject Introspection package and development files to compile. If it's their first time driving they'll have to recompile before the next step.

Cool! We're all inside the train. Now the train operator can run *g-ir-scanner* on us. As *g-ir-scanner* is running it parses the original C (using GObject) code with the GTK-Doc comments.

After they do that they'll generate and get a new output file. I'm now *Avi-0.1.gir* or something like that to the driver.

A **.gir* file is really just an XML file but written in the [GIR XML format](https://developer.gnome.org/gi/stable/gi-gir-reference.html). A simple and short example of one is the [gir/fontconfig-2.0.gir](https://gitlab.gnome.org/GNOME/gobject-introspection/blob/master/gir/fontconfig-2.0.gir). The directory it's in has a few others to check out!

Here's a high-level skeleton GIR example depicting our current scenario:

```
<?xml version="1.0"?>
<repository version="7.0">
    <namespace name="Metro">
        <class name="Avi">
            <property name="fav-train-series"/>
            <method name="avi_say_fav_series"/>
        </class>
    </namespace>
</repository>
```

The above example will not work as it is missing several key things that would require for it to work including the repository xmlns attribute(s), C type annotations, attributes, identifiers, and more specifying which C symbols to load.

Moving on, that's cool and all but unless we're planning on using just the Vala binding we need to take this a step further. Wait, you're asking, why am I specifying Vala here? Vala is the only language binding that takes GIR as its input. [From the page describing features that different bindings use of GObject Introspection](https://wiki.gnome.org/Projects/GObjectIntrospection/BindingsFeatures) (check it out for further specific feature details):

Binding | Language | Input | Kind
:---: | :---: | :---: | :---:
gjs | JavaScript | Typelib | Runtime
JGIR | Java | Typelib | Compiled to Java bytecode
pygobject | Python | Typelib | Runtime
seed | JavaScript | Typelib | Runtime
vala | Vala | GIR | Compiled to C
lgi | Lua | Typelib | Runtime
GLIB::Object::Introspection | Perl | Typelib | Runtime
GirFFI | Ruby | Typelib | Runtime
hbgi | Harbour | Typelib | Runtime

It'd be wasteful of resources if we wrote applications using the introspected classes reading directly from the GIR XML. GObject Introspection lets us use *g-ir-compiler* to compile then generate a binary formatted file, Typelib, from the GIR XML.

GIR XML is lovely that it's human readable, but Typelib is machine readable as it's in a binary format that has been optimised for fast disk access and low memory usage. Aka our train operator can finally get going!

## Our train is arriving at Wheaton

The train is pulling up to Wheaton, aka our language binding that takes in Typelib. At some point in time as the train series underwent acceptance testing, Wheaton and the train series had to be hooked up together during runtime using the metadata (Typelib or GIR). Likely they went from testing with one specific train (a class), got it working at the station, and then applied it to all the trains after (by creating a shared library).

If you follow [Reimer's guide](http://helgo.net/simon/introspection-tutorial/stepfour.xhtml) on how to "Make it a library", the *libtool* utility is used to turn the class into its own shared and dynamic library. From there it's the same process of running *g-ir-scanner* (using the `--library` flag instad of `--program`) then *g-ir-compiler* away!

*Avi Note: There is currently an on-going debate on the popularity and usage difficulty/confusion of the [Autotools suite](https://www.gnu.org/software/automake/manual/automake.html), which includes the libtool utility, versus the [Meson build system](https://mesonbuild.com/). [Emmanuele Bassi](https://www.bassi.io/), a GNOME contributor, wrote a post on [moving libepoxy to Meson from Autotools](https://www.bassi.io/articles/2017/02/11/epoxy/) sharing details of what he found benchmark wise. As he reported: "-building Epoxy with Meson on my Kaby Lake four Core i7 and NMVe SSD takes about 45% less time than building it with autotools."*

## Wheaton accepting the train

From the station's perspective, aka the language binding, it's using introspection during runtime to receive the train, aka the C (using GObject), GIR, and/or Typelib. [Here's awesome ASCII art overview](https://wiki.gnome.org/Projects/GObjectIntrospection/Architecture) showing the architecture of GObject Introspection!

Wheaton is receiving Typelib from the train, thus the *mmap()* is shared between the processes (the station and train with people in case). [From the GNU Operating System on mmap()](https://www.gnu.org/software/libc/manual/html_node/Memory_002dmapped-I_002fO.html):

*"On modern operating systems, it is possible to mmap (pronounced "em-map") a file to a region of memory. When this is done, the file can be accessed just like an array in the program.*

*This is more efficient than read or write, as only the regions of the file that a program actually accesses are loaded. Accesses to not-yet-loaded parts of the mmapped region are handled in the same way as swapped out pages.*

*Since mmapped pages can be stored back to their file when physical memory is low, it is possible to mmap files orders of magnitude larger than both the physical memory and swap space."*

Another thing to be aware of are **.so* (referred to as a shared object/shared library/dynamic library). **.so* links to your code during runtime so if there's any changes in the **.so* file you won't have to recompile the main program. I wasn't entirely sure of the full difference and distinction between a shared and dynamic library. Especially online I kept seeing the terms being used interchangeably. I found [this answer that was nice](http://lua-users.org/lists/lua-l/2010-12/msg01152.html):

*"'Dynamic libraries' are libraries that can be loaded at run-time. 'Shared libraries', or 'shared objects', are dynamic libraries designed so that only one copy can be shared between running processes."*

Using that definition I'll refer to **.so* files as *dynamic libraries* for the remainder of this post (or at least until I find a solid confirmation on the distinction somewhere).

As an example we'll say that GCC/compiler, a Metrorail operator, has compiled me (Avi class) into a dynamic library that we'll call *libtrain.so* here. It'll only be linked to the main program if the main program is written in C, C++, Vala, or a different compiled language. If this is the case then everything has already been compiled and our Metrorail operator already knows where everything is on the train in case they need to call it (e.g. a function for the doors closing). If anything is missing (e.g. the function for the doors closing isn't responding with a response) it'll fail to allow the Metrorail operator to drive.

On the other hand Wheaton is a language binding so it looks more like this:

* Wheaton is going to work on accessing us by linking to *libgirepository*.
  * *libgirepository* is a dynamic library that "can read Typelibs and present them in libffi-based ways" per the ASCII art architecture overview.
* *libgirepository* links to *libffi*.
  * [*libffi*](https://en.wikipedia.org/wiki/Libffi) is a dynamic library and interface for C that calls natively compiled functions at runtime instead of at the compile time.
* *libgirepository* will be loading Typelib at runtime that'll get the information for *libffi*
* *libffi* from there will find, load, and call things (e.g. the function to close the doors) at runtime

Code wise we're going from C (using GObject) to *g-ir-scanner* to GIR XML to *g-ir-compiler* to Typelib and from there we'll be picked up by *libgirepository* and *libffi* to take us to Wheaton.

## Finally at the escalators!

Wheaton, after this entire process, accepted us from Metro Center so we can finally go on and see the escalators ourselves!

If you've made it to the end thank you so much for reading it all! This is the first post in a series of several for my internship this summer.

[This is my Outreachy for GNOME introduction post](https://avizajac.com/gnome/2018/05/10/gnome-intro.html) that describes what I'll be working on and lists various ways to contact me (Planet GNOME didn't populate my introductory post from last week). If you have any questions, comments, or feedback please feel free to contact me! 🐰

## Resources

* [Philip Chimento](http://ptomato.name/), my Outreachy GNOME internship mentor!
* [ASCII art overview of the GI infrastructure](https://wiki.gnome.org/Projects/GObjectIntrospection/Architecture)
  * Lovely visual that helped inspire my Metro analogy!  
* [GObject Introspection - Information Page](https://wiki.gnome.org/action/show/Projects/GObjectIntrospection)
* [GObject Introspection - Reference Manual (v1.56.1)](https://developer.gnome.org/gi/1.56/)
* [GObject Introspection - Language Bindings Features](https://wiki.gnome.org/Projects/GObjectIntrospection/BindingsFeatures)
* [GObject Introspection - Tutorial by Simon Kågedal Reimer](http://helgo.net/simon/introspection-tutorial/index.xhtml)
* [GObject - Tutorial](https://developer.gnome.org/gobject/unstable/pt02.html)
* [GObject - Boiler Plate Code Tutorial](https://developer.gnome.org/gobject/unstable/howto-gobject.html)
* [GObject - Base Object Type Reference](https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html)
* [GObject - GType API Reference](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html)
* [GTK-Doc](https://developer.gnome.org/gtk-doc-manual/)
* [GIR XML Format - Reference](https://developer.gnome.org/gi/stable/gi-gir-reference.html)
* [Fontconfig-2.0 GIR - Example](https://gitlab.gnome.org/GNOME/gobject-introspection/blob/master/gir/fontconfig-2.0.gir)
* [automake - Autotools Reference](https://www.gnu.org/software/automake/manual/automake.html)
* [Meson Build System](https://mesonbuild.com/) 
* [Emmanuele Bassi](https://www.bassi.io/)
* [GNOME Foundation Board - History of Board Members](https://wiki.gnome.org/FoundationBoard/History)
* [libepoxy - Bassi's Post Moving to Meson Build from Autotools](https://www.bassi.io/articles/2017/02/11/epoxy/)
* [Dynamic vs Shared Libraries - Brief Description](http://lua-users.org/lists/lua-l/2010-12/msg01152.html)
* [mmap()](https://www.gnu.org/software/libc/manual/html_node/Memory_002dmapped-I_002fO.html)
* [Libffi](https://en.wikipedia.org/wiki/Libffi)
* [Dynamically Linked Shared Object Library - Tutorial](http://www.yolinux.com/TUTORIALS/LibraryArchives-StaticAndDynamic.html)
* [WMATA - Home Page](https://www.wmata.com/)
* [WMATA - Metro Center Station Information](https://www.wmata.com/rider-guide/stations/metro-center.cfm?y=33)
* [Metro Center Station - Wikipedia](https://en.wikipedia.org/wiki/Metro_Center_station)
* [WMATA - Wheaton Station Information](https://www.wmata.com/rider-guide/stations/wheaton.cfm?y=33)
* [Wheaton Station - Wikipedia](https://en.wikipedia.org/wiki/Wheaton_station)