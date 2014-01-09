/* globals stage:true  */
/* globals createjs:true  */
/* globals StartScreen:true  */
/* globals GameOverScreen:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals LevelsScreen:true  */
/* globals LevelNest:true  */
/* globals OptionsScreen:true  */
/* globals PauseScreen:true  */
/* globals EndScreen:true  */

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
        ScreenManager.PAUSE = "PAUSE";
        ScreenManager.END = "END";
    }

    ScreenManager.prototype.showScreen = function(screenType){

        if(this.screen != null){
            return;
        }

        if(screenType === ScreenManager.GAME_OVER){
            this.screen = new GameOverScreen();
            this.screen.view.addEventListener(GameOverScreen.RESTART_LEVEL, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.addEventListener(StartScreen.START, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.PAUSE){
            this.screen = new PauseScreen();
            this.screen.view.addEventListener(PauseScreen.RESUME, function(e){
                self.removeScreen();
            });
            this.screen.view.addEventListener(PauseScreen.PLAY_AGAIN, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.END){
            this.screen = new EndScreen();
            this.screen.view.addEventListener(EndScreen.PLAY_AGAIN, function(e){
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
    };

    ScreenManager.prototype.showOptionsScreen = function(gamerData){
        self.removeScreen();
        this.screen = new OptionsScreen(gamerData);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(OptionsScreen.CANCEL, function(e){
            self.removeScreen();
            self.showScreen(ScreenManager.START);
        });
    };

    ScreenManager.prototype.showLevelsScreen = function(fromPause){
        //if(fromPause){
            self.removeScreen();
        //}
        this.screen = new LevelsScreen(fromPause);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(LevelNest.LEVEL_SELECTED, function(){
            self.removeScreen();
        });
        this.screen.view.addEventListener(LevelsScreen.BACK, function(){
            self.removeScreen();
            self.showScreen(ScreenManager.START);
            //self.showScreen(ScreenManager.PAUSE);
        });

    };

    ScreenManager.prototype.showInstructionsScreen = function(instructionsData){
        this.screen = new InstructionsScreen(instructionsData);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showNextLevelScreen = function(level, stars){
        this.screen = new NextLevelScreen(level, stars);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(NextLevelScreen.NEXT_LEVEL, function(e){
            self.removeScreen();

        });
        this.screen.view.addEventListener(NextLevelScreen.PLAY_AGAIN, function(e){
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
