/* globals UserData:true  */

var GameData = (function(){

    var self;

    function GameData(xmlPath){
        self = this;
        this.xmlPath = xmlPath;

        this.pauseGame = false;

        this.gamerData = this.getStoredGamerData();
        console.log(this.gamerData);
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
    };

    GameData.prototype.getLevelCount = function(){
        return self.levelsData.getElementsByTagName("levels")[0].childElementCount;
    };

    GameData.prototype.getLevel = function(i){
        return self.levelsData.getElementsByTagName("levels")[0].getElementsByTagName("level")[i];
    };

    GameData.prototype.getEggDataForLevel = function(i){
        return this.getLevel(i).getElementsByTagName("egg")[0];
    };

    GameData.prototype.getLevelInstructionsForLevel = function(i){
        return this.getLevel(i).getElementsByTagName("instruction");
    };

    GameData.prototype.getManifestForLevel = function(i){
        var manifest = [];
        $(this.getLevel(i)).find("*").each(function(i, obj){
            if($(obj).attr("img")!=null){
                manifest.push({src:$(obj).attr("img")});
            }
        });
        return manifest;
    };

    GameData.prototype.getStoredGamerData = function(){
        var data = localStorage.getItem("tjilp_game");
        if(data !== "undefined"){
            return JSON.parse(data);
        }
        return null;
    };

    GameData.prototype.didUserGetInstructionForLevel = function(i){
        if(!self.gamerData.givenInstructions){
            return false;
        }
        if(self.gamerData.givenInstructions[i]){
            return true;
        }
        return false;
    };

    GameData.prototype.storeGamerLevelData = function(level, stars){
        if(this.gamerData.levels[level] == null || this.gamerData.levels[level] < stars){ // level nog niet gespeeld of aantal sterren hoger dan vorige keer
            self.gamerData.levels[level] = stars;
            save();
        }
    };

    GameData.prototype.storeGamerInstructionGiven = function(level){
        self.gamerData.givenInstructions[level] = true;
        save();
    };

    GameData.prototype.storeSettings = function(){
        save();
    };

    GameData.prototype.resetStorage = function(){
        localStorage.setItem("tjilp_game","");
        localStorage.clear();
    };

    function save(){
        localStorage.setItem("tjilp_game",JSON.stringify(self.gamerData));
    }

    return GameData;

})();