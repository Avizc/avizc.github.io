---
layout: post
title: "Queercon 14 Contest Writeup"
date: 2017-8-1
---

Disclaimer: This post has the full final solution for this puzzle. If you want to work on this don't open it!

*"Need something to do on your travels to Queercon? Look no further! Come follow us down the rabbit hole, avoid any subterfuge, and see where the path takes you! It may lead to cool swag or prizes!"*

I almost didn't make it to my fifth DEFCON and Queercon [in a row] this year had it not been for the amazing folks and further who privately reached out and made it possible for me. Thank you all so much for helping me get there. Did not think that I'd end up writing this post with a Queercon challenge coin in my pocket and the solutions to the contest in my journal next to me. It has been a wild journey to get to this point of my life and Avi at 17 at DEFCON 21/Queercon 10 never saw this coming.

All of my work is done on graph paper, typically in my journal, and pen. Yes things I did could have easily been done on a laptop or I could have easily programmed it out. People asked me all weekend this question asking why I was wasting my time writing out everything whether it be the ASCII table or what not. Yes I would have saved time had I just done it via staring at it on a screen and not write it out for my own personal use.

Except that's not me. I do puzzles and things in this manner because it makes me very, very, happy. I had a mental break down on Thursday night for a multitude of reasons. These puzzles were soothing, it's relaxing, it's how I cope. They made me happy. Nothing makes me happier than just re-writing an entire ASCII table for the nth time in my life again.

Without knowing how and why I work the way I do it's hard for folks to understand me apparently. So this is my write up on Subterfuge's Queercon contest this year so maybe folks can know me a little better.

Graph paper is my home.

## Puzzle 1

<img src="/images/qc0.png">

The first puzzle was released via the Queercon app and on the [website](https://queercon.org/contests/2017/07/20/qc14-puzzle-1/) 20 July 2017. I started the initial work on 23 July after being told it was out and they had already begun it themselves. All I did to begin was try to convert the characters into a format easy to manage: ABC...XYZ.

In hindsight I should have converted it to numbers 1,2,3...26 as it ended up confusing me for a little.

I didn't touch it again until my flight Wednesday evening 26 July. This is where I began attempting to find the frequency and look for patterns. You can see that in the squares/circles/etc in bright blue pen. One key thing to note is that I immediately wrote 'SEE' to replace JTT. I didn't know for sure at the time it'd be the answer but I felt pretty steadfast on it as a placeholder until later for guesses. What I didn't realise was that the theme would be superencipherment.

<img src="/images/qc1.jpg">

On the plane I got a bit distracted by a few conversations, didn't double check that my inital attempt at substituting the puzzle with the alphabet was incorrect. I felt instictively ABCD and ABC had to at least be ABC=THE but when I applied it everywhere things didn't work. On an aside I should have converted everything into numbers as it threw me off on the final part to solve it.

Hence why I went all out on the tables until Thursday morning when it was an, "Oh this is incorrect," re-doing it twice, and getting the cleartext was fairly simple from there. That's when I discovered incorrectly (again) the ending was: STU/JPLV/BQ/JUU/MUW.

At this point I was feeling really bad about myself after an interaction that made me think gosh I really don't know anything. Changed to a different room of the suite into a corner that wasn't really as comfy as the corner I left. I don't fully write out what I'm thinking (but write what I need for sure) because I see it in front of me but with a mental block of everything I couldn't hold it long enough. It took me re-writing it twice to show what I was visually seeing. I knew what I wanted to do but I kept translating it incorrectly which made me feel worse about myself on the first page shown below. It took the second page below to do it correctly and it worked!

<img src="/images/qc2.jpg">
<img src="/images/qc3.jpg">

So for the second page this was what I originally had:

```
ABCD EFC GEHAHIJ KLF DLM JLFNLI HI ABC OP QLMIJC RST JOLU BP JTT DTV
THEY ARE WAITING FOR YOU GORDON IN THE QC LOUNGE     GQO  HC G   Y
```

I was feeling a little less confident in 'SEE' being my final word for 'JTT' as I only had 'G'. But I had a single word: HC. Visually I kept trying to build up but being unable to do it the first time around I went over-redundant on myself to first translate the substituted characters to our alphabet:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ | SUBSTITUTED LETTERS
THEYARWINGFOUDQCL          | PLAINTEXT
```

Now to convert our alphabet to the substituted letters:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ | ORIGINAL PLAINTEXT
E PNCKJBH  Q IL OF AM G D  | SUBSTITUTED LETTERS
```

We're missing {B,J,K,M,P,S,V,X} at this point. At this point the only word that's fully filled was BP in substituted letters or HC in our plaintext. HC or {8,3} in my head was -5 for me and the only other two letter words that matched -5 was 'TO' or 'UP' as shown.

<img src="/images/qc4.jpg">

Going back to earlier we had:

```
RST JOLU BP JTT DTV | SUBSTITUTED LETTERS
    GQO  HC G   Y   | ORIGINAL PLAINTEXT
```

Now I added in the third row:

```
RST JOLU BP JTT DTV | SUBSTITUTED LETTERS
    GQO  HC G   Y   | ORIGINAL PLAINTEXT
         TO         | FINAL PLAINTEXT
```

While it seems redundant I needed for myself to manually look at how to build back up from the final to the original to the substituted rows (or the reverse). Along with now shifting T to H this is why my alphabet set up now looked like this:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ | ORIGINAL PLAINTEXT
E PNCKJBH  Q IL OF AM G D  | SUBSTITUTED LETTERS
ABCDEFGHIJKLMNOPQRSTUVWXYZ | ORIGINAL PLAINTEXT
MNOPQRSTUVWXYZABCDEFGHIJKL | FINAL PLAINTEXT
```

Now all I had to do was build up and/or down. Plugging in my new final plaintext letters:

```
RST JOLU BP JTT DTV | SUBSTITUTED LETTERS
    GQO  HC G   Y   | ORIGINAL PLAINTEXT
    SCA  TO S   K   | FINAL PLAINTEXT
```

I decided for sure 'JTT' must be 'SEE' and so I worked up from the final plaintext of E to S for 'GSS', 'JOLU' and 'GQO' being 'SCA' I decided it must be 'SCAN', with the addition of T->S->E in 'DTV' becoming 'YS' and 'KE' that meant it'd be 'KEY' creating now:

```
RST JOLU BP JTT DTV | SUBSTITUTED LETTERS
  S GQOB HC GSS YSM | ORIGINAL PLAINTEXT
  E SCAN TO SEE KEY | FINAL PLAINTEXT
```

I was left with an alphabet of:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ | ORIGINAL PLAINTEXT
EUPNCKJBH  QVIL OFTAM G D  | SUBSTITUTED LETTERS
ABCDEFGHIJKLMNOPQRSTUVWXYZ | ORIGINAL PLAINTEXT
MNOPQRSTUVWXYZABCDEFGHIJKL | FINAL PLAINTEXT
```

Which left me with 6 unassigned final plaintext letters: BHJLVW

It was BLE.

<img src="/images/qc5.jpg">

## Puzzle 2

This was the puzzle inside of the Queercon brochure for this year right when you opened it. Unfortunately I did not take a photo of it prior to drawing over 3-5 of them to talk wiwth folks over who asked me about it. This was the raw cipher block though:

```
AZZSUAPYDD
ZRQNXSDJCC
JVYIAEYUHH
DMANTVAPGG
LIERRDJUDD
KWHVEBDEEE
XHYGVTDRHH
ATKIOVAEEE
HIBKVOPGFF
AVLTKCAHDD
YQBEHWOQGG
FUKKEDVNAA
PLKBRRHWEE
BOJYWZSTBB
GDMPRJZVDD
FDENZSLKCC
JYREDODYGG
FMQAAQOGGG
IHPTBAFWHH
VEAWSMROAA
FULGUKEKFF
SENGQCEXDD
TISZKQHEBB
PSOKSHXTFF
MAGTVOTOEE
```

I wrote down immediately 0-9 for the columns and 0-24 for the rows. The first things one would most likely notice immediately is that it's a block of what is presumably ciphertext and and column 8-9, the last two, are the exact same in values per row. I overcomplicated the entire thing because I thought it couldn't be that simple. Which led to doing a frequency analysis over it which was overkill.

<img src="/images/qc6.jpg">

Subterfuge tested out a hint on me by telling me the doubles lead the path. Which honestly was more of a reminder to myself of what is right in front of me and should have been the first thing I went with.

Sometimes the answer is simpler than we'd like to think.

It was at this point I was chatting over the puzzle and hint with another person who turned out to be in the same spot I was in. We were chatting when Subterfuge came up to us and shortly after while he was talking it immediately hit me.

Are you thinking what I'm thinking? I asked. Then we both ran into the swag room and sat down. I was working in my journal, they were working on their laptop, and we got to the next part:

```
SQUAREROOTOFROPEDOWVKGIHV
```

<img src="/images/qc7.jpg">

This is now one of my favourite and memorable memories from this DEFCON and Queercon which I'm sure will go down in my happy memories with other events like my accidental insulting of LosT's Korean at my first DEFCON but being really inspired by his DC101 speech, teaching people ciphers outside of the first year of CPV when the doors were locked, doing the Caesar challenge with pigpen, etc.

Were you thinking I was about to finish this part of the puzzle write up now? Nope!

## Puzzle 3

Right after finishing the initial part of the second puzzle we received stickers with QR codes from Subterfuge who came into the room to check in on us. I didn't have a QR code reader on my phone (I really don't use my phone much beyond reading stuff) so I had to download that. I figured I'd come back to the second puzzle later to which I did but at the time it was hard to tell when and/or where everything would fall in place.

The result of the QR code was:

```
TYSCTSQXATIRGTMPAQVCKQQVLIJSVOPTQRWXVOWZVVRGRGLWSMFMRUSAHEFDTCKW
```

Something in my head went I want to break this into an 8x8 block. But to be sure of things I wrote it out also as 4x16 and 2x32 blocks. I also did frequency analysis just to have it on hand in case I needed it. Because of the entire 8x8 thing I thought maybe 'QUEERCON' was the key.

<img src="/images/qc8.jpg">

Nope! Lets keep going.

## BLE scanning

This was my first year that I hadn't pre-reserved a badge since my first and second years (my third and fourth I reserved in advance). While they had locations released every such minutes on where to go to receive a Queercon badge I felt with so many folks attempting to get a badge I wouldn't have a chance. So I decided to power through the challenge so I could get a badge in the end whenever that was since I love my Queercon badges (they began from my first year onward).

Jake ended up getting a badge for me so I could do the contest!

So he came into the swag room asking why we hadn't done anything to the badges. I hadn't thought to do anything yet and figured it'd come later but he was rather adamant on how we needed to do our badges now. After confirming the first puzzle answer being 'BLE SCAN TO SEE KEY' we knew we'd have to scan it. But how?

Well, receive more help is the answer apparently. I downloaded nRF Connect on Android to scan the badges and was informed on how to read some of it. Never will likely be an expert in it but it was lovely to have context.

Aw golly I guess this means I had to diverge from using strictly my journal and pen twice then: one for the QR code scanning, one for the BLE scanning (this excludes Google-ing for questions I had or researching ideas).

From the scans I got sample data from three badges. At one point I asked for two badges to be put together for me and see if that changed the data at all. It didn't so I moved onto just writing down a quick ASCII table for myself. In addition I split off the BLE scans with dividers so I could easily read it for later on and marked where each badge was unique trying to isolate them.

<img src="/images/qc9.jpg">

## Back to puzzle #2

I left off part 2 like this:

```
SQUAREROOTOFROPEDOWVKGIHV
```

To further reduce it down all I cared about was 'DOWVKGIHV'. With it being 9 characters I knew it wasn't my key for the third puzzle. I tried all the Caesar cipher rotations but they didn't work. This stumped me because I felt there was no way it could have a key of its own at this point. Subterfuge reminded me there was more than one way of doing things and that was enough for me to run into my own world again.

I did a reverse of the alphabet which finally ended with a message: LASTEIGHT.

<img src="/images/qc10.jpg">

## And also back to the BLE scans

The last eight hexadecimal numbers of the BLE scans were all consistent across the three badges so I knew it had to be it. Here is the conversion:

```
41 52 4F 59 47 42 49 56
A  R  O  Y  G  B  I  V
```

Unfortunately for me I thought there had to be more to this like with the prior puzzle #2 so I kept going with trying to apply the Caesar cipher both ways. Which led to a quick nope-ing out of.

## The true beginning of puzzle #3

8x8 is what I felt from the very start the puzzle would end up as.

```
TYSCTSQX
ATIRGTMP
AQVCKQQV
LIJSVOPT
QRWXVOWZ
VVRGRGLW
SMFMRUSA
HEFDTCKW
```

Vigenère is the first classical keyworded cipher I ever learned. So the next step was using my key of 'AROYGBIV' (which I now know is a rainbow!) to translate it. Which turned into:

```
THEENRIC
ACUTASEU
AZHEEPIA
LRVUPNHY
QAIZPNOE
VEDILFDB
SVROLTKF
HNRFNBCB
```

Looking back I realise I made a mistake in understanding what this was doing. Whether it was sleep deprivation or just ignoring the most obvious thing I didn't realise 'THEENRIC' was the beginning of it being deciphered. I thought it was coincidental gibberish. Oops.

In my state of who-knows-what-my-brain-was-doing I ended up trying to do a frequency analysis... on a cipher block that I knew was clearly keyed and a total flying macarons what is going on moment. I was also panicking because one person ended up asking me about 'AROYGBIV' which they got via a program online but they skipped an entire step I took to get to that point. It really spooked me and I thought there was no way I'd win this contest since, well, I'm doing this by hand.

So I resolved to my fate of not finishing before them but also my lanyard disappeared from a group of people who were doing things with my badge (they had promised to return my badge to me with my lanyard to which I only got my badge back after I went back remembering about it... but I got my lanyard with my CPV volunteer badge back!) which made me a lot more emotionally upset than expected.

I accidentally also in this time period enciphered the entire block again. Essentially converting back the exact same block I had deciphered to the ciphertext... again. Oops.

<img src="/images/qc11.jpg">

The theme of this entire contest was superencipherment but for myself the theme was reminding me there's more than one way to do the same thing and go try out the most blatantly too obvious thing first, too.

In the end I had to learn what an autokey cipher was. I got the first 16 characters done (I now realise there was a slight mistake which was the first T in the second part that caused me issues after):

```
AROYGBIV | THEENRIC | KEY
TYSCTSQX | ATIRGTMP | CIPHERTEXT
THEENRIC | TMENTCEN | PLAINTEXT
```
 The issue with the next 8 were such an issue I ended up re-writing the entire Vigenère square again, and finally writing out the message correctly.

 ```
 AROYGBIV THEENRIC HMENTCEN TERPROMI SESDEADL YNEUROTO XINMASSI VESARCAS | KEY
 TYSCTSQX ATIRGTMP AQVCKQQV LIJSVOPT QRWXVOWZ VVRGRGLW SMFMRUSA HEFDTCKW | CIPHERTEXT
 THEENRIC HMENTCEN TERPROMI SESDEADL YNEUROTO XINMASSI VESARCAS MANDCAKE | PLAINTEXT

 THE ENRICHMENT CENTER PROMISES DEADLY NEURO TOXIN MASSIVE SARCASM AND CAKE | FINAL LINE
 ```

 And that was the entire contest. Oh golly.

 <img src="/images/qc12.jpg">
 <img src="/images/qc13.jpg">