/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:00
 * To change this template use File | Settings | File Templates.
 */

var LevelsScreen = (function(){

    var self;

    function LevelsScreen(gameData){

        self = this;

        this.gameData = gameData;
        this.screenType = ScreenManager.LEVELS;
        this.view = new createjs.Container();

        $("body").on("keydown",function(e){
            console.log("[LevelsScreen] keycode: "+e.which);
            if(e.which == 49){ //1
                levelSelected(0);
            }
            else if(e.which == 50){ //2
                levelSelected(1);
            }
            else if(e.which == 222){ //3
                levelSelected(2);
            }
        });

        showLevels();
    }

    function levelSelected(i){
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  i;
        self.view.dispatchEvent(event);
    }

    function showLevels(){
        for(var i=0; i < this.gameData.getLevelCount(); i++){
            var nest = new LevelNest(i,this.gameData.gamerData.levels[i],true);
            nest.view.x = i*130;
            self.view.addChild(nest.view);
        }
    }

    return LevelsScreen;

})();