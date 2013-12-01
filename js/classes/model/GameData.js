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

        this.gamerData = this.getStoredGamerData();
        if(this.gamerData == null){
            this.gamerData = new UserData();
        }
        console.log(this.gamerData);
    }

    GameData.prototype.parse = function(){
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

    GameData.prototype.getLevelCount = function(){
        return self.levelsData.getElementsByTagName("levels")[0].childElementCount;
    }

    GameData.prototype.getLevel = function(i){
        return self.levelsData.getElementsByTagName("levels")[0].getElementsByTagName("level")[i];
    }

    GameData.prototype.getEggDataForLevel = function(i){
        return this.getLevel(i).getElementsByTagName("egg")[0];
    }

    GameData.prototype.getStoredGamerData = function(){
        var data = localStorage.getItem("tjilp_game");
        if(data != "undefined"){
            return JSON.parse(data);
        }
        return null;
    }

    GameData.prototype.storeGamerData = function(level, stars){
        if(this.gamerData.levels[level] == null || this.gamerData.levels[level] < stars){ // level nog niet gespeeld of aantal sterren hoger dan vorige keer
            self.gamerData.levels[level] = stars;
            console.log(self.gamerData);
            localStorage.setItem("tjilp_game",JSON.stringify(self.gamerData));
        }
    }

    return GameData;

})();