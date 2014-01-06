/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals SoundManager:true  */
/* globals Button:true  */

var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        Statistics.LEVELS_CLICKED = "LEVELS_CLICKED";
        Statistics.TIME_OUT = "TIME_OUT";

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;

        this.stars = 1;
        this.level = 0;
        this.bounces = 0;
        this.leafsCount = 1;
        this.timeCount = 0;

        // LEVEL IND
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");
        this.view.addChild(this.levelTxt);
        this.levelTxt.x = stage.canvas.width/2 - 122/2;
        this.levelTxt.y = 10;

        // TIME IND
        this.timeTxt = new createjs.Text("", "14px Arial", "#000000");
        this.view.addChild(this.timeTxt);
        this.timeTxt.x = stage.canvas.width/2 - 170/2;
        this.timeTxt.y = 40;

        // SOUND MUTE
        var mute_data = {
            images: ["assets/common/buttons/mute.png"],
            frames: {width:27, height:37},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet, "on");
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            SoundManager.toggleSound();
            if(SoundManager.playSounds){
                self.muteBtnSprite.gotoAndStop("on");
            }else{
                self.muteBtnSprite.gotoAndStop("mute");
            }
        });


        // LEVELS PANEL BTN
        var levelsBtn = new Button(Button.LEVELS);
        levelsBtn.view.x = 100;
        this.view.addChild(levelsBtn.view);
        levelsBtn.view.addEventListener("click", function(e){
            var event = new createjs.Event(Statistics.LEVELS_CLICKED);
            self.view.dispatchEvent(event);
        });

        updateStats();
    }

    Statistics.prototype.setLevel = function(levelIndex){
        this.level = levelIndex;
        updateStats();
    };

    Statistics.prototype.levelUp = function(){
        this.level++;
        updateStats();
    };

    Statistics.prototype.levelDown = function(){
        this.level--;
        updateStats();
    };

    Statistics.prototype.increaseBounce = function(){
        this.bounces++;
        updateStats();
    };

    Statistics.prototype.earnTime = function(){
        this.timeCount += 10;
    };

    Statistics.prototype.resetStats = function(){
        clearInterval(this.timer);
        this.timer = null;
        this.timeCount = 59;
        this.timer = setInterval(updateTime, 1000);
        this.bounces = 0;
        updateTime();
    };

    Statistics.prototype.getStars = function(){
        if(self.bounces<0)
        {
            self.bounces = 0;
        }
        var stars = (Math.round((self.leafsCount - self.bounces) / self.leafsCount)*3);
        if(stars > 3){
            stars = 3;
        }else if(stars < 0){
            stars = 0;
        }
        return stars;
    };

    function updateStats(){

        self.levelTxt.text = "level: " + (self.level + 1);

        /*var frame = "none";
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
        self.starsSprite.gotoAndStop(frame);*/
    }

    function updateTime(){
        var timeTxt = "time left: 00:";
        if(self.timeCount<10){
            timeTxt += "0";
        }
        timeTxt +=self.timeCount;
        self.timeTxt.text = timeTxt;

        self.timeCount--;

        if(self.timeCount < 0){
            clearInterval(self.timer);
            self.timer = null;
            var event = new createjs.Event(Statistics.TIME_OUT);
            self.view.dispatchEvent(event);
        }
    }

    return Statistics;

})();