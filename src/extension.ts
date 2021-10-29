const axios = require('axios')
const parser = require('pgn-parser')

const PLAYER_NAME = "cojoko"


import { stat } from 'fs';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	set_status("wait", statusBarItem)
	context.subscriptions.push(statusBarItem)

	let disposable = vscode.commands.registerCommand('chester.refresh', async () => {
		await is_your_turn();
		vscode.window.showInformationMessage('Games updated.');
	});
	context.subscriptions.push(disposable);

	is_your_turn();
}

async function is_your_turn() {
	const active_games = await get_games();
	if (!active_games){
		set_status("wait", statusBarItem);
		return;
	}
	
	let fuzzy = false;
	for (var ii = 0; ii < active_games.length; ii++){
		
		let game = active_games[ii]
		let moves = game["moves"]
		let player_color = ""
		
		for (var jj = 0; jj < game.headers.length; jj++){
			if (game.headers[jj]["value"] === PLAYER_NAME){
				player_color = game.headers[jj]["name"]
				// console.log(player_color)
			}
		}
		let turn_color = "";
		console.log(moves.length)
		if (moves.length < 6){
			
			// Games after 5 moves have 3 moves subtracted, so count stalls at 5
			// until move 8. AFAIK there is no way to get turn but i have submitted
			// an issue to the repo 
			fuzzy = true;
		}

		let turn = moves.length % 2 // 1 is black, 0 is white (swapped from fuzzing)
		if (turn){
			turn_color = "White"
		} else {
			turn_color = "Black"
		}

		console.log(turn_color)
		console.log(player_color)
		if (turn_color === player_color){
			set_status("play", statusBarItem);
			return;
		}

	}

	if (fuzzy){
		set_status("fuzzy", statusBarItem);
	} else {
		set_status("wait", statusBarItem);
	}

}

async function get_games() {
	const res = await axios.get("https://lichess.org/api/games/user/cojoko?ongoing=true");
	const status = res.status
	const pgn = res["data"]
	const result = parser.parse(pgn);

	var active_games = [];
	for (var ii = 0; ii < result.length; ii++){

		let headers = result[ii]["headers"];
		for (var jj = 0; jj < headers.length; jj++){
			let item = headers[jj];
			if (item["value"] === "Unterminated"){
				active_games.push(result[ii])
			}
		}
	}
	console.log(active_games)
	return active_games

}

function set_status(status: String, display: vscode.StatusBarItem){

	console.log("Status set: " + status)

	// TODO: Add an optional label
	if (status === "wait"){
		display.text = `$(gist-private)`;
		display.command = "chester.refresh"
		display.show();
	}

	if (status === "play"){
		display.text = `$(play-circle~spin)`;
		display.command = "chester.refresh"
		display.show();
	}

	if (status === "fuzzy"){
		display.text = `$(question~spin)`;
		display.command = "chester.refresh"
		display.show();
	}

}


export function deactivate() {}
