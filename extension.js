// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const moment = require('moment');
var crc32 = require('./crc32');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hexo-fromt-matter-wxy" is now active, and it only work in text editor mode.');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerTextEditorCommand('hexo-front-matter-wxy.frontmatter', (textEditor, edit) => {
        // The code you place here will be executed every time your command is executed
        console.log('hexo-fromt-matter-wxy TextEditorCommand toggle...');
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        

        let fileName = textEditor.document.fileName;
        let pos = fileName.lastIndexOf(".");
		let apos = fileName.lastIndexOf("\\")
        
        let fileTitle = fileName.substring(pos === -1 ? 0 : (apos+1), pos === -1 ? fileName.length : pos)
        console.log("fileTitle:", fileTitle);
		const abbrlink = `${(crc32.str(fileTitle) >>> 0).toString(32)}`
        const cover = vscode.workspace.getConfiguration().get('hexo-front-matter-wxy.cover');
        
        let result = `---
title: ${fileTitle}
date: ${date}
tags: 
abbrlink: ${abbrlink}
categories: 
${cover}: 
---\n`
        textEditor.edit((editBuilder) => {
            editBuilder.insert(new vscode.Position(0, 0), result);
        });

        // Display a status bar message to the user
        vscode.window.setStatusBarMessage('hexo front matter added for ' + fileName, 4000);
    });
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
        if (vscode.window.activeTextEditor.document.languageId == "markdown")
            if (e.contentChanges[0].text == ">")
                vscode.commands.executeCommand("editor.action.triggerSuggest");
    }));

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
