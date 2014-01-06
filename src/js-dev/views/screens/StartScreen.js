/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */

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

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(200,200,200));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        this.view.addChild(colorPanel);

       /* var background = new createjs.Bitmap(preload.getResult("failed-background"));
        this.view.addChild(background);*/

        var startBtn = new Button(Button.START);
        this.view.addChild(startBtn.view);
        startBtn.view.addEventListener("click", startHandler);
        startBtn.view.x = stage.canvas.width/2;
        startBtn.view.y = stage.canvas.height/2;

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

    return StartScreen;
})();