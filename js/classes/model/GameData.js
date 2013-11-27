/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/11/13
 * Time: 15:23
 * To change this template use File | Settings | File Templates.
 */

var GameData = (function(){

    var self;

    function GameData(xmlPath){
        self = this;
        this.xmlPath = xmlPath;
        //this.data = null;
    }

    GameData.prototype.parse = function(){
        console.log("getting data");
        $.ajax({
            url: this.xmlPath,
            type: "GET",
            dataType: "xml",
            success:function(result){
                self.levelsData = result;
                $(self).trigger("parsed");
            }
        });
    }

    GameData.prototype.getLevel = function(i){
        console.log("[GameData] level "+i+" "+self.levelsData);
        return self.levelsData.getElementsByTagName("levels")[0].getElementsByTagName("level")[i];
    }

    return GameData;

})();