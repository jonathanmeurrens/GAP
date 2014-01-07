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

var OptionsScreen = (function(){

    var self;

    function OptionsScreen(){

        // EVENT TYPES
        OptionsScreen.SAVE = "SAVE";
        OptionsScreen.CANCEL = "CANCEL";

        self = this;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(200,200,200));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        this.view.addChild(colorPanel);
    }

    return OptionsScreen;
})();