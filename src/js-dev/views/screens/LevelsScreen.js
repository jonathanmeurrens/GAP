/* globals gameData:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals LevelNest:true  */
/* globals preload:true  */

var LevelsScreen = (function(){

    var self;

    function LevelsScreen(){

        self = this;

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult('assets/common/bg.png'));
        this.view.addChild(background);

        $("body").on("keydown",function(e){
            if(e.which === 49){ //1
                levelSelected(0);
            }
            else if(e.which === 50){ //2
                levelSelected(1);
            }
            else if(e.which === 222){ //3
                levelSelected(2);
            }
            else if(e.which === 53){ //4
                levelSelected(3);
            }
            else if(e.which === 54){ //5
                levelSelected(4);
            }
            else if(e.which === 54){ //5
                levelSelected(4);
            }
            else if(e.which === 55){ //5
                levelSelected(5);
            }
            else if(e.which === 56){ //5
                levelSelected(6);
            }
            else if(e.which === 57){ //5
                levelSelected(7);
            }
            else if(e.which === 58){ //5
                levelSelected(8);
            }
            else if(e.which === 59){ //5
                levelSelected(9);
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
        var levelsContainer = new createjs.Container();
        self.view.addChild(levelsContainer);

        var yPos = 0;
        var xPos = 0;
        for(var i=0; i < gameData.getLevelCount(); i++){
            var locked = true;
            if(i <= gameData.gamerData.levels.length)
            {
                locked = false;
            }
            var nest = new LevelNest(i,gameData.gamerData.levels[i],!locked);
            nest.view.x = xPos;
            nest.view.y = yPos;
            xPos += 140;
            if(i%3 >= 2){
                yPos+=110;
                xPos = 0;
            }
            levelsContainer.addChild(nest.view);
        }
        levelsContainer.x = 314;
        levelsContainer.y = 130;
    }

    return LevelsScreen;

})();