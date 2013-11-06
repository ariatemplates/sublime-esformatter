#!/usr/bin/env node
var fs = require("fs");
var browserify = require("browserify");

var cli = fs.readFileSync("./command_line.js");

var esformatterDir = "./node_modules/esformatter";

var b = browserify({
	basedir: esformatterDir
});
b.require("./lib/esformatter.js", {
	expose: "formatter"
});
b.bundle(function (err, src) {
	fs.writeFileSync("esformatter.js", "#!/usr/bin/env node\n" + src + cli);
});

var settingsFile = "../EsFormatter.sublime-settings";
var defaultPreset = JSON.parse(fs.readFileSync(esformatterDir + "/lib/preset/default.json"));
// this fails since the settings files contains comments; sublime doesn't care about them, so we'd need a JSON parser and formatter that can keep the comments
// or we remove the comments and line breaks and everything that the JSON formatter breaks
var sublimeSettings = JSON.parse(fs.readFileSync(settingsFile));
sublimeSettings.format_options = defaultPreset;
fs.writeFileSync(settingsFile, JSON.stringify(sublimeSettings, null, "    "));
