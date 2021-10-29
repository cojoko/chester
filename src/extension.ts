const axios = require('axios');
const parser = require('pgn-parser');

const PLAYER_NAME = "cojoko";
var HOT_LINK = "";


import { stat } from 'fs';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	setStatus("wait", statusBarItem);
	context.subscriptions.push(statusBarItem);

	let refresh = vscode.commands.registerCommand('chester.refresh', async () => {
		await isYourTurn();
		vscode.window.showInformationMessage('Games updated.');
	});
	context.subscriptions.push(refresh);

	let fuzzyInfo = vscode.commands.registerCommand('chester.fuzzy_info', async () => {
		vscode.window.showInformationMessage( `
		Your only active games have < 4 turns played. 
		See [here](https://lichess.org/api#operation/apiGamesUser) for more details.
		`);
		isYourTurn();
	});
	context.subscriptions.push(fuzzyInfo);

	let openLink = vscode.commands.registerCommand('chester.open_link', async () => {
		console.log(HOT_LINK);
		let success = await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(HOT_LINK));
		isYourTurn();
	});
	context.subscriptions.push(openLink);

	setInterval(isYourTurn, 15000);
}

async function isYourTurn() {

	console.log("Updating...");
	const activeGames = await getGames();
	if (!activeGames){
		setStatus("wait", statusBarItem);
		return;
	}
	
	let fuzzy = false;
	for (var ii = 0; ii < activeGames.length; ii++){
		console.log("Game " + ii.toString() + ":");
		let game = activeGames[ii];
		let moves = game["moves"];
		let link = game["headers"]["1"]["value"];
		let playerColor = "";
		
		for (var jj = 0; jj < game.headers.length; jj++){
			if (game.headers[jj]["value"] === PLAYER_NAME){
				playerColor = game.headers[jj]["name"];

			}
		}
		let turnColor = "";
		console.log(moves.length);
		if (moves.length < 6){
			
			// Games after 5 moves have 3 moves subtracted, so count stalls at 5
			// until move 8. AFAIK there is no way to get turn but i have submitted
			// an issue to the repo 
			fuzzy = true;
		}

		let turn = moves.length % 2;
		if (turn){
			turnColor = "White";
		} else {
			turnColor = "Black";
		}

		console.log(turnColor);
		console.log(playerColor);
		if (turnColor === playerColor){
			setStatus("play", statusBarItem);
			HOT_LINK = link;
			return;
		}
	}

	if (fuzzy){
		setStatus("fuzzy", statusBarItem);
	} else {
		setStatus("wait", statusBarItem);
	}
}

async function getGames() {
	const res = await axios.get("https://lichess.org/api/games/user/cojoko?ongoing=true");
	const status = res.status;
	const pgn = res["data"];
	const result = parser.parse(pgn);

	var activeGames = [];
	for (var ii = 0; ii < result.length; ii++){

		let headers = result[ii]["headers"];
		for (var jj = 0; jj < headers.length; jj++){
			let item = headers[jj];
			if (item["value"] === "Unterminated"){
				activeGames.push(result[ii]);
			}
		}
	}
	console.log(activeGames);
	return activeGames;

}

function setStatus(status: String, display: vscode.StatusBarItem){

	console.log("Status set: " + status);

	// TODO: Add an optional label
	if (status === "wait"){
		display.text = `$(gist-private)`;
		//display.text = `♔$(record~spin)♕`;
		display.color = new vscode.ThemeColor("statusBar.foreground");
		console.log(display.color);
		display.command = "chester.refresh";
		display.show();
	}

	if (status === "play"){
		display.text = `$(gist-private)`;	
		//display.text = `♔$(play-circle~spin)♕`;
		display.color = "#a0e7a0";
		display.command = `chester.open_link`;
		display.show();
	}

	if (status === "fuzzy"){
		display.text = `$(question~spin)`;
		display.command = "chester.fuzzy_info";
		display.show();
	}
}

export function deactivate() {}
