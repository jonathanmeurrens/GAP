/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */
/* globals publishScoreToFB:true  */

var PauseScreen = (function(){

    var self;

    function PauseScreen(){

        self = this;

        // EVENT TYPES
        PauseScreen.LEVELS = "LEVELS";
        PauseScreen.RESUME = "RESUME";
        PauseScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.width = 370;
        this.height = 211;
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

        var background = new createjs.Bitmap(preload.getResult("paused-background"));
        this.container.addChild(background);


        // RESUME BTN
        var resumeBtn = new Button(Button.RESUME);
        resumeBtn.view.x = 230;
        resumeBtn.view.y = this.height - 20;
        this.container.addChild(resumeBtn.view);
        resumeBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.RESUME, true);
            self.view.dispatchEvent(event);
        });

        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 145;
        playAgainBtn.view.y = this.height - 20;
        this.container.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });

        // MENU BTN
        var menuBtn = new Button(Button.LEVELS);
        menuBtn.view.x = 320;
        menuBtn.view.y = this.height - 20;
        this.container.addChild(menuBtn.view);
        menuBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.LEVELS, true);
            self.view.dispatchEvent(event);
        });

        document.addEventListener("keydown", function(e){
            if(e.which === 13){
                var event = new createjs.Event(PauseScreen.RESUME, true);
                self.view.dispatchEvent(event);
            }
        });
    }

    return PauseScreen;
})();