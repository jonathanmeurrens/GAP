/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Sparkle = (function(){

    var self;

    function Sparkle(xPos, yPos, type, maxAmount){

        self = this;

        this.view = new createjs.Container();

        this.width = 27;
        this.height = 26;
        this.type = type;
        this.maxAmount = maxAmount;
        this.amount = 0;
        if(type === Sparkle.TAIL){
            this.interval = setInterval(tailAnimation, 100);
        }else if(type === Sparkle.CIRCLE){
            this.interval = setInterval(circleAnimation, 100);
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.view.x = xPos - 90;
        this.view.y = yPos;
        this.view.scaleX = this.view.scaleY = 0.6 + Math.random()*0.4;
    }

    function tailAnimation(){
        self.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.y = Math.random()*20;
        self.view.addChild(star);

        var toX =  50 + Math.random() * 100;

        createjs.Tween.get(star).to({scaleX:0, scaleY:0, rotate: 20 + Math.random()*30, x: toX},  400)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(self.amount > self.maxAmount){
            clearInterval(self.interval);
            self.interval = null;
            self.view.parent.removeChild(self.view);
        }
    }

    function circleAnimation(){
        self.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.y = Math.random()* 120;
        star.x = Math.random()* 120;
        star.scaleX = star.scaleY = 0;
        self.view.addChild(star);

        createjs.Tween.get(star).to({scaleX:1, scaleY:1, rotate: 20 + Math.random()*30},  200)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(self.amount > self.maxAmount && self.view !== null){
            clearInterval(self.interval);
            self.interval = null;
            self.view.parent.removeChild(self.view);
        }
    }

    return Sparkle;
})();

Sparkle.TAIL = "TAIL";
Sparkle.CIRCLE = "CIRCLE";