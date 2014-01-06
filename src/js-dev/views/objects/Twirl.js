/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 02/01/14
 * Time: 12:20
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Twirl = (function(){

    var self;

    function Twirl(xPos, yPos, direction){

        self = this;

        this.view = new createjs.Bitmap(preload.getResult("twirl"));

        this.width = 11;
        this.height = 21;

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.view.x = xPos - 90;
        this.view.y = yPos;
        var toX = xPos - 110;

        if(direction === Twirl.RIGHT_DIRECTION){
            this.view.scaleX = -1;
            this.view.x = xPos - 30;
            toX = xPos;
        }


        createjs.Tween.get(this.view).to({scaleX:0, scaleY:0, rotate: 10, x: toX},  400)
            .call(function(){
                this.parent.removeChild(this);
            });
    }

    return Twirl;
})();

Twirl.LEFT_DIRECTION = "LEFT_DIRECTION";
Twirl.RIGHT_DIRECTION = "RIGHT_DIRECTION";