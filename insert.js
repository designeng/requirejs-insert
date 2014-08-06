define(['text'], function(text){

    var CACHE_BUST_QUERY_PARAM = 'bust',
        CACHE_BUST_FLAG = '!bust',
        jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')? JSON.parse : function(val){
            return eval('('+ val +')'); //quick and dirty
        },
        buildMap = {};

    function cacheBust(url){
        url = url.replace(CACHE_BUST_FLAG, '');
        url += (url.indexOf('?') < 0)? '?' : '&';
        return url + CACHE_BUST_QUERY_PARAM +'='+ Math.round(2147483647 * Math.random());
    }

    //API
    return {

        load : function(name, req, onLoad, config) {
            if ( config.isBuild ) {
                //avoid inlining cache busted JSON or if inlineJSON:false
                //and don't inline files marked as empty!
                onLoad(null);
            } else {
                text.get(req.toUrl(name), function(data){
                    if (config.isBuild) {
                        buildMap[name] = data;
                        onLoad(data);
                    } else {
                        onLoad(data);
                    }
                }
                );
            }
        },

        // normalize : function (name, normalize) {
        //     // used normalize to avoid caching references to a "cache busted" request
        //     if (name.indexOf(CACHE_BUST_FLAG) !== -1) {
        //         name = cacheBust(name);
        //     }
        //     // resolve any relative paths
        //     return normalize(name);
        // },

        //write method based on RequireJS official text plugin by James Burke
        //https://github.com/jrburke/requirejs/blob/master/text.js
        write : function(pluginName, moduleName, write){
            console.log ("WRITE START")
            if(moduleName in buildMap){
                var content = buildMap[moduleName];
                write('define("'+ pluginName +'!!!!!'+ moduleName +'", function(){ return '+ content +';});\n');
            }
        }

    };
});