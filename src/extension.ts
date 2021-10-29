const axios = require('axios')
const parser = require('pgn-parser')


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
		if (await is_your_turn()){
			set_status("play", statusBarItem)
		}

		vscode.window.showInformationMessage('Games updated.');
	});

	context.subscriptions.push(disposable);

	is_your_turn();
}

async function is_your_turn() {
	const active_games = get_games();
	if (!active_games){
		return false;
	}
	return true;




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

}
// this method is called when your extension is deactivated
export function deactivate() {}
