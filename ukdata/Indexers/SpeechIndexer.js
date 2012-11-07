var lucifer = require("../Lucifer.js");
var log = require("../Logger.js");

var DEBATES_PATH = "C:/Users/matt/ukdata/rsync/debates/";

function SpeechIndexer(){

}

SpeechIndexer.prototype = {
    init: function(Indexer) {
        log.profile("Index all speeches");
        this.Indexer = Indexer;

        this.Indexer.extractContentFromDir(DEBATES_PATH, 100, function interval(err, speeches) {
            if (err) {
                log.error("indexer", err);
            }
            log.debug("speeches!", speeches.length);

            var speechDocs = [];

            speeches.forEach(function(speech){
                var id = speech.id.substring(speech.id.lastIndexOf("/") + 1);
                var minorGroup = id.substring(0,id.lastIndexOf("."));
                var speechGroup = id.substring(0, minorGroup.lastIndexOf("."));
                var doc = {
                    id: speech.id,
                    group_s: speechGroup,
                    ukdType: "speech",
                    memberId: speech.speakerId,
                    content_t: speech.content
                };

                speechDocs.push(doc);
            });

            lucifer.addDocs(speechDocs);

        }, function complete() {
            log.profile("Index all speeches");
            log.info("SpeechIndexer", "All done!");
        });
    },

    parser: function(node, add) {

        if (node.name == "publicwhip") {
            
            var speeches = node.children.filter(function(node) {
                return node.name == "speech" && node.attribs.speakerid;
            });

            speeches.forEach(function(speechNode) {
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