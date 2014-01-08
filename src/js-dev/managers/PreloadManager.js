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

        var background = new createjs.Bitmap('assets/common/preloader/bg.png');
        this.preloaderView.addChild(background);

        this.earth = new createjs.Bitmap('assets/common/preloader/bg2.png');
        this.earth.regX = 592/2;
        this.earth.regY = 592/2;
        this.earth.x = stage.canvas.width/2;
        this.earth.y = stage.canvas.height/2;
        this.preloaderView.addChild(this.earth);

        this.progressEgg = new createjs.Bitmap('assets/common/preloader/eitje.png');
        this.progressEgg.regX = 83/2;
        this.progressEgg.regY = 91/2;
        this.progressEgg.x = stage.canvas.width/2;
        this.progressEgg.y = stage.canvas.height/2;
        this.preloaderView.addChild(this.progressEgg);

        this.removePreloaderTimeout = null;
    }

    PreloadManager.prototype.preloadGame = function(){
        showPreloader();
        self.isPreloadingGame = true;
        var manifest = [
            {src:"assets/common/bg.png"},
            {src:"assets/common/startpage/bg.png"},
            {src:"assets/common/startpage/boom.png"},
            {src:"assets/common/startpage/bosjes_onderaan.png"},
            {src:"assets/common/startpage/tjilp.png"},

            {src:"assets/common/succeed_1.png", id:"success-background"},
            {src:"assets/common/failed.png", id:"failed-background"},
            {src:"assets/common/time-coin.png", id:"time-coin"},
            {src:"assets/common/egg-spritesheet.png"},
            {src:"assets/common/leaf.png", id:"leaf"},
            {src:"assets/common/nest.png", id:"nest"},
            {src:"assets/common/nest-available.png"},
            {src:"assets/common/nest-locked.png"},
            {src:"assets/common/twirl.png", id:"twirl"},
            {src:"assets/common/rock.png", id:"rock"},
            {src:"assets/common/stars-spritesheet.png"},
            {src:"assets/common/press_spacebar.png"},
            {src:"assets/common/progressbar/progress_bar_spritesheet.png"},
            {src:"assets/common/progressbar/levels_spritesheet.png"},
            {src:"assets/common/progressbar/bg.png"},

            {src:"assets/common/buttons/back.png"},
            {src:"assets/common/buttons/facebook.png"},
            {src:"assets/common/buttons/next_level.png"},
            {src:"assets/common/buttons/play_again.png"},
            {src:"assets/common/buttons/pause.png"},
            {src:"assets/common/buttons/levels.png"},
            {src:"assets/common/buttons/mute.png"},
            {src:"assets/common/buttons/options.png"},
            {src:"assets/common/buttons/start_game.png"},
            {src:"assets/common/buttons/reset_levels.png"},
            {src:"assets/common/buttons/music_spritesheet.png"},
            {src:"assets/common/buttons/soundfx_spritesheet.png"},

            {src:"assets/sound/bounce.mp3", id:"bounce_sound"},
            {src:"assets/sound/coin.ogg", id:"coin_sound"},
            {src:"assets/sound/music.ogg", id:"music"},
            {src:"assets/sound/gameover.ogg", id:"gameover_sound"},
            {src:"assets/sound/success.ogg", id:"success_sound"}
        ];
        createjs.Sound.alternateExtensions = ["mp3"];
        preload.loadManifest(manifest, true);
    };

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({rotation:-180}, 6000 + Math.random()*1000).call(function(){
            createjs.Tween.get(this).to({y:this.rotation-180}, 6000).call(function(){
                animate(this);
            });
        });
    }

    PreloadManager.prototype.preloadLevel = function(manifest){
        showPreloader();
        self.isPreloadingGame = false;
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.handleProgress = function(event) {
        //console.log(event.loaded);
        self.progressEgg.rotation = event.loaded * 360;
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
        animate(self.earth);
        stage.addChild(self.preloaderView);
    }

    function removePreloader(){
        createjs.Tween.removeTweens(self.earth);
        stage.removeChild(self.preloaderView);
       /* self.removePreloaderTimeout = setTimeout(function(){

            clearTimeout(self.removePreloaderTimeout);
            self.removePreloaderTimeout = null;
        }, 1000);*/
    }

    return PreloadManager;

})();