const axios = require('axios');

// Link opened by clicking the icon if status is "play"
var HOT_LINK = " ";
let statusBarItem: vscode.StatusBarItem;

import * as vscode from 'vscode';

// Main extension function, called on VSCode startup completion
export async function activate(context: vscode.ExtensionContext) {

	// Create status bar icon
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	setStatus("wait");
	context.subscriptions.push(statusBarItem);

	// Register refresh command. Triggered by icon press or thru command pallette
	let refresh = vscode.commands.registerCommand('chester.refresh', async () => {
		await isYourTurn();
		vscode.window.showInformationMessage('Games updated.');
	});
	context.subscriptions.push(refresh);

	// Register openLink command. Opens HOT_LINK when triggered.
	let openLink = vscode.commands.registerCommand('chester.open_link', async () => {
		console.log(HOT_LINK);
		let success = await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(HOT_LINK));
		isYourTurn();
	});
	context.subscriptions.push(openLink);

	// Register errorInfo command. Display error message when icon is clicked in
	// failed state.
	let errorInfo = vscode.commands.registerCommand('chester.error_info', async () => {
		vscode.window.showInformationMessage( `
		Error fetching games for user. Please double check personal API token is
		added correctly.`);
		isYourTurn();
	});
	context.subscriptions.push(errorInfo);

	// Perform inital check
	isYourTurn();

	// Perform check on interval in extension configuration
	setInterval(isYourTurn, vscode.workspace.getConfiguration('chester').get("refreshTimer"));
}

// Checks game status and sets icon status accordingly
async function isYourTurn() {

	console.log("Updating...");

	// getGames() will return a game Id where it is your turn, if one exists.
	const activeGame = await getGames();

	if (activeGame === "error"){
		setStatus("error");
		return;
	}
	if (!activeGame){
		setStatus("wait");
		return;
	} 
	else{
		HOT_LINK = "https://lichess.org/" + activeGame;
		setStatus("play");
	}
}

// Returns the Id of a game where it is your turn, if one exists. 
// Returns "error" if any exception is thrown
// Returns null if no games where it is your turn.
async function getGames() {
	let url = "https://lichess.org/api/account/playing";
	let PAT = vscode.workspace.getConfiguration("chester").get("pat");
	try{
		const res = await axios.get(url, {
			headers: {
				Authorization: 'Bearer ' + PAT
			}
		});
		console.log(res.data.nowPlaying);
		for (const game of res.data.nowPlaying){
			console.log(game["isMyTurn"]);
			if (game["isMyTurn"]){
				return game["fullId"];
			}
		}
		return null;
	}
	catch(err){
		console.log(err);
		return("error");
	}
}

// Sets icon status and funtionality. 
function setStatus(status: String){

	console.log("Status set: " + status);

	if (status === "wait"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(record~spin)♕`;
		} else{statusBarItem.text = `♖`;}
			
		statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		statusBarItem.command = "chester.refresh";
		statusBarItem.show();
	}

	if (status === "play"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(play-circle~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `♖`;	
			statusBarItem.color = "#a0e7a0";
		}
		statusBarItem.command = `chester.open_link`;
		statusBarItem.show();
	}

	if (status === "error"){
		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(issues~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `$(extensions-warning-message) ♖`;
			statusBarItem.color = "#ff9994"; 
		}
		statusBarItem.command = "chester.error_info";
		statusBarItem.show();
	}
}

export function deactivate() {}
