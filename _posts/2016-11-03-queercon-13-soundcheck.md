---
layout: post
title: "Queercon 13 Contests: Stego"
date: 2014-04-30
---

  <h2>Preface</h2>

<p>This past summer <a href="https://www.queercon.org/">Queercon</a> (@queercon) hosted two contests: <a href="https://www.queercon.org/contests/2016/06/29/qc13-soundcheck/">Soundcheck</a> by Stemodity and Queercon plus the Badge Challenge (found on the app stores, download it!) by Subterfuge (@sidechannel_org) and <a href="@d4em0n">d4em0nSp4wn</a>. Both contests have had write ups done such as <a href="http://sub7erfuge.tumblr.com/post/150110594854/bsides-seattle-cipher-challenge-write-up">the badge challenge</a> by Subterfuge officially and <a href="http://blackmagicexploits.com/blog/ctf/stego/crypto/all/QC13-Soundcheck">Soundcheck</a> by Vivi Langga (@vivieturtle). The intent of this post is primarily to go through a rundown of how I approached both contests as a way to introduce how I think of challenges.</p>

<p>Unfortunately this got to be a bit longer than expected hence the split into two separate posts.</p>

<h2>Thanks and hot apple cider</h2>

<p>I’d love to thank d4em0nSp4wn for listening to me panicking while rushing to solve them and cheering me on; Subterfuge for the darling contest and inspiring me to continue forward with my graph paper and pens too for future challenges and someday my own puzzle making; Gabe Edwards (@gabedwrds) for being a phenomenal hacker (who by the way is an extraordinary contest solver and CTF-er) and with Kyle (@eiais) for all the long hours of complaining, help, and discussion about the contests with me; ending of course with Queercon for being an organisation I love dearly and hosting the contests.</p>

<h2>How I approach challenges</h2>

<p>No matter what the challenge is—a contest, real life situations, anything—I go to the two basic things that are always close to me: graph paper journal and pens. I abhor lined paper and pencils as I believe one should always be sure on their actions and/or cautious and if it was wrong: own up to it. You can’t erase something you’ve done as you already took the time and effort to do it so why act like you can on paper, too?</p>

<p>Immediately after I’ll write down everything that is already known if possible. After that it depends on the scenario. I’ll sometimes doodle and jot down random notes to myself.</p>

<p>I try to refrain from using computers if possible outside of Google-ing things unless it is required. It’s not so much that I don’t want to code it as I don’t feel satisfactory of my work on a screen compared to the feeling of wholeness and happiness in my hands. It feels like an easy way out which isn’t nearly half as fun.</p>

<h2>Soundcheck</h2>

<blockquote>
  <p>A beat to make you dance!</p>

  <p>Do you like music? Have a good ear? Check out this hot beat from Stemodity. Get prizes!</p>

  <p>Listen closely! Good luck!</p>

  <p><a href="https://soundcloud.com/stemodity/stemodity-crypto">Stemodity - Crypto</a></p>
</blockquote>

<p>I should warn ahead if you have a dog near you: don’t listen to that out loud without headphones. (Chicken) Nugget went insane and whined a whole lot, don’t be like me, keep your dogs happy!</p>

<p>So the first thing I did was listen to the song. A lot. I wanted to know every single part of the song so I could refer back to any single part of it immediately. That and to see if I could just audibly figure it out. Eventually I slowed the song down until I could figure out where the high frequency tone was at (thanks Nugget for helping with the general timing of it the first time).</p>

<p>Once I get access to an actual scanner I’ll re-do the photographs of my journal. Sorry!</p>

<p><img src="/images/soundcheck1.jpg" /></p>

<p>Highlighted are the lengths of how long the tones went for. I did five lines for the five times it occurred in the song with it going down to the seconds and increments of .2 seconds. Initially I thought it had to be Morse code and tried to go by the length of how long it would occur for. Due to the lengths of time being fairly close I tried to think of every option when I couldn’t tell if it was short or long.</p>

<p><img src="/images/soundcheck2.jpg" /></p>

<p>I kept trying to figure it out assuming it was still Morse code. Eventually I was told, "Houston we have a problem," and that I was near Jupiter. I was definitely frustrated, had looked into stego but it hadn't clicked in, and spent a lot of time generally anxious. In the end stego was the correct route. I used VLC and being on a Macbook Pro I tried three different programs until I could actually get something that worked for me (AudioXplorer finally did it for me).</p>

<p><img src="/images/stego7.png" />
<img src="/images/stego6.png" />
<img src="/images/stego1.png" />
<img src="/images/stego5.png" />
<img src="/images/stego2.png" />
<img src="/images/stego4.png" />
<img src="/images/stego3.png" /></p>

<p>Now all I had to do was simply figure out which cipher it was. I knew it had to be SA13=QC13 because it was going to be Queercon 13 this year. I tried a few different ciphers, messed up the final cipher (Playfair), kept going, and got upset at myself.</p>

<p><img src="/images/soundcheck3.jpg" /></p>

<p>Gabe did confirm that it was most definitely on the <a href="http://rumkin.com/tools/cipher/">Rumkin page</a> which made me spiral into a lump of anxiety of not being able to solve it (yet).</p>

<p><img src="/images/soundcheck4.jpg" /></p>

<p>Eventually I did get the final answer.</p>

<blockquote>
  <p>QC13 PARTY ROCK THIS HOUSE</p>
</blockquote>

<h2>Lessons learned from this</h2>

<p><b>Time management</b></p>

<p>I spent too much time (e.g. listening to the song for a few hours) on things that weren’t necessary.</p>

<p><b>Competitiveness</b></p>

<p>With Soundcheck and the Badge Contest I was too focused on everyone else and where they were that I got distracted and let my anxiety take over. Since then I’ve taken a step back, recognized it held me back quite a bit, and now am much more comfortable. “Losing” is only losing if you don’t learn from it and I learned quite a bit from this.</p>

<p><b>Utilize all the tools even if it isn’t what you want</b></p>

<p>Had I not been stubborn trying to solve only with graph paper and pen I likely would have finished much, much, sooner.</p>

<p><b>Sometimes the difficulty is the simplicity of it</b></p>

<p>Looking back at this challenge I made it much more complex in my mind than it was.</p>

<p><b>Relaxing and taking breaks</b></p>

<p>Coming back to the problem later after some time away makes it more clearer than in the rush of the moment when in frustration.</p>

<p>I already had reserved a QC13 badge so ultimately the prize was the satisfaction of getting the challenge.</p>

<p>That and a cute song to listen to (with headphones on).</p>
