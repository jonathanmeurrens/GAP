/* globals stage:true  */
/* globals gameData:true  */
/* globals createjs:true  */
/* globals SoundManager:true  */
/* globals Button:true  */

var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        Statistics.LEVELS_CLICKED = "LEVELS_CLICKED";
        Statistics.TIME_OUT = "TIME_OUT";
        Statistics.PAUSE = "PAUSE";

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;

        this.stars = 1;
        this.level = 0;
        this.bounces = 0;
        this.leafsCount = 1;
        this.timeCount = 0;
        this.maxTime = 59;

        this.statsContainer = new createjs.Container();
        this.view.addChild(this.statsContainer);

        var background = new createjs.Bitmap('assets/common/progressbar/bg.png');
        background.regX = 255/2;
        background.x = stage.canvas.width/2;
        background.y = 7;
        this.statsContainer.addChild(background);

        // LEVEL IND
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");
        //this.view.addChild(this.levelTxt);
        this.levelTxt.x = stage.canvas.width/2 - 122/2;
        this.levelTxt.y = 10;
        this.levelTxt.alpha = 0;
        var levelSprite_data = {
            images: ["assets/common/progressbar/levels_spritesheet.png"],
            frames: {width:66, height:28.8}
        };
        var levelsSpritesheet = new createjs.SpriteSheet(levelSprite_data);
        this.levelsSprite = new createjs.Sprite(levelsSpritesheet);
        this.statsContainer.addChild(this.levelsSprite);
        this.levelsSprite.regX = 66/2;
        this.levelsSprite.x = stage.canvas.width/2;
        this.levelsSprite.y = 22;

        // TIME IND
        this.timeTxt = new createjs.Text("", "14px Arial", "#000000");
        //this.view.addChild(this.timeTxt);
        this.timeTxt.x = stage.canvas.width/2 - 170/2;
        this.timeTxt.y = 40;
        var progressSprite_data = {
            images: ["assets/common/progressbar/progress_bar_spritesheet.png"],
            frames: {width:200, height:15}
        };
        var progressSpritesheet = new createjs.SpriteSheet(progressSprite_data);
        this.progressSprite = new createjs.Sprite(progressSpritesheet);
        this.statsContainer.addChild(this.progressSprite);
        this.progressSprite.regX = 200/2;
        this.progressSprite.x = stage.canvas.width/2;
        this.progressSprite.y = 68;

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
            updateMuteBtnState();
        });


        // LEVELS PANEL BTN
        /*var levelsBtn = new Button(Button.LEVELS);
        levelsBtn.view.x = 150;
        levelsBtn.view.y = 74;
        this.view.addChild(levelsBtn.view);
        levelsBtn.view.addEventListener("click", function(e){
            var event = new createjs.Event(Statistics.LEVELS_CLICKED);
            self.view.dispatchEvent(event);
        });*/


        // PAUZE BTN
        var pauzeBtn = new Button(Button.PAUSE);
        pauzeBtn.view.x = 150;
        pauzeBtn.view.y = 74;
        this.view.addChild(pauzeBtn.view);
        pauzeBtn.view.addEventListener("click", function(e){
            var event = new createjs.Event(Statistics.PAUSE);
            self.view.dispatchEvent(event);
            gameData.pauseGame = true;
        });

        updateStats();
        updateMuteBtnState();

        this.statsContainer.y = -200;
    }

    function updateMuteBtnState(){
        if(SoundManager.playSounds){
            self.muteBtnSprite.gotoAndStop("on");
        }else{
            self.muteBtnSprite.gotoAndStop("mute");
        }
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
        var extra = this.maxTime/10;
        if(this.timeCount + extra < this.maxTime){
            this.timeCount += extra;
        }
    };

    Statistics.prototype.resetStats = function(){
        this.statsContainer.y = -200;
        clearInterval(this.timer);
        this.timer = null;
        this.timeCount = this.maxTime;
        this.timer = setInterval(updateTime, 1000);
        this.bounces = 0;
        updateTime();
    };

    Statistics.prototype.showStats = function(){
        this.statsContainer.y = -200;
        createjs.Tween.get(this.statsContainer).to({y:0}, 700, createjs.Ease.cubicOut);
    };

    Statistics.prototype.hideStats = function(){
        createjs.Tween.get(this.statsContainer).to({y:-200}, 700, createjs.Ease.cubicIn);
    };

    Statistics.prototype.getStars = function(){
        var stars = Math.round(this.timeCount / (this.maxTime - this.maxTime/15) * 3);
        console.log("[Statistics] stars:" + stars, this.timeCount, this.maxTime);
        return stars;
    };

    function updateStats(){

        self.levelTxt.text = "level: " + (self.level + 1);
        self.levelsSprite.gotoAndStop(self.level);

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

        if(gameData.pauseGame){
            return;
        }

       self.progressSprite.gotoAndStop(Math.round((self.timeCount / self.maxTime)*67));

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