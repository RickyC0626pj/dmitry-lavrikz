module.exports = function(dest, options){     
    try{
        var root = __dirname;
        var fs = require('fs');
        
        var jsonSettings = fs.readFileSync(root + '/defaults/settings.json');
        var defaults = JSON.parse(jsonSettings);
        
        if(typeof options !== "object"){
            options = defaults;
        }
        else{
            for(var key in defaults){
                if(options[key] === undefined){
                    options[key] = defaults[key];
                }
            }
        }

        var patterns = {};
        patterns.mixin = fs.readFileSync(root + '/system/patterns/minix');
        patterns.clearfix = fs.readFileSync(root + '/system/patterns/clearfix');
        patterns.reset = fs.readFileSync(root + '/system/patterns/reset');
        patterns.debug = fs.readFileSync(root + '/system/patterns/debug');
    
        var build = require('./build.js');
        var res = build(options, patterns);

        if(dest === undefined){
            console.log('It`s test mode, because you don`t set destination folder');
        }
        else{
            var buildFile = dest + '/' + options.filename + '.' + res.type;
            fs.writeFileSync(buildFile, res.grid);
            console.log('Grid placed into ' + buildFile);
        }

        console.log('Grid length is ' + res.grid.length + ' :)');
        console.log("Its work! Good day!");
    }
    catch(err){
        console.log("Oops -> " + err);
    }
}