title: "DOMSTEP: A Browser Dance Party"
author:
  name: Jamison Dance
  twitter: jergason
  url: http://jamisondance.com
controls: false
style: styles/style.css

--

#DOMSTEP

A Browser Dance Party

<script src="./build/presentation.js"></script>


--

#Who Am I

* [@jergason](http://twitter.com/jergason)
* [jergason](https://github.com/jergason) on GitHub

--

#Who Am I

* [@jergason](http://twitter.com/jergason)
* [jergason](https://github.com/jergason) on GitHub

--

#24601

--

#Who Am I

* [@jergason](http://twitter.com/jergason)
* [jergason](https://github.com/jergason) on GitHub
* Former international rock superstar

--

<button class="play-goodsman">Unleash The Thunder</button>
<script src="./build/simple-rock.js"></script>

<!--this is my highschool band The Goodsman Brothers.-->

--

# Let's start an EDM band

<!--EDM is what pretentious people say instead of dubstep.
It also means we don't need to know how to play an instrument or really
do anything besides program.-->

--

# Step 1

We need a name
<input type="text" placeholder="Mariokart Deathmath">

--

# Step 2

We need to figure out how to play music

--

# Web Audio API

<img src="./img/web-audio.png">

<!-- The web audio api is the solution to all our problems!
There is an AudioContext, which is basically a container for nodes and buffers.
You use the context to construct this graph of nodes, and then pipe the sounds
through the nodes to make beautiful music.-->

--

#An Example!

Let us make beautiful music
<button class="sine-demo">Beep It Up</button>
<script src="./build/sine.js"></script>

<!-- show the code! -->

--


#Loading Buffers

--

<div id="wavyscope" style="height:400px;width:400px;"></div>
<button class="goodsman-demo">Unleash The Thunder</button>
<script src="./build/rock.js"></script>

<!-- Show the code! Get the audio context, make a node, connect it to the
desination. -->

--

#Dropping The Beats

<textarea class="beats"></textarea>
<button class="drop-the-beat">Drop The Beat</button>
<button class="stop-the-beat">Stop The Beat</button>
<script src="./build/beats.js"></script>
