---
layout: post
title: "git format-patch life: GNOME example"
date: 2018-3-22
---

## Quick walkthrough

Find the project you're looking for here: 
[https://git.gnome.org/browse/](https://git.gnome.org/browse/)

For this example I'll be using JHBuild: 
[https://git.gnome.org/browse/jhbuild/](https://git.gnome.org/browse/jhbuild/)

Clone it! Link is at the bottom of the index: 
[https://git.gnome.org/browse/jhbuild](https://git.gnome.org/browse/jhbuild)

Make a branch, I'm calling mine sanitycheck: 
```
git checkout -b sanitycheck
```

Make your changes to the file and save, commit by doing:
```
git commit -a
```
Write a solid commit message. [Read this](https://lists.cairographics.org/archives/cairo/2008-September/015092.html) for commit message writing tips.

Now you're going to want to do: 
```
git format-patch
```
I highly recommend reading the man page and look at the examples there:
```
man git-format-patch
```
At bare minimum:
```
git format-patch -<num of commits from top of selected hash> <hash begin from>
```

Example of what I ended up doing (-1 is the topmost commit from my current branch, I specified the hash, -o is for the output directory patches that exists for JHBbuild:
```
avi@localhost:~/jhbuild$ git format-patch -1 2917f03c655f8932cb4455d61ae3006b0304b9e6 -o patches
patches/0001-Making-a-cute-patch-yay.patch
```

It should result in something like this:
```
From ba2668cc976234a880d0c512d2d316c0414b100a Mon Sep 17 00:00:00 2001
From: Avi Zajac <hello@avizajac.com>
Date: Wed, 21 Mar 2018 19:41:45 -0400
Subject: [PATCH] Making a cute patch yay to examples.

---
 jhbuild/commands/sanitycheck.py | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/jhbuild/commands/sanitycheck.py b/jhbuild/commands/sanitycheck.py
index 7d4b8e3..50abb02 100644
--- a/jhbuild/commands/sanitycheck.py
+++ b/jhbuild/commands/sanitycheck.py
@@ -151,7 +151,7 @@ class cmd_sanitycheck(Command):
         try:
             import dbus.glib
         except:
-            uprint(_('%s not found') % 'dbus-python')
+            uprint(_('%s not found') % 'python-dbus')
 
     def check_m4(self):
         try:
-- 
2.7.4
```

From here you can either go submit a bug and upload the patch as an attachment directly: [Bugzilla](https://bugzilla.gnome.org/) or use git-bz via command-line: [git-bz](http://git.fishsoup.net/man/git-bz.html)

If you want to apply a patch: 
```
git am <patch>
```

It should look something like this:
```
avi@localhost:~/jhbuild$ git am patches/0001-Making-a-cute-patch-yay.patch
Applying: Making a cute patch yay to examples.
```

That's basically it summed up!

## What actually happened

I was trying to get myself set up on a different GNOME project when the guide said to build it with JHBuild. I used two different guides ([this one](https://wiki.gnome.org/Projects/Jhbuild/Introduction) and [this one too](https://developer.gnome.org/jhbuild/unstable/getting-started.html.en)) to get it set up. Expectedly when I ran __sanitycheck__ I was missing packages. No big deal, but __dbus-python__ was the only one in the list that didn't exist. 

```
avi@localhost:~/jhbuild/jhbuild$ jhbuild sanitycheck
dbus-python not found
avi@localhost:~/jhbuild/jhbuild$ sudo apt-get install dbus-python
Reading package lists... Done
Building dependency tree       
Reading state information... Done
E: Unable to locate package dbus-python
```

I ended up finding this [StackOverFlow](https://stackoverflow.com/questions/13365697/install-python-dbus-in-virtualenv) that gave me my solution (pip and pip3 didn't work either). I also discovered later that for Fedora users it _is_ __dbus-python__ but for Debian/Ubuntu users it's __python-dbus__ instead.

I found the issue on [GitHub](https://github.com/GNOME/jhbuild/blob/master/jhbuild/commands/sanitycheck.py) in a mirror in the error message:
```
# check for "sysdeps --install" deps:
        try:
            import glib
        except:
            uprint(_('%s not found') % 'python-gobject')
        try:
            import dbus.glib
        except:
            uprint(_('%s not found') % 'dbus-python')
```

I wanted to fix the error message but since it wasn't on GitHub/GitLab I knew it wasn't just a simple issue/pull request. I ended up predominantly on these three pages:

[https://wiki.gnome.org/Git/WorkingWithPatches](https://wiki.gnome.org/Git/WorkingWithPatches)
[https://wiki.gnome.org/Git/Developers](https://wiki.gnome.org/Git/Developers)
[https://wiki.gnome.org/DocumentationProject/Contributing](https://wiki.gnome.org/DocumentationProject/Contributing)

I hopped on the [newcomer Riot.im chat](https://riot.im/app/#/room/#_gimpnet_#newcomers:matrix.org) to ask how to actually contribute to JHBuild and someone ended up linking me to:

All (non-migrated) projects: [https://git.gnome.org/browse/](https://git.gnome.org/browse/)
Bugzilla: [https://bugzilla.gnome.org/](https://bugzilla.gnome.org/)

From there I found [JHBuild](https://git.gnome.org/browse/jhbuild/), cloned it, made a new branch. After I made the change I wanted I did __git commit -a__ but got stuck at deciding what to say. [This was linked](https://lists.cairographics.org/archives/cairo/2008-September/015092.html) in one of the contributing documents I found yet the most helpful thing for me personally was having someone to talk with me about what I was actually saying. I ended up writing a commit with the message: "Correct name of package in error message to python-dbus if missing package."

That's all before I realised the entire Fedora/Debian package naming issue anyways. Oh well.

The next step was __git format-patch__. I ended up just skimming to the end of the man page (__man git-format-patch__) for examples. My patch looked like this now:
```
From ba2668cc976234a880d0c512d2d316c0414b100a Mon Sep 17 00:00:00 2001
From: Avi Zajac <hello@avizajac.com>
Date: Wed, 21 Mar 2018 19:41:45 -0400
Subject: [PATCH] Correct name of package in error message to python-dbus if
 missing package.

---
 jhbuild/commands/sanitycheck.py | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/jhbuild/commands/sanitycheck.py b/jhbuild/commands/sanitycheck.py
index 7d4b8e3..50abb02 100644
--- a/jhbuild/commands/sanitycheck.py
+++ b/jhbuild/commands/sanitycheck.py
@@ -151,7 +151,7 @@ class cmd_sanitycheck(Command):
         try:
             import dbus.glib
         except:
-            uprint(_('%s not found') % 'dbus-python')
+            uprint(_('%s not found') % 'python-dbus')
 
     def check_m4(self):
         try:
-- 
2.7.4
```

I freaked out at the first line when I saw the time stamp, found the [StackOverFlow](https://stackoverflow.com/questions/15790120/what-is-the-first-line-of-git-format-patch-output) answer on it. I also realised had I actually just taken my time the first time around on the man page the answer was right there, too, which I've done since.

When I wasn't quite sure what to do from here on after I was recommended to try applying a patch to understand it so I went back to __master__ from my new branch to apply it:
```
avi@localhost:~/jhbuild$ git am patches/0001-Correct-name-of-package-in-error-message-to-python-d.patch
Applying: Correct name of package in error message to python-dbus if missing package.
```

Unfortunately from there for whatever reason [git-bz](http://git.fishsoup.net/man/git-bz.html) wouldn't recognise my browser credentials so I couldn't use it. I also realised shortly after that dbus-python _is_ correct, for Fedora users and the package in general I guess, but not for Debian/Ubuntu users.

So that was my life for a few hours. For something that's surprisingly very simple and basic it wasn't very straightforward to find out how to do it all in one single step-by-step guide. If this helps someone else that'd be lovely but otherwise it's a template for myself in case I forget someday.