/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 21:39
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals publishScoreToFB:true  */

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

        var assetsPath = "img/";

        var manifest = [];

        /*var manifest = [
            {src:"egg-spritesheet.png", id:"egg-spritesheet"},
            {src:"cloud.png", id:"cloud"},
            {src:"grass.png", id:"grass"},
            {src:"leaf.png", id:"leaf"},
            {src:"nest.png", id:"nest"},
            {src:"rock.png", id:"rock"},
            {src:"stars-spritesheet.png", id:"stars-spritesheet"},
            {src:"bounce.mp3", id:"bounce_sound"},
            {src:"music.mp3|music.ogg", id:"music"},
            {src:"gameover.mp3|gameover.ogg", id:"gameover_sound"},
            {src:"success.mp3|success.ogg", id:"success_sound"}
        ];

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", handleComplete);
        preload.addEventListener("fileload", handleFileLoad);
        preload.addEventListener("error", handleError);
        preload.loadManifest(manifest, true, assetsPath);*/

        // TEMP
        $("body").on("keydown", function(e){
            if(e.which === 13){
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

    return NextLevelScreen;
})();