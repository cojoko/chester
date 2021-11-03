const axios = require('axios');

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

function setStatus(status: String){

	console.log("Status set: " + status);

	if (status === "wait"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(record~spin)♕`;
		} else{statusBarItem.text = `♙`;}
			
		statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		statusBarItem.command = "chester.refresh";
		statusBarItem.show();
	}

	if (status === "play"){

		if (vscode.workspace.getConfiguration('chester').get("monochrome")){
			statusBarItem.text = `♔$(play-circle~spin)♕`;
			statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
		}else{
			statusBarItem.text = `♙`;	
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
			statusBarItem.text = `♙`;
			statusBarItem.color = "#ff9994"; 
		}
		statusBarItem.command = "chester.error_info";
		statusBarItem.show();
	}
}

export function deactivate() {}
