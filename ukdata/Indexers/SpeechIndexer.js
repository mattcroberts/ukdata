var lucifer = require("../Lucifer.js");
var log = require("../Logger.js");

var DEBATES_PATH = "C:/Users/matt/ukdata/rsync/debates/";

function SpeechIndexer(){

}

SpeechIndexer.prototype = {
    init: function(Indexer) {
        this.Indexer = Indexer;

        this.Indexer.extractContentFromDir(DEBATES_PATH, 100, function interval(err, speeches) {
            if (err) {
                log.error("indexer", err);
            }
            log.debug("speeches!", speeches.length);
            lucifer.addSpeeches(speeches);
        }, function complete() {
            log.info("SpeechIndexer", "All done!");
        });
    },

    parser: function(node, add) {

        if (node.name == "publicwhip") {

            var speeches = node.children.filter(function(node) {
                return node.name == "speech" && node.attribs.speakerid;
            });

            speeches.forEach(function(speechNode) {
                debugger;
                var iSpeech = {};
                iSpeech.id = speechNode.attribs.id;
                iSpeech.speakerId = speechNode.attribs.speakerid;
                if ( !! speechNode.children && speechNode.children.length > 0) {
                    iSpeech.content = flatternText(speechNode.children[0]);
                }

                add(iSpeech);
            });

        }
    },

    worker: function(filepath, jobComplete, add) {

        if (filepath.indexOf(".xml") > 1) {

            this.Indexer.parseHtml(DEBATES_PATH + filepath, function(err, result) {
                if (err) {
                    log.error("indexer", err);
                }

                log.debug("indexer", "found " + result.length + " speeches in " + filepath);
                add(result);
                jobComplete();
            });
        } else {
            jobComplete(false);
        }


    }
}

var flatternText = function(root) {
        var result = "";
        if (!root.children) return result;

        root.children.forEach(function(child) {
            switch (child.type) {
            case "text":
                result += child.data;
                return;
            case "tag":
                result += "<" + child.name + ">" + flatternText(child) + "</" + child.name + ">";
                return;
            }
        });

        return result;
    }

module.exports = SpeechIndexer;