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
            console.log("[ScreenManager] show game over!");
            this.screen.view.on(GameOverScreen.RESTART_LEVEL, function(e){
                console.log("[ScreenManager] RESTART LEVEL");
                    self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.on(StartScreen.START, function(e){
                console.log("[ScreenManager] START");
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
        animateScreenIn();
    };

    ScreenManager.prototype.showLevelsScreen = function(gameData){
        this.screen = new LevelsScreen(gameData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(LevelNest.LEVEL_SELECTED, function(e){
            self.removeScreen();
        });
        animateScreenIn();
    };

    ScreenManager.prototype.showInstructionsScreen = function(instructionsData){
        this.screen = new InstructionsScreen(instructionsData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.removeScreen();
        });
        animateScreenIn();
    };

    ScreenManager.prototype.showNextLevelScreen = function(level, stars){
        this.screen = new NextLevelScreen(level, stars);
        this.view.addChild(this.screen.view);
        this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
            self.removeScreen();

        });
        this.screen.view.on(NextLevelScreen.PLAY_AGAIN, function(e){
            self.removeScreen();
        });
        animateScreenIn();
    };

    ScreenManager.prototype.removeScreen = function(){
        if(self.screen != null){
            self.view.removeChild(self.screen.view);
            self.screen = null;
        }
    };

    function animateScreenIn(){
        //self.screen.view.alpha = 0;
        //createjs.Tween.get(self.screen.view).to({scaleX:1, scaleY:1, alpha:1},900, createjs.Ease.cubicInOut);
    }

    return ScreenManager;
})();
