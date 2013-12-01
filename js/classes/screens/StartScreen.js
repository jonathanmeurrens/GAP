/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */

var StartScreen = (function(){

    var self;

    function StartScreen(){

        self = this;

        // EVENT TYPES
        StartScreen.START_CLICKED = "START_CLICKED";

        this.screenType = ScreenManager.START;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(255,255,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);

        this.view.addChild(colorPanel);
        colorPanel.addEventListener("click", startHandler);
    }

    function startHandler(e){
        var event = new createjs.Event(StartScreen.START_CLICKED, true);
        self.view.dispatchEvent(event);
    }

    return StartScreen
})();