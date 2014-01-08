/* globals createjs:true  */
/* globals gameData:true  */

function SoundManager(){}

SoundManager.backgroundMusicInstance = null;
SoundManager.playSounds = false;

SoundManager.toggleSound = function(){

    SoundManager.playSounds = !SoundManager.playSounds;
    if(SoundManager.playSounds){
            // play
            if(SoundManager.backgroundMusicInstance === null){
                SoundManager.backgroundMusicInstance = createjs.Sound.play("music", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
            }
            else{
                SoundManager.backgroundMusicInstance.setMute(false);
            }
    }
    else if(SoundManager.backgroundMusicInstance !== null){
        // stop
        SoundManager.backgroundMusicInstance.setMute(true);
    }
};

SoundManager.startSounds = function(){
    if(SoundManager.backgroundMusicInstance == null && gameData.gamerData.isMusicOn){
        this.toggleSound();
    }
};

SoundManager.playBounce = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("bounce_sound");
    }
};

SoundManager.playGameOver = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("gameover_sound");
    }
};

SoundManager.playSuccess = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("success_sound");
    }
};

SoundManager.playCoinCatched = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("coin_sound");
    }
};