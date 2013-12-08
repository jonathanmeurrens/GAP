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
        StartScreen.START = "START";

        this.screenType = ScreenManager.START;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(255,255,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        this.view.addChild(colorPanel);

        this.progressEgg = new createjs.Bitmap('img/egg.png');
        this.progressEgg.regX = 41/2;
        this.progressEgg.regY = 56/2;
        this.progressEgg.x = stage.canvas.width/2;
        this.progressEgg.y = stage.canvas.height/2;
        this.view.addChild(this.progressEgg);

        var assetsPath = "img/";

        var manifest = [
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
        preload.loadManifest(manifest, true, assetsPath);

        // Use this instead to use tag loading
        //preload = new createjs.PreloadJS(false);

        colorPanel.addEventListener("click", startHandler);
    }

    // -------- START CLICKED

    function startHandler(e){
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    };

     // ------- PRELOADING

    function handleProgress(event) {
        //bar.scaleX = event.loaded * loaderWidth;
        console.log(event.loaded);
        self.progressEgg.rotation = event.loaded * 180;
    };

    function handleFileLoad(event) {
        //console.log(event);
    };

    function handleComplete(event) {
        console.log("preloading complete!");
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    };

    function handleError(event){
        console.log("[StartScreen] error preload!"+event);
    }

    return StartScreen
})();