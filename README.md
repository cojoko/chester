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

<<<<<<< Updated upstream
just add your Lichess username in the extension settings, and configure the
other settings how you like. your games on Lichess must be public.
=======
in order for chester to see your current games, you must generate a personal
api token and add it within the extension settings. simply make a token by
clicking "submit" at [this link](https://lichess.org/account/oauth/token/create?description=chester+for+vscode) (no additional scope necessary), and copying the
strange string of letters an numbers produced.

then, within the settings for this extension, paste the token into the box
labeled as "Pat". extension settings can be accessed by
clicking the cog next to the extension name within the extension sidebar.

## use

the color (or shape if using monochrome mode) of the icon lets you know the
status of your active games. color meanings are as follows:

*green*: it is your turn in at least one of your active games. click the icon
to open the active game in your browser.

*grey*: no active games where it is your turn. click the icon to manually refresh
your games.

*red*: there has been an error returning games for the given user. make sure
your token in the extension settings is correct.
>>>>>>> Stashed changes

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
