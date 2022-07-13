"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const DEFAULT_USERNAME = "anon";
const DEFAULT_ADDR = "localhost:8080";
function activate(context) {
    console.log('Congratulations, your extension "vstalk" is now active!');
    var searchStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function startChat(ip, username) {
        searchStatus.show();
        vscode.window.showInformationMessage("Connecting to " + ip + " as " + username + "...");
        searchStatus.text = "🌐 Connecting to server...";
        vscode.window.showInformationMessage("Connected to server ! Searching for someone to chat with...");
        searchStatus.text = "🔎 Searching for someone...";
        vscode.window.showInformationMessage("User found !");
        searchStatus.text = "🗨️ Talking with anon";
        const panel = vscode.window.createWebviewPanel("chat", "VSTalk", vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
        panel.webview.onDidReceiveMessage((m) => {
            //When the user sends a message
            //panel.webview.postMessage("Message recu !");
        });
        panel.onDidDispose(() => {
            searchStatus.hide();
        });
        const pathToHtml = vscode.Uri.file(path.join(context.extensionPath, 'media', 'view.html'));
        const pathUri = pathToHtml.with({ scheme: 'vscode-resource' });
        panel.webview.html = fs.readFileSync(pathUri.fsPath, 'utf8')
            .replaceAll("[USERNAME]", username)
            .replaceAll("[REMOTE_USERNAME]", "RemoteUsername");
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
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map