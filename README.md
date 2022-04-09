```
                                                                           ,,                    
  .g8"""bgd                           .g8""8q.                           `7MM                    
.dP'     `M                         .dP'    `YM.                           MM                    
dM'       ` ,pW"Wq.`7Mb,od8 .gP"Ya  dM'      `MM`7M'   `MF'.gP"Ya `7Mb,od8 MM   ,6"Yb.`7M'   `MF'
MM         6W'   `Wb MM' "',M'   Yb MM        MM  VA   ,V ,M'   Yb  MM' "' MM  8)   MM  VA   ,V
MM.        8M     M8 MM    8M"""""" MM.      ,MP   VA ,V  8M""""""  MM     MM   ,pm9MM   VA ,V
`Mb.     ,'YA.   ,A9 MM    YM.    , `Mb.    ,dP'    VVV   YM.    ,  MM     MM  8M   MM    VVV
  `"bmmmd'  `Ybmd9'.JMML.   `Mbmmd'   `"bmmd"'       W     `Mbmmd'.JMML. .JMML.`Moo9^Yo.  ,V
                                                                                          ,V
         CoreOverlay: A softwareless full-featured overlay solution, by doc norberg    OOb"
```

This is CoreOverlay. CoreOverlay is a stream overlay solution focused primarily on the competitive fighting game scene. What sets CoreOverlay apart is that it is **softwareless** -- that is to say, CoreOverlay doesn't require any program to run other than the streaming software itself. This is achieved by utilising the Browser Source implemented in most popular streaming softwares.

# Features

* Doesn't require running another program
* Supports animations and live updating with either plain CSS code or the Minified JavaScript library
* Because it's all integrated, updates can happen in real-time, without the need for polling or WebSockets
* As it's all HTML/CSS/JS, CoreOverlay can be fully customised to whatever you, the user, need
* It doesn't suck

# Requirements

* Streaming software that features a Browser source, either out-of-box or as an extension. Additionally, your Browser source needs to support interaction. Most popular implementations support this, but check to make sure. CoreOverlay is tested and compatible with OBS Studio and will likely work without issue (though untested) with Streamlabs OBS and XSplit Broadcaster.

# Quick start

1. In your streaming software of choice, create a Browser source or equivalent
2. Set the following parameters:
    Source: `main.html`
    Width: 1920 -- width may be adjusted if configured differently
    Height: 450 -- height may be adjusted if configured differently
    Other settings are optional, but the defaults will work fine.
3. Crop out the controls. In OBS Studio this can be achieved by holding Alt (Option on Mac) and dragging the bottom side up towards the top. This hides the controls from the stream but will remain accessible to you.
4. Right click the source and choose "Interact" or equivalent

You're good to go! Click and type in the controls to configure the overlay's displayed content and click the checkbox to turn it on.

# Customising

As it's built on web technologies, CoreOverlay is fully customisable. Out of the box, CoreOverlay comes with four core files. There is the one html file, **main.html**, which contains the framework for both the overlay and the controls. CSS is handled by two files, **main-controls.css** and **main-display.css**, located in /scripts, for the controls and the overlay respectively. **main.js** handles both controls and display.

# Credits

* CoreOverlay uses the [Minified](https://github.com/timjansen/minified.js) library for ease-of-reading in animations. Minified is Public Domain software.
* Very few bits of code are left over from [Jaxel's old old Animated Overlay package](https://obsproject.com/forum/resources/animating-streams-with-scoreboard-assistant.373/). There doesn't seem to be a license attached to it, but I figured I would be transparent regardless. I don't even remember what specific parts are left over.
