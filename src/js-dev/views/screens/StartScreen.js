/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */
/* globals Button:true  */

var StartScreen = (function(){

    var self;

    function StartScreen(){

        self = this;

        // EVENT TYPES
        StartScreen.START = "START";
        StartScreen.OPTIONS = "OPTIONS";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("assets/common/startpage/bg.png"));
        this.view.addChild(background);

        var boom = new createjs.Bitmap(preload.getResult("assets/common/startpage/boom.png"));
        boom.y = stage.canvas.height - 539;
        this.view.addChild(boom);

        var bosjes = new createjs.Bitmap(preload.getResult("assets/common/startpage/bosjes_onderaan.png"));
        bosjes.y = stage.canvas.height - 88;
        this.view.addChild(bosjes);

        var tjilp = new createjs.Bitmap(preload.getResult("assets/common/startpage/tjilp.png"));
        tjilp.y = 50;
        tjilp.x = 400;
        this.view.addChild(tjilp);

        var startGameBtn = new Button(Button.START_GAME);
        this.view.addChild(startGameBtn.view);
        startGameBtn.view.addEventListener("click", startHandler);
        startGameBtn.view.x = 800;
        startGameBtn.view.y = 370;

        var optionsBtn = new Button(Button.OPTIONS);
        this.view.addChild(optionsBtn.view);
        optionsBtn.view.addEventListener("click", optionsHandler);
        optionsBtn.view.x = 710;
        optionsBtn.view.y = 453;


        $("body").on("keydown", function(e){
            if(e.which === 83){
                startHandler(e);
            }
        });
    }

    function startHandler(e){
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    }

    function optionsHandler(e){
        var event = new createjs.Event(StartScreen.OPTIONS, true);
        self.view.dispatchEvent(event);
    }

    return StartScreen;
})();