/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/12/13
 * Time: 14:14
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */

var Button = (function(){

    var self;

    function Button(button_type){

        self = this;

        this.view = new createjs.Container();

        console.log(button_type);
        var url = 'assets/common/buttons/' + button_type.toLowerCase()+".png";
        this.clickTimeout = null;

        this.width = 50;
        this.height = 50;

        if(button_type === Button.LEVELS){
            this.width = 87;
            this.height = 78;
        }
        else if(button_type === Button.NEXT_LEVEL){
            this.width = 99;
            this.height = 92;
        }
        else if(button_type === Button.PLAY_AGAIN){
            this.width = 83;
            this.height = 76;
        }
        else if(button_type === Button.FACEBOOK){
            this.width = 80;
            this.height = 72;
        }
        else if(button_type === Button.START){
            this.width = 70;
            this.height = 40;
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var button_data = {
            images: [url],
            frames: {width:this.width, height:this.height},
            animations: {default:[0], active:[1], hover:[2]}
        };
        var btnSpritesheet = new createjs.SpriteSheet(button_data);
        this.btn = new createjs.Sprite(btnSpritesheet, "default");
        this.view.addChild(this.btn);
        this.btn.regX = this.width/2;
        this.btn.regY = this.height/2;
        this.btn.addEventListener("click", function(e){
            self.btn.gotoAndStop("active");
            this.clickTimeout = setTimeout(function(){
                self.btn.gotoAndStop("default");
                clearTimeout(self.clickTimeout);
            },100);
        });
        this.btn.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.1, scaleY:1.1},  100);
        });
        this.btn.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        this.view.cursor = 'pointer';
        this.btn.scaleX = 0;
        this.btn.scaleY = 0;
        createjs.Tween.get(this.btn).wait(Math.random()*1000).to({scaleX:1, scaleY:1},  1200, createjs.Ease.elasticOut);
    }

    return Button;

})();

// BUTTON TYPES
Button.PLAY_AGAIN = "PLAY_AGAIN";
Button.NEXT_LEVEL = "NEXT_LEVEL";
Button.FACEBOOK = "FACEBOOK";
Button.MUTE = "MUTE";
Button.LEVELS = "LEVELS";
Button.START = "START";