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

        var postOnFb = new createjs.Bitmap('img/post-on-fb-btn.png');
        postOnFb.x = stage.canvas.width/2 - Math.round(57/2);
        postOnFb.y = stage.canvas.height/2 - Math.round(18/2);
        postOnFb.addEventListener("click", postOnFbHandler);
        this.view.addChild(postOnFb);

        // TEMP
        $("body").on("keydown", function(e){
            if(e.which == 13){
                nextLevelHandler(e);
            }
        });
    }

    function nextLevelHandler(e){
        var event = new createjs.Event(NextLevelScreen.NEXT_LEVEL, true);
        self.view.dispatchEvent(event);
    }

    function postOnFbHandler(e){
        console.log("[NextLevelScreen] post on fb");
        publishScoreToFB(1,3);
    }

    return NextLevelScreen
})();