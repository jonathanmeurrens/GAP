/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 09/12/13
 * Time: 22:44
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */


var PreloadManager = (function(){

    var self;

    function PreloadManager(){
        self = this;

        PreloadManager.LOADING_DONE = "LOADING_DONE";

        this.isPreloadingGame = false;
        this.view = new createjs.Container();

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", self.handleProgress);
        preload.addEventListener("complete", self.handleComplete);
        preload.addEventListener("fileload", self.handleFileLoad);

        this.preloaderView = new createjs.Container();
        this.progressEgg = new createjs.Bitmap('assets/common/leaf.png');
        this.progressEgg.regX = 41/2;
        this.progressEgg.regY = 56/2;
        this.progressEgg.x = stage.canvas.width/2;
        this.progressEgg.y = stage.canvas.height/2;
        self.preloaderView.addChild(this.progressEgg);
    }

    PreloadManager.prototype.preloadGame = function(){
        showPreloader();
        self.isPreloadingGame = true;
        var manifest = [
            {src:"assets/common/succeed_1.png", id:"success-background"},
            {src:"assets/common/failed.png", id:"failed-background"},
            {src:"assets/common/time-coin.png", id:"time-coin"},
            {src:"assets/common/egg-spritesheet.png"},
            {src:"assets/common/leaf.png", id:"leaf"},
            {src:"assets/common/nest.png", id:"nest"},
            {src:"assets/common/rock.png", id:"rock"},
            {src:"assets/common/stars-spritesheet.png"},

            {src:"assets/common/buttons/facebook.png"},
            {src:"assets/common/buttons/next_level.png"},
            {src:"assets/common/buttons/play_again.png"},
            {src:"assets/common/buttons/pause.png"},
            {src:"assets/common/buttons/levels.png"},
            {src:"assets/common/buttons/mute.png"},

            {src:"assets/sound/bounce.mp3", id:"bounce_sound"},
            {src:"assets/sound/coin.mp3|coin.ogg", id:"coin_sound"},
            {src:"assets/sound/music.mp3|music.ogg", id:"music"},
            {src:"assets/sound/gameover.mp3|gameover.ogg", id:"gameover_sound"},
            {src:"assets/sound/success.mp3|success.ogg", id:"success_sound"}
        ];
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.preloadLevel = function(manifest){
        showPreloader();
        self.isPreloadingGame = false;
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.handleProgress = function(event) {
        //console.log(event.loaded);
        self.progressEgg.rotation = event.loaded * 180;
    };

    PreloadManager.prototype.handleFileLoad = function(event) {
        //console.log(event);
    };

    PreloadManager.prototype.handleComplete = function(e) {
        removePreloader();
        var event = new createjs.Event(PreloadManager.LOADING_DONE, true);
        self.view.dispatchEvent(event);
    };

    PreloadManager.prototype.handleError = function(event){
        console.log("[StartScreen] error preload!"+event);
    };

    function showPreloader(){
        stage.addChild(self.preloaderView);
    }

    function removePreloader(){
        stage.removeChild(self.preloaderView);
    }

    return PreloadManager;

})();