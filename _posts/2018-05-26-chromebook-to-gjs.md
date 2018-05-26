---
layout: post
title: Chromebook to GJS - Setting Up from Scratch!
date: 2018-5-26
---
*Topics in this post include: Chromebooks, Crouton, future of Linux on Chromebooks, Xiwi, Jhbuild, mozjs52, GJS. Links to all resources and documentation used can be found at the bottom of this post.*

These walkthroughs assume you already have [Developer Mode](https://developer.android.com/topic/arc/sideload#enter-dev) enabled on your Chromebook with [Crouton](https://github.com/dnschneid/crouton) and the [Crouton Extension](https://chrome.google.com/webstore/detail/crouton-integration/gcpneefbbnfalgjniomfjknbcgkbijom) installed. If you get really stuck or don't know what to do you can always ping me!

## The TL;DR Walkthrough

Open up the shell (Ctrl+Alt+T, type *shell*, hit enter) and type the following to create your [chroot](https://github.com/dnschneid/crouton#whats-a-chroot) with Debian (Buster), the GNOME Desktop environment, an extension to synchronise your clipboard, and Xiwi, a "X.org X11 backend running unaccelerated in a Chromium OS window."

The ```-n``` (name) flag is optional but I recommend it, especially if you plan to have multiple Crouton chroots. There is also a ```-e``` flag that allows you to encrypt your chroot. 

```
sudo sh ~/Downloads/crouton -r buster -n NAME_YOUR_CHROOT -t gnome,extension,xiwi
```

Once you finish the process you can enter your new chroot using Xiwi with the following:

```
sudo startgnome -n NAME_YOUR_CHROOT -X xiwi
```

Open up XTerm (you can always install something else later). This is only accurate as of late May 2018, packages are likely to be updated/added/removed later on.

```
sudo apt-get update
sudo apt-get install build-essential autotools-dev autoconf autopoint yelp-tools docbook-xsl git-all apt-file libtool flex bison python-gobject python-dbus libicu-dev libffi-dev libpixman-1-dev libfontconfig1-dev libfreetype6-dev libpng-dev libsource-highlight-dev libgl1-mesa-dev intltool python3-dev libxrender-dev libxml2-dev libxslt1-dev libdbus-glib-1-dev 
```

You'll get a warning saying, "The system-wide cache is empty. You may want to run ‘apt-file update’ as root to update the cache." So we'll do that and continue on to Jhbuild:

```
sudo apt-file update
mkdir ~/jhbuild
cd ~/jhbuild
git clone --depth=1 git://git.gnome.org/jhbuild
cd jhbuild
./autogen.sh --simple-install
make
make install
echo $PATH
mkdir ~/bin
ln -sf ~/.local/bin/jhbuild ~/bin/jhbuild
```

For GJS you'll want to add this into your configuration file. Open up ```~/.config/jhbuildrc``` then add in:

```
module_autogenargs[‘mozjs52’] = ‘--enable-debug’
```

I ended up having to do the following to get it to execute jhbuild:

```
PATH=$PATH:~/.local/bin
echo 'PATH=$PATH:~/.local/bin' >> ~/.bashrc
```

Since I already installed the dependencies I'd need earlier this is mostly to confirm and check that I already had. For some odd reason I can't use sysdeps to install the packages for me so if there's a package missing just search the package with ```sudo apt-file search PACKAGE_NAME.pc``` to find the correct name and install from there.

Check for a list of missing/outdated packages in sanitycheck then mozjs52:

```
jhbuild sanitycheck
jhbuild sysdeps mozjs52
```

If there's no dependencies required to be installed now move on to build mozjs52:

```
jhbuild build mozjs52
```

Repeat the process for GJS:

```
jhbuild sysdeps gjs
jhbuild build gjs
```

Huzzah you're done with GJS! But one last thing, backup your chroot so you don't have to do this again:

```
sudo edit-chroot -b NAME_YOUR_CHROOT
```

## Why a Chromebook?

So I have an unhealthy love for Chromebooks, especially for development purposes. It's kind of hard not to as they're cheap or priced well, durable, ultra portable, and very flexible with being able to create or tear down as many chroots as you'd like. I personally have a tendency to accidentally break everything I use at some point so this is a very nice feature for me.

To say it simply they're just very lovely accessible machines.

If you don't already own a Chromebook and have a budget to look past the $200 or less machines I recommend looking for one with at least 32 or 64GB space minimum, with RAM 4 to 8GB minimum. Thankfully you don't need the most amazing machine in the world possible but it's nice for running a lot of heavier applications. Plus, Linux is officially rolling out to Chromebooks in [custom containers](https://chromium.googlesource.com/chromiumos/docs/+/master/containers_and_vms.md) soon!

## Getting Linux onto a Chromebook

The [Crouton](https://github.com/dnschneid/crouton) project is well documented and has a Wiki with instructions for varying Chromebooks. I honestly can't explain it better than they have. With Xiwi you can run Debian or a distro of your choice in a Chromium OS window or tab in Google Chrome (though Debian doesn't like tabs as I've checked). 

The downside to Crouton is you're giving up security features to run it.

Some awesome recent news though is that Google is implementing Linux apps to Chromebooks! It'll be running inside a VM within a [security sandbox](https://chromium.googlesource.com/chromiumos/docs/+/master/containers_and_vms.md#Security). They've already rolled out first with the Google Pixelbook line a few days ago and will be rolling out to other models later.

## Do I need all of those packages?

So in the walkthrough I put in the following:

```
sudo apt-get install build-essential autotools-dev autoconf autopoint yelp-tools docbook-xsl git-all apt-file libtool flex bison python-gobject python-dbus libicu-dev libffi-dev libpixman-1-dev libfontconfig1-dev libfreetype6-dev libpng-dev libsource-highlight-dev libgl1-mesa-dev intltool python3-dev libxrender-dev libxml2-dev libxslt1-dev libdbus-glib-1-dev 
```

Breaking that down here's what you actually need at each step. This is what you likely should install for sure regardless:

```
sudo apt-get install build-essential autotools-dev autoconf autopoint yelp-tools docbook-xsl git-all apt-file
```

These were the missing dependencies for Jhbuild from sanitycheck that were missing:

```
sudo apt-get install libtool flex bison python-gobject python-dbus
```

And the following were for mozjs52 and GJS:

```
sudo apt-get install libicu-dev libffi-dev libpixman-1-dev libfontconfig1-dev libfreetype6-dev libpng-dev libsource-highlight-dev libgl1-mesa-dev intltool python3-dev libxrender-dev libxml2-dev libxslt1-dev libdbus-glib-1-dev
```

Honestly I recommend just checking out each package you need with *sysdeps* to confirm what you need. You should be able to install the dependencies through *sysdeps* but for some reason it hasn't ever worked for me. That's why I just do *apt-file search* for each missing package.

But otherwise huzzah you're ready to go build some things now, have fun!

## Resources

[Developer Mode](https://developer.android.com/topic/arc/sideload#enter-dev)
[Crouton](https://github.com/dnschneid/crouton)
[Crouton Extension](https://chrome.google.com/webstore/detail/crouton-integration/gcpneefbbnfalgjniomfjknbcgkbijom)
[Chromebooks+Linux - Running Custom Containers Under Chrome OS](https://chromium.googlesource.com/chromiumos/docs/+/master/containers_and_vms.md)
[Jhbuild - Setting Up Instructions](https://wiki.gnome.org/HowDoI/Jhbuild)
[Jhbuild - Fixing PATH](https://developer.gnome.org/jhbuild/stable/getting-started.html.en)
[GJS - Setting Up Instructions](https://gitlab.gnome.org/GNOME/gjs/blob/master/doc/Hacking.md)