/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 21:39
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals publishScoreToFB:true  */
/* globals Button:true  */
/* globals LevelNest:true  */
/* globals preload:true  */

var NextLevelScreen = (function(){

    var self;

    function NextLevelScreen(level, stars){

        self = this;

        // EVENT TYPES
        NextLevelScreen.NEXT_LEVEL = "NEXT_LEVEL";
        NextLevelScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.screenType = ScreenManager.NEXT_LEVEL;
        this.stars = stars;
        this.level = level;
        this.width = 351;
        this.height = 233;
        this.view = new createjs.Container();

        this.container = new createjs.Container();
        this.container.regX = this.width/2;
        this.container.regY = this.height/2;
        this.container.x = stage.canvas.width/2;
        this.container.y = stage.canvas.height/2 - 35;

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        this.view.addChild(this.container);
        var background = new createjs.Bitmap(preload.getResult("success-background"));
        this.container.addChild(background);

        // FACEBOOK
        var facebookBtn = new Button(Button.FACEBOOK);
        facebookBtn.view.x = 260;
        facebookBtn.view.y = 50;
        facebookBtn.view.y = facebookBtn.view.y;
        this.container.addChild(facebookBtn.view);
        facebookBtn.view.on("click", postOnFbHandler);


        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 143;
        playAgainBtn.view.y = this.height + 24;
        this.container.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(NextLevelScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });

        // NEXT LEVEL
        var nextLevelBtn = new Button(Button.NEXT_LEVEL);
        nextLevelBtn.view.x = 265;
        nextLevelBtn.view.y = playAgainBtn.view.y + 10;
        this.container.addChild(nextLevelBtn.view);
        nextLevelBtn.view.on("click", function(){
            var event = new createjs.Event(NextLevelScreen.NEXT_LEVEL, true);
            self.view.dispatchEvent(event);
        });


        // STARS
        var levelNest = new LevelNest(0, stars, true);
        this.container.addChild(levelNest.view);
        levelNest.view.x = 125;
        levelNest.view.y = 20;

        // TEMP
        /*$("body").on("keydown", function(e){
            if(e.which === 13){
                nextLevelHandler(e);
            }
        });*/
    }

    function postOnFbHandler(e){
        publishScoreToFB(self.level + 1, self.stars);
    }

    return NextLevelScreen;
})();