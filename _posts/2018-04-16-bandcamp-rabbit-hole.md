---
layout: post
title: "Down the Bandcamp Job Application Rabbit Hole"
date: 2018-4-16
---

_This post contains random sad comments scattered throughout it, I'm listening to Mars Argo and writing this post to deal with the state of my life right now._

I was introduced to [Mars Argo's music](https://marsargo.bandcamp.com/) recently. Since then I've been like an addict searching for ~~meaning~~ all of her music (much of it having been taken down). That led me to <a href="https://bandcamp.com/">Bandcamp</a> which delightfully had some of her music in a decent collection. I accidentally went down a rabbit hole from there when I had to make an account to listen to her music.

At the very top of the page when I signed in was a little <a href="https://bandcamp.com/jobs#developer">"We’re hiring in design and engineering!"</a> and so I figured I'd check it out. Disclosure I did not apply because I don't qualify for their requirements as a junior developer ~~plus who knows when I'll even be good enough for a job at this point~~.

Anyways.

The job posting listed requirements for ~~everything I'm not~~ likely a mid to senior level position but what caught my eye was: "To apply, check the HTTP headers." Sure enough there was a link there.

<img src="/images/bandcamp1.png">

Which led to some <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST">HTTP POST</a> content.

<img src="/images/bandcamp2.png">

I personally used Postman to input the data provided and post which led to another link.

<img src="/images/bandcamp3-1.png">
<img src="/images/bandcamp3-2.png">

Now there was an image of some code:

```
function rt(str1,fn,str2){return function(s){return str2+fn(s)+str1;};}
function lt(str1,fn,str2){return function(s){return str1+fn(s)+str2;};}
var fn=//You can easily find this yourself
```

<img src="/images/bandcamp4.png">

I was pretty sleep deprived at this point and wasn't sure why the code wasn't working (I typo'd and forgot an entire letter). I asked someone else to see what they thought of the code ~~to make sure I wasn't being a complete idiot because I didn't get it working immediately~~. I've since done it by hand to double check and make sure I actually understood it. All you need to get the next (semi) link (due to my typo) is:

```
console.log(fn(""))
```

<img src="/images/bandcamp5.png">

If you're curious as to what it looks like line-by-line, this is what's happening using my own example with a shout out to one of my favourite sad Twitter accounts <a href="https://twitter.com/sosadtoday">@sosadtoday</a> (each char numbered in order of sequence in the string):

```
function rt(str1,fn,str2){return function(s){return str2+fn(s)+str1;};}
function lt(str1,fn,str2){return function(s){return str1+fn(s)+str2;};}
var fn=lt("i[0]",rt("s[34]",lt(" [2] ",rt("r[32]",lt("o[4]",rt("t[30]",lt("s[6]",lt("a[7]",lt("d[8]",rt(" [26] ",lt("t[10]",rt("u[24]",rt("b[23]",rt(" [22] ",lt("y[14]",rt("e[20]",lt("i[16]",rt("n[18]",function(s){return s;}," [17] "),"e[19]")," [15] "),"d[21]"),"a[13]"),"d[12]"),"o[11]"),"n[25]")," [9] "),"p[27]"),"i[28]"),"c[29]")," [5] "),"u[31]"),"s[3]"),"e[33]"),"m[1]"),".[35]");
console.log(fn(""));
// This should print:
// i[0]m[1] [2] s[3]o[4] [5] s[6]a[7]d[8] [9] t[10]o[11]d[12]a[13]y[14] [15] i[16] [17] n[18]e[19]e[20]d[21] [22] b[23]u[24]n[25] [26] p[27]i[28]c[29]t[30]u[31]r[32]e[33]s[34].[35]
```

Cool, now all that's left is a ton of spans to find an email address.

<img src="/images/bandcamp6.png">

Here's a sample of the HTML:

```
<span class="g lf">d</span>
<span class="k lf">n</span>
<span class="c">
  <span class="u lf">f</span>
  <span class="j lf">l</span>
  <span class="y lf">c</span>
  <span class="o lf">s</span>
  <span class="v lf">j</span>
  <span class="s">
    <span class="k lf">u</span>
    <span class="p lf">.</span>
    <span class="x lf">d</span>
    <span class="p">
      <span class="f lf">p</span>
    </span>
    <span class="w lf">a</span>
    <span class="g lf">v</span>
    <span class="i lf">e</span>
    <span class="t lf">v</span>
    <span class="m">
      <span class="t lf">a</span>
      <span class="f lf">e</span>
      <span class="t lf">g</span>
    </span>
```

This runs you to 2610 lines in a file. If you clean it up you're left with a frequency table of:

```
   <span class="[] lf"> <span class="[]">
A           57                 10
B           53                 11
C           79                 6
D           85                 7
E           65                 18
F           79                 11
G           83                 12
H           72                 7
I           55                 13
J           72                 5
K           65                 15
L           71                 16
M           85                 15
N           85                 12
O           87                 17
P           83                 17
Q           79                 12
R           96                 11
S           89                 7
T           75                 17
U           90                 14
V           81                 16
W           82                 8
X           80                 7
Y           68                 12
Z           91                 6
```

This is where I stopped since ~~I'm just ready to cry in a clean bed once my laundry is done~~ I should try to get this new hard drive working so I can have a functioning machine again.

I think it was a pretty cute small rabbit hole ~~to distract me from my crushing fear of never being good enough for anyone at 3AM~~ and think it's a good introduction to understanding a few concepts like HTTP headers, methods, and what not, for folks who've never done it before.