# chester

a simple extension to signal your turn in any active lichess game.
adds a little pawn icon to the status bar at the bottom of the screen.

when it is your turn to play, the pawn will light up green and link you to
the active game.

![green pawn](https://raw.githubusercontent.com/colin-kohli/chester/master/images/little.png)

this extension is ideal for slower or untimed forms of play. i play a lot of
correspondence chess while coding, and clicking into the browser tab to see
i had a turn to take was interrupting my workflow.

to those wondering, yes, it's *definitely* a pawn icon, why do you ask? no need to look at the source.

if the source code for this extension *does* interest you, it's available on
my *[github](https://github.com/cojoko/chester)*.

## setup

just add your Lichess username in the extension settings, and configure the
other settings how you like. your games on Lichess must be public.

## features

### refresh frequency

change the refresh timing in the extension settings. you could have chester check every hour and a half, or every other second. time is in milliseconds.

### monochrome

if you prefer a tidier status bar or want to minimize visual distraction, the
monochrome option uses a separate icon set to tell you it's your turn to play.

## extension settings

this extension contributes the following settings:

* `chester.username`: user's Lichess username
* `chester.refreshtimer`: frequency with which chester fetches games
* `chester.monochrome`: use icons rather than color to alert user

## known issues

none. chester is perfect<sup> ok you're not really supposed to add custom colors
but i haven't figured out how i want to hook into themes yet.</sup>



## release notes

users appreciate release notes as you update your extension.

### 1.0.0

initial release of chester

-----------------------------------------------------------------------------------------------------------
