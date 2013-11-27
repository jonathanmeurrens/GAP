/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 21:39
 * To change this template use File | Settings | File Templates.
 */

var NextLevelScreen = (function(){

    var self;

    function NextLevelScreen(){

        self = this;

        // EVENT TYPES
        NextLevelScreen.NEXT_LEVEL = "NEXT_LEVEL";

        this.screenType = ScreenManager.NEXT_LEVEL;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,255,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);

        this.view.addChild(colorPanel);
        colorPanel.addEventListener("click", nextLevelHandler);
    }

    function nextLevelHandler(e){
        var event = new createjs.Event(NextLevelScreen.NEXT_LEVEL, true);
        self.view.dispatchEvent(event);
    }

    return NextLevelScreen
})();