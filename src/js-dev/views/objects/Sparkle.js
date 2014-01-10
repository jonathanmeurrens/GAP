/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Sparkle = (function(){

    var self;

    function Sparkle(xPos, yPos, type, maxAmount){

        if(self != null && self.interval != null){
            clearInterval(self.interval);
            self.interval = null;
        }

        self = this;
        this.view = new createjs.Container();

        this.width = 27;
        this.height = 26;
        this.type = type;
        this.maxAmount = maxAmount;
        this.amount = 0;
        this.interval = null;


        if(type === Sparkle.TAIL){
            this.interval = setInterval(function(){
                tailAnimation(self);
            }, 100);
        }else if(type === Sparkle.CIRCLE){
            this.interval = setInterval(function(){
                circleAnimation(self);
            }, 150);
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.view.x = xPos - 90;
        this.view.y = yPos;
        this.view.scaleX = this.view.scaleY = 0.6 + Math.random()*0.4;
    }

    function tailAnimation(sparkle){
        sparkle.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.regX = 27/2;
        star.regY = 27/2;
        star.y = Math.random()*20;
        sparkle.view.addChild(star);

        var toX =  50 + Math.random() * 100;

        createjs.Tween.get(star).to({scaleX:0, scaleY:0, rotate: 20 + Math.random()*30, x: toX},  500)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(sparkle.amount >= sparkle.maxAmount){
            clearInterval(sparkle.interval);
            sparkle.interval = null;
            sparkle.view.parent.removeChild(sparkle.view);
        }
    }

    function circleAnimation(sparkle){
        sparkle.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.y = Math.random()* 120;
        star.x = Math.random()* 120;
        star.regX = 27/2;
        star.regY = 27/2;
        star.scaleX = star.scaleY = 0;
        sparkle.view.addChild(star);

        createjs.Tween.get(star).to({scaleX:1, scaleY:1, rotate: 20 + Math.random()*30},  300)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(sparkle.amount >= sparkle.maxAmount && sparkle.view != null){
            clearInterval(sparkle.interval);
            sparkle.interval = null;
            sparkle.view.parent.removeChild(sparkle.view);
        }
    }

    return Sparkle;
})();

Sparkle.TAIL = "TAIL";
Sparkle.CIRCLE = "CIRCLE";