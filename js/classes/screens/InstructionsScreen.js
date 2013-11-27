/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:32
 * To change this template use File | Settings | File Templates.
 */

var InstructionsScreen = (function(){

    function InstructionsScreen(){

        this.screenType = ScreenManager.INSTRUCTIONS;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,255,0));
        colorPanel.graphics.drawRect(0,0,200,200);

        this.view.addChild(colorPanel);
    }

    return InstructionsScreen;
})();