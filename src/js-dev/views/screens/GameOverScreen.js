/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */
/* globals publishScoreToFB:true  */

var GameOverScreen = (function(){

    var self;

    function GameOverScreen(){

        self = this;

        // EVENT TYPES
        GameOverScreen.MENU = "MENU";
        GameOverScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.width = 352;
        this.height = 234;
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

        var background = new createjs.Bitmap(preload.getResult("failed-background"));
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
            var event = new createjs.Event(GameOverScreen.RESTART_LEVEL, true);
            self.view.dispatchEvent(event);
        });

        $("body").on("keydown", function(e){
            if(e.which === 13){
                var event = new createjs.Event(GameOverScreen.RESTART_LEVEL, true);
                self.view.dispatchEvent(event);
            }
        });
    }

    function postOnFbHandler(e){
        publishScoreToFB(1,3);
    }

    return GameOverScreen;
})();