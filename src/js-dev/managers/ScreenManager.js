/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:48
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals StartScreen:true  */
/* globals GameOverScreen:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals LevelsScreen:true  */
/* globals LevelNest:true  */

var ScreenManager = (function(){

    var self;

    function ScreenManager(){

        self = this;

        this.view = new createjs.Container();
        this.screen = null;

        ScreenManager.GAME_OVER = "GAME_OVER";
        ScreenManager.INSTRUCTIONS = "INSTRUCTIONS";
        ScreenManager.NEXT_LEVEL = "NEXT_LEVEL";
        ScreenManager.LEVELS = "LEVELS";
        ScreenManager.START = "START";
    }

    ScreenManager.prototype.showScreen = function(screenType){

        if(this.screen != null){
            return;
        }

        if(screenType === ScreenManager.GAME_OVER){
            this.screen = new GameOverScreen();
            this.screen.view.on(GameOverScreen.RESTART_LEVEL, function(e){
                console.log("[ScreenManager] RESTART LEVEL");
                    self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        /*else if(screenType == ScreenManager.NEXT_LEVEL){
            this.screen = new NextLevelScreen();
            this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
                console.log("[ScreenManager] NEXT LEVEL");
                self.removeScreen();
            });
        }*/
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.on(StartScreen.START, function(e){
                console.log("[ScreenManager] START");
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
        console.log("[ScreenManager] added screen "+screenType);
    };

    ScreenManager.prototype.showLevelsScreen = function(gameData){
        this.screen = new LevelsScreen(gameData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(LevelNest.LEVEL_SELECTED, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showInstructionsScreen = function(instructionsData){
        this.screen = new InstructionsScreen(instructionsData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showNextLevelScreen = function(){
        this.screen = new NextLevelScreen();
        this.view.addChild(this.screen.view);
        this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
            console.log("[ScreenManager] NEXT LEVEL");
            self.removeScreen();
        });
    };

    ScreenManager.prototype.removeScreen = function(){
        if(this.screen != null){
            this.view.removeChild(this.screen.view);
            this.screen = null;
        }
    };

    return ScreenManager;
})();
