/* globals createjs:true  */
/* globals gameData:true  */

function SoundManager(){}

SoundManager.backgroundMusicInstance = null;
SoundManager.playSounds = false;

SoundManager.toggleSound = function(){

    console.log(SoundManager.playSounds);
    SoundManager.playSounds = !SoundManager.playSounds;
    console.log(SoundManager.playSounds);

    if(SoundManager.playSounds){
        this.startMusic();
    }
    else {
        this.stopMusic();
    }
};

SoundManager.startMusic = function(){
    // play
    if(SoundManager.backgroundMusicInstance === null){
        SoundManager.backgroundMusicInstance = createjs.Sound.play("music", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
    }
    else if(SoundManager.backgroundMusicInstance != null){
        SoundManager.backgroundMusicInstance.setMute(false);
    }
};

SoundManager.stopMusic = function(){
    // stop
    if(SoundManager.backgroundMusicInstance != null){
        SoundManager.backgroundMusicInstance.setMute(true);
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