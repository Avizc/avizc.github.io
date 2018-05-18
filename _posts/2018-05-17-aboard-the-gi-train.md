---
layout: post
title: Aboard the GObject Introspection Train!
date: 2018-5-17
---
# Hi! If you accidentally saw this you're looking at a draft in-progress.

*Topics covered in this post include: GObject Introspection, GObject, GIR, Typelib, language bindings like GJS, ~~my love of the Metro~~ some Metro facts. Links to all resources, documentation, inspiration, and anything else used are at the bottom of this post.*

In Washington, D.C., aka the District, the primary mode of public transport is WMATA's Metro (Metrorail) system. The heart of it being in DC with Metro Center, L'Enfant Plaza, and Gallery Place/Chinatown as the three major transfer stations with stations from there expanding into parts of Maryland and Virginia.

If you're also ~~obsessed and in love with~~ a fan of the Metro like I am (or just like long escalators) you likely know that Wheaton station on the Red Line in Silver Spring, Maryland has the longest single-span escalators in the Western Hemisphere! At a length of 230ft/70m with a vertical rise of 115ft/35m due to a 30 degree inclination, travelling at a speed of about 90ft/27m per minute, it is an approximate 2 minute and 45 second trip if you stand on a single step the entire duration (which I can personally vouch for).

Most likely if we are going to check out the escalators we'll begin at Metro Center, the central hub station, hopping onto the Red Line.

You hop onto a train car, hopefully a darling 7000-series car (the newest train car series on the system).

Regardless of if it is a 7000, 6000, 5000, 3000, or 2000-series car (the 1000 and 4000-series are no longer in service), the train operator knows which one you're on. You can simply be a passenger in awe of the Metro and fall in love with it as it moves you along until you finally get to Wheaton to check out the escalators!

So I promise this isn't actually a post on ~~my love of~~ the Metro: it's a (bit imperfect) way to remember and understand how we go from the GObject-based C libraries to the language bindings such as GJS with GObject Introspection. Lets go back and start from the beginning again.

## Metro Center, aka GObject-based C libraries

At Metro Center we begin with all of our GObject-based C libraries. Think of yourself as a GObject-based C library: you want to get some excitement based runtime at Wheaton since it's easy for us to be excited by the escalators if we're actually on them.

In my case I'd have `avi.h` and `avi.c` based from [GObject boiler plate code](https://developer.gnome.org/gobject/unstable/howto-gobject.html) with all of the library sources, [GType's](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html), [GTK-Doc](https://developer.gnome.org/gtk-doc-manual/) comments on all the unique things about me (classes) outside of the boilerplate.

Inside of ```avi.c``` and ```avi.h``` I'd have an ```Avi``` class that has a property ```fav_train_series```, aka my favourite train car series (the 7000-series!) and in a method such as ```say_fav_series``` have it return ```fav_train_series```.

*Note: This and the following for the rest should all be assumed to be pseudocode for all I know unless stated otherwise. I have not tested these samples. Personal comments from me will be after a 🐰 emoji. Might make an actual repo for fun at some point huzzah.*

To initialise the class (original code from the [g_object_class_install_properties() function](https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html#g-object-class-install-properties) and [g_type_class_add_private()](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html#g-type-class-add-private) documentation and following [Reimer's](http://helgo.net/simon/introspection-tutorial/stepone.xhtml) guide):

```
static void
avi_class_init (AviClass *klass)
{
    GObjectClass *gobject_class = G_OBJECT_CLASS (klass);

    🐰 GObject Introspection needs comments on functions (and more) following GTK-Doc standards, specially formatted documentation blocks, so that everything can be properly mapped by the language binding(s)
    🐰 https://developer.gnome.org/gtk-doc-manual/1.26/documenting_sections.html.en
    🐰 https://developer.gnome.org/gtk-doc-manual/
    /**
     * Avi:fav_train_series:
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
        🐰 Note: I hardcoded the 7000 in for this example so it'd always be 7000 if in a say_fav_series method it called the fav_train_series property.
        g_param_spec_string ("fav_train_series", 🐰 name, canonical name of the property specified
                             "Fav_Train_Series", 🐰 nick, nick name for the property specified
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



## Resources

* Philip Chimento, my Outreachy GNOME internship mentor!
* [ASCII art overview of the GI infrastructure](https://wiki.gnome.org/Projects/GObjectIntrospection/Architecture)
  Lovely visual that helped inspire my Metro analogy!  
* [GObject Introspection - Information Page](https://wiki.gnome.org/action/show/Projects/GObjectIntrospection)
* [GObject Introspection - Reference Manual (v1.56.1)](https://developer.gnome.org/gi/1.56/)
* [GObject Introspection - Tutorial by Simon Kågedal Reimer](http://helgo.net/simon/introspection-tutorial/index.xhtml)
* [GObject - Tutorial](https://developer.gnome.org/gobject/unstable/pt02.html)
* [GObject - Boiler Plate Code Tutorial](https://developer.gnome.org/gobject/unstable/howto-gobject.html)
* [GObject - Base Object Type Reference](https://developer.gnome.org/gobject/stable/gobject-The-Base-Object-Type.html)
* [GObject - GType API Reference](https://developer.gnome.org/gobject/stable/gobject-Type-Information.html)
* [GTK-Doc](https://developer.gnome.org/gtk-doc-manual/)
* [Cairo GIR example](https://gitlab.gnome.org/GNOME/gobject-introspection/blob/master/gir/cairo-1.0.gir.in)
* [WMATA - Home Page](https://www.wmata.com/)
* [WMATA - Metro Center Station Information](https://www.wmata.com/rider-guide/stations/metro-center.cfm?y=33)
* [Metro Center Station - Wikipedia](https://en.wikipedia.org/wiki/Metro_Center_station)
* [WMATA - Wheaton Station Information](https://www.wmata.com/rider-guide/stations/wheaton.cfm?y=33)
* [Wheaton Station - Wikipedia](https://en.wikipedia.org/wiki/Wheaton_station)