// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import path = require('path');
import { PerformanceNodeTiming } from 'perf_hooks';

const DEFAULT_USERNAME = "anon";
const DEFAULT_ADDR = "localhost:8080";







export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "vstalk" is now active!');

	var searchStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}


	async function startChat(ip: string, username: string) {
		searchStatus.show();
		vscode.window.showInformationMessage("Connecting to " + ip + " as " + username + "...");
		searchStatus.text = "🌐 Connecting to server...";

		vscode.window.showInformationMessage("Connected to server ! Searching for someone to chat with...");
		searchStatus.text = "🔎 Searching for someone...";


		vscode.window.showInformationMessage("User found !");
		searchStatus.text = "🗨️ Talking with anon";

		const panel = vscode.window.createWebviewPanel(
			"chat",
			"VSTalk",
			vscode.ViewColumn.One,
			{enableScripts: true,retainContextWhenHidden: true},
		);

		panel.webview.onDidReceiveMessage((m)=>{

			//When the user sends a message
			panel.webview.postMessage("Message recu !");
		});

		panel.onDidDispose(() => {
			searchStatus.hide();
		});

		const pathToHtml = vscode.Uri.file(
			path.join(context.extensionPath, 'media', 'view.html')
		);

		const pathUri = pathToHtml.with({ scheme: 'vscode-resource' });

		panel.webview.html = fs.readFileSync(pathUri.fsPath, 'utf8')
		.replaceAll("[USERNAME]",username)
		.replaceAll("[REMOTE_USERNAME]","RemoteUsername");



	}


	let disposable = vscode.commands.registerCommand("vstalk.start", async () => {

		var ip = await vscode.window.showInputBox({
			placeHolder: "Leave blank for default server",
			prompt: "Please enter the address of the server you would like to connect to",
		});

		if (ip !== undefined) {

			if (ip === "") {
				ip = DEFAULT_ADDR;
			}

			var username = await vscode.window.showInputBox({
				placeHolder: "Default : anon",
				prompt: "Please enter your username for this session",
			});

			if (username !== undefined) {

				if (username === "") {
					username = DEFAULT_USERNAME;
				}

				startChat(ip, username);
			}


		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(searchStatus);
}

// this method is called when your extension is deactivated
export function deactivate() { }
