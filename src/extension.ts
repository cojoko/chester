const axios = require('axios');
const parser = require('pgn-parser');

var HOT_LINK = " ";
let statusBarItem: vscode.StatusBarItem;

import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	setStatus("wait");
	context.subscriptions.push(statusBarItem);

	let refresh = vscode.commands.registerCommand('chester.refresh', async () => {
		await isYourTurn();
		vscode.window.showInformationMessage('Games updated.');
	});
	context.subscriptions.push(refresh);

	let fuzzyInfo = vscode.commands.registerCommand('chester.fuzzy_info', async () => {
		vscode.window.showInformationMessage( `
		Your only active games have < 4 turns played. \n
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

	let errorInfo = vscode.commands.registerCommand('chester.error_info', async () => {
		var playerName = vscode.workspace.getConfiguration("chester").get("username");	
		vscode.window.showInformationMessage( `
		Error fetching games for user ` + playerName);
		isYourTurn();
	});
	context.subscriptions.push(errorInfo);


	isYourTurn();
	setInterval(isYourTurn, vscode.workspace.getConfiguration('chester').get("refreshTimer"));
}

async function isYourTurn() {

	console.log("Updating...");
	const activeGames = await getGames();

	if (activeGames === "error"){
		setStatus("error");
		return;
	}
	if (!activeGames){
		setStatus("wait");
		return;
	}
	
	let fuzzy = false;
	for (var ii = 0; ii < activeGames.length; ii++){
		console.log("Game " + ii.toString() + ":");
		let game = activeGames[ii];
		let moves = game["moves"];
		let link = game["headers"]["1"]["value"];
		let playerColor = "";
		
		var playerName = vscode.workspace.getConfiguration("chester").get("username");
		for (var jj = 0; jj < game.headers.length; jj++){
			if (game.headers[jj]["value"] === playerName){
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
		}else{

			let turn = moves.length % 2;
			if (turn){
				turnColor = "White";
			} else {
				turnColor = "Black";
			}

			console.log(turnColor);
			console.log(playerColor);
			if (turnColor === playerColor){
				setStatus("play");
				HOT_LINK = link;
				return;
			}
		}
	}

	if (fuzzy){
		setStatus("fuzzy");
	} else {
		setStatus("wait");
	}
}

async function getGames() {
	var playerName = vscode.workspace.getConfiguration("chester").get("username");
	let url = "https://lichess.org/api/games/user/"+playerName+"?ongoing=true";
	console.log(url);
	var res;
	try{
		const res = await axios.get(url);
	
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
	catch(err){
		console.log(err);
		return("error");
	}
	

}

function setStatus(status: String){

	console.log("Status set: " + status);

	// TODO: Add an optional label
	if (status === "wait"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(record~spin)♕`;
		} else{statusBarItem.text = `$(gist-private)`;}
			
		statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		statusBarItem.command = "chester.refresh";
		statusBarItem.show();
	}

	if (status === "play"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(play-circle~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `$(gist-private)`;	
			statusBarItem.color = "#a0e7a0";
		}
	
		statusBarItem.command = `chester.open_link`;
		statusBarItem.show();
	}

	if (status === "fuzzy"){
		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(question~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `$(gist-private)`;
			statusBarItem.color = "#fdfdaf"; 
		}
		
		statusBarItem.command = "chester.fuzzy_info";
		statusBarItem.show();
	}
	if (status === "error"){
		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(issues~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `$(gist-private)`;
			statusBarItem.color = "#ff9994"; 
		}
		statusBarItem.command = "chester.error_info";
		statusBarItem.show();
	}
}

export function deactivate() {}
