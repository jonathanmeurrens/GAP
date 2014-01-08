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
/* globals OptionsScreen:true  */

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
                    self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.on(StartScreen.START, function(e){
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
    };

    ScreenManager.prototype.showOptionsScreen = function(gamerData){
        self.removeScreen();
        this.screen = new OptionsScreen(gamerData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(OptionsScreen.CANCEL, function(e){
            self.removeScreen();
            self.showScreen(ScreenManager.START);
        });
        /*this.screen.view.on(OptionsScreen.SAVE, function(e){
            self.removeScreen();
        });*/
    };

    ScreenManager.prototype.showLevelsScreen = function(){
        this.screen = new LevelsScreen();
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

    ScreenManager.prototype.showNextLevelScreen = function(level, stars){
        this.screen = new NextLevelScreen(level, stars);
        this.view.addChild(this.screen.view);
        this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
            self.removeScreen();

        });
        this.screen.view.on(NextLevelScreen.PLAY_AGAIN, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.removeScreen = function(){
        if(self.screen != null){
            self.view.removeChild(self.screen.view);
            self.screen = null;
        }
    };

    return ScreenManager;
})();
