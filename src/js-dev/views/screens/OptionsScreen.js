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
/* globals gameData:true  */

var OptionsScreen = (function(){

    var self;

    function OptionsScreen(){

        // EVENT TYPES
        OptionsScreen.SAVE = "SAVE";
        OptionsScreen.CANCEL = "CANCEL";

        self = this;

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("assets/common/startpage/bg.png"));
        this.view.addChild(background);

        var boom = new createjs.Bitmap(preload.getResult("assets/common/startpage/boom.png"));
        boom.y = stage.canvas.height - 539;
        this.view.addChild(boom);

        var tjilp = new createjs.Bitmap(preload.getResult("assets/common/startpage/tjilp.png"));
        tjilp.y = 50;
        tjilp.x = 400;
        this.view.addChild(tjilp);

        var bosjes = new createjs.Bitmap(preload.getResult("assets/common/startpage/bosjes_onderaan.png"));
        bosjes.y = stage.canvas.height - 88;
        this.view.addChild(bosjes);


        // MUSIC MUTE
        var mute_data = {
            images: ["assets/common/buttons/music_spritesheet.png"],
            frames: {width:184, height:53},
            animations: {on:[1], mute:[0]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.x = 535;
        this.muteBtnSprite.y = 250;
        this.muteBtnSprite.cursor = 'pointer';
        this.muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isMusicOn = !gameData.gamerData.isMusicOn;
            updateButtonsStates();
            var event = new createjs.Event(OptionsScreen.SAVE, true);
            self.view.dispatchEvent(event);
        });


        // FX MUTE
        var fx_mute_data = {
            images: ["assets/common/buttons/soundfx_spritesheet.png"],
            frames: {width:202, height:54},
            animations: {on:[1], mute:[0]}
        };
        var fx_muteBtnspritesheet = new createjs.SpriteSheet(fx_mute_data);
        this.fx_muteBtnSprite = new createjs.Sprite(fx_muteBtnspritesheet);
        this.view.addChild(this.fx_muteBtnSprite);
        this.fx_muteBtnSprite.x = 525;
        this.fx_muteBtnSprite.y = 320;
        this.fx_muteBtnSprite.cursor = 'pointer';
        this.fx_muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isFxOn = !gameData.gamerData.isFxOn;
            updateButtonsStates();
            var event = new createjs.Event(OptionsScreen.SAVE, true);
            self.view.dispatchEvent(event);
        });


        // RESET BTN
        var resetBtn = new Button(Button.RESET_LEVELS);
        this.view.addChild(resetBtn.view);
        resetBtn.view.x = 714;
        resetBtn.view.y = 446;
        resetBtn.view.addEventListener("click", function(){
            var event = new createjs.Event(OptionsScreen.RESET_LEVELS, true);
            self.view.dispatchEvent(event);
        });

        updateButtonsStates();
    }

    function updateButtonsStates(){
        if(gameData.gamerData.isMusicOn){
            self.muteBtnSprite.gotoAndStop("on");
        }else{
            self.muteBtnSprite.gotoAndStop("mute");
        }

        if(gameData.gamerData.isFxOn){
            self.fx_muteBtnSprite.gotoAndStop("on");
        }else{
            self.fx_muteBtnSprite.gotoAndStop("mute");
        }
    }

    return OptionsScreen;
})();