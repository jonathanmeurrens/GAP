/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */
/* globals Button:true  */
/* globals gameData:true  */
/* globals SoundManager:true  */

var OptionsScreen = (function(){

    var self;

    function OptionsScreen(){

        // EVENT TYPES
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
            frames: {width:449/2, height:43},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.x = 614;
        this.muteBtnSprite.y = 286;
        this.muteBtnSprite.regX = 184/2;
        this.muteBtnSprite.regY = 54/2;
        this.muteBtnSprite.scaleX = 0.7;
        this.muteBtnSprite.scaleY = 0.7;
        this.muteBtnSprite.cursor = 'pointer';
        this.muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isMusicOn = !gameData.gamerData.isMusicOn;
            SoundManager.isMusicOn = gameData.gamerData.isMusicOn;
            if(gameData.gamerData.isMusicOn){
                SoundManager.startMusic();
            }else{
                SoundManager.stopMusic();
            }
            gameData.storeSettings();
            updateButtonsStates();
        });
        createjs.Tween.get(this.muteBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.muteBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.muteBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });


        // FX MUTE
        var fx_mute_data = {
            images: ["assets/common/buttons/soundfx_spritesheet.png"],
            frames: {width:449/2, height:43},
            animations: {on:[0], mute:[1]}
        };
        var fx_muteBtnspritesheet = new createjs.SpriteSheet(fx_mute_data);
        this.fx_muteBtnSprite = new createjs.Sprite(fx_muteBtnspritesheet);
        this.view.addChild(this.fx_muteBtnSprite);
        this.fx_muteBtnSprite.x = 650;
        this.fx_muteBtnSprite.y = 354;
        this.fx_muteBtnSprite.regX = 202/2;
        this.fx_muteBtnSprite.regY = 54/2;
        this.fx_muteBtnSprite.scaleX = 0.7;
        this.fx_muteBtnSprite.scaleY = 0.7;
        this.fx_muteBtnSprite.cursor = 'pointer';
        this.fx_muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isFxOn = !gameData.gamerData.isFxOn;
            SoundManager.isFxOn = gameData.gamerData.isFxOn;
            if(SoundManager.isFxOn){
                SoundManager.playSuccess();
            }
            gameData.storeSettings();
            updateButtonsStates();
        });
        createjs.Tween.get(this.fx_muteBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.fx_muteBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.fx_muteBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        // FX MUTE
        var reset_data = {
            images: ["assets/common/buttons/reset_levels.png"],
            frames: {width:324/2, height:48},
            animations: {default:[0], done:[1]}
        };
        var resetBtnspritesheet = new createjs.SpriteSheet(reset_data);
        this.resetBtnSprite = new createjs.Sprite(resetBtnspritesheet);
        this.view.addChild(this.resetBtnSprite);
        this.resetBtnSprite.regX = 160/2;
        this.resetBtnSprite.regY = 24/2;
        this.resetBtnSprite.scaleX = 0.7;
        this.resetBtnSprite.scaleY = 0.7;
        this.resetBtnSprite.x = 648;
        this.resetBtnSprite.y = 415;
        this.resetBtnSprite.cursor = 'pointer';
        this.resetBtnSprite.addEventListener("click", function(e){
            gameData.resetStorage();
            self.resetBtnSprite.gotoAndStop("done");
        });
        createjs.Tween.get(this.resetBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.resetBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.resetBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });



        // BACK BTN
        var backBtn = new Button(Button.BACK);
        this.view.addChild(backBtn.view);
        backBtn.view.x = 530;
        backBtn.view.y = 235;
        backBtn.view.addEventListener("click", function(){
            var event = new createjs.Event(OptionsScreen.CANCEL, true);
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