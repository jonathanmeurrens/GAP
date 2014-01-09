/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Button = (function(){

    var self;

    function Button(button_type){

        self = this;

        this.view = new createjs.Container();

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
        else if(button_type === Button.START_GAME){
            this.width = 308;
            this.height = 123;
        }
        else if(button_type === Button.OPTIONS){
            this.width = 123;
            this.height = 60;
        }
        else if(button_type === Button.RESET_LEVELS){
            this.width = 172;
            this.height = 54;
        }
        else if(button_type === Button.BACK){
            this.width = 68;
            this.height = 41;
        }
        else if(button_type === Button.PAUSE){
            this.width = 42;
            this.height = 41;
        }
        else if(button_type === Button.RESUME){
            this.width = 81;
            this.height = 67;
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.btn = new createjs.Bitmap(preload.getResult(url));
        this.view.addChild(this.btn);
        this.btn.regX = this.width/2;
        this.btn.regY = this.height/2;

        this.btn.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.btn.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        this.view.cursor = 'pointer';
        this.btn.scaleX = 0.7;
        this.btn.scaleY = 0.7;
        createjs.Tween.get(this.btn).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
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
Button.START_GAME = "START_GAME";
Button.OPTIONS = "OPTIONS";
Button.RESET_LEVELS = "RESET_LEVELS";
Button.BACK = "BACK";
Button.PAUSE = "PAUSE";
Button.RESUME = "RESUME";