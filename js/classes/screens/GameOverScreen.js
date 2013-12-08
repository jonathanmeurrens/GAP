/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

var GameOverScreen = (function(){

    var self;

    function GameOverScreen(){

        self = this;
        this.width = 500;
        this.height = 400;

        // EVENT TYPES
        GameOverScreen.RESTART_LEVEL = "RESTART_LEVEL";

        this.screenType = ScreenManager.GAME_OVER;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(255,0,0));
        colorPanel.graphics.drawRect(this.width/2, this.height/2 - 100, this.width , this.height);
        colorPanel.mouseEnabled = true;

        this.view.addChild(colorPanel);

        colorPanel.addEventListener("click", restartHandler);
    }

    function restartHandler(e){
        var event = new createjs.Event(GameOverScreen.RESTART_LEVEL, true);
        self.view.dispatchEvent(event);
    }

    return GameOverScreen;
})();