/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */
var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;

        this.stars = 1;
        this.level = 0;

        // LEVEL IND
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");
        this.view.addChild(this.levelTxt);

        // STARS IND
        var data = {
            images: ["img/stars-spritesheet.png"],
            frames: {width:76, height:20},
            animations: {none:[3], one:[0], two:[1], three:[2]}
        };
        var spritesheet = new createjs.SpriteSheet(data);
        this.starsSprite = new createjs.Sprite(spritesheet, "none");
        this.view.addChild(this.starsSprite);

        // SOUND MUTE
        var data = {
            images: ["img/mute-spritesheet.png"],
            frames: {width:50, height:50},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet, "on");
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            console.log("[Statistics] mute sound");
            SoundManager.togglePlayBackgroundMusic();
            SoundManager.isPlayingMusic?self.muteBtnSprite.gotoAndStop("on") : self.muteBtnSprite.gotoAndStop("mute");
        });

        updateStats();
    }

    Statistics.prototype.setLevel = function(levelIndex){
        this.level = levelIndex;
        updateStats();
    }

    Statistics.prototype.levelUp = function(){
        this.level++;
        updateStats();
    }

    Statistics.prototype.levelDown = function(){
        this.level--;
        updateStats();
    }

    Statistics.prototype.starUp = function(){
        if(this.stars <= 2){
            this.stars++;
            updateStats();
        }
    }

    Statistics.prototype.starDown = function(){
        this.stars--;
        updateStats();
    }

    function updateStats(){

        self.levelTxt.text = "level: " + (self.level + 1);

        var frame = "none";
        switch(this.self.starsSprite){
            case 0:
                frame = "none";
                break;
            case 1:
                frame = "one";
                break;
            case 2:
                frame = "two";
                break;
            case 3:
                frame = "three";
                break;
            default:
                frame = "none";
        }
        self.starsSprite.gotoAndStop(frame);
    }

    return Statistics;

})();