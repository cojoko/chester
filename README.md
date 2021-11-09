# chester

### post-"r/chess" thread update:

*Thank you to everybody for your kindness and feedback in the [reddit thread](https://www.reddit.com/r/chess/comments/ql4dhw/does_anyone_else_use_both_vscode_and_lichess/) for chester's release. I certainly did not expect so many eyes on this project, let alone API direction from Lichess' founder. In response to concerns surrounding large payloads for users with extensive game histories, I have refactored the project to use a seperate endpoint which returns only active games. As this endpoint requires authorization with Lichess, you will need to provide chester a personal authentication token which you can generate [here](https://lichess.org/account/oauth/token/create?description=chester+for+vscode) and add in the extension settings. Apologies for the extra step, but your router will thank you. Thank you all again, keep the feedback coming, and expect additional support coming shortly.*

\- Colin

## about

chester is a simple extension to signal your turn in any active lichess game.
adds a little pawn icon to the status bar at the bottom of the screen.

when it is your turn to play, the pawn will light up green and link you to
the active game.

![green pawn](https://raw.githubusercontent.com/cojoko/chester/master/images/little.png)

this extension is ideal for slower or untimed forms of play. i play a lot of
correspondence chess while coding, and clicking into the browser tab to see
i had a turn to take was interrupting my workflow.

if the source code for this extension interests you, it's available on
my *[github](https://github.com/cojoko/chester)*.

## setup

in order for chester to see your current games, you must generate a personal
api token and add it within the extension settings. simply make a token by
clicking "submit" at [this link](https://lichess.org/account/oauth/token/create?description=chester+for+vscode) 
(no additional scope necessary), and copying the strange string of letters and 
numbers produced.

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

## features

### refresh frequency

change the refresh timing in the extension settings. you could have chester check every hour and a half, or every other second. time is in milliseconds.

### monochrome

if you prefer a tidier status bar or want to minimize visual distraction, the
monochrome option uses a separate icon set to tell you it's your turn to play.

## extension settings

this extension contributes the following settings:

* `chester.Pat`: user's personal authentication token
* `chester.refreshtimer`: frequency with which chester fetches games
* `chester.monochrome`: use icons rather than color to alert user

## known issues

none. chester is perfect<sup> ok you're not really supposed to add custom colors
but i haven't figured out how i want to hook into themes yet.</sup>


### Pre-1.0.0

Using a non authenticated endpoint to return all games by username.
### 1.0.0

Using a PAT-authenticated endpoint which returns only active games for a user.

### 1.0.3

Changed icon to a rook from padlock at the request of users.

-----------------------------------------------------------------------------------------------------------
