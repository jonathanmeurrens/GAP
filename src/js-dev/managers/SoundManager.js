/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 08/12/13
 * Time: 11:34
 * To change this template use File | Settings | File Templates.
 */

/* globals createjs:true  */

function SoundManager(){}

SoundManager.isPlayingMusic = false;
SoundManager.backgroundMusicInstance = null;
SoundManager.playSounds = false;

SoundManager.playBounce = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("bounce_sound");
    }
};

SoundManager.togglePlayBackgroundMusic = function(){
    if(SoundManager.playSounds){
        if(!SoundManager.isPlayingMusic){
            // play
            if(SoundManager.backgroundMusicInstance == null){
                SoundManager.backgroundMusicInstance = createjs.Sound.play("music", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
            }
            else{
                SoundManager.backgroundMusicInstance.setMute(false);
            }
        }else{
            // stop
            SoundManager.backgroundMusicInstance.setMute(true);
        }
        SoundManager.isPlayingMusic = !SoundManager.isPlayingMusic;
    }
};

SoundManager.playGameOver = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("gameover_sound");
    }
};

SoundManager.playSuccess = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("success_sound");
    }
};