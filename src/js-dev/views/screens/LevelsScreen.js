/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:00
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals LevelNest:true  */

var LevelsScreen = (function(){

    var self;

    function LevelsScreen(gameData){

        self = this;

        this.gameData = gameData;
        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

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
                levelSelected(4);
            }
            else if(e.which === 56){ //5
                levelSelected(4);
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
        for(var i=0; i < this.gameData.getLevelCount(); i++){
            var nest = new LevelNest(i,this.gameData.gamerData.levels[i],true);
            nest.view.x = xPos;
            nest.view.y = yPos;
            //console.log(i,(i%3));
            xPos += 120;
            if(i%3 >= 2){
                yPos+=100;
                xPos = 0;
            }
            levelsContainer.addChild(nest.view);
        }
        levelsContainer.x = 330;
        levelsContainer.y = 170;
    }

    return LevelsScreen;

})();