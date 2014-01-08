/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:58
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var LevelNest = (function(){

    var self;

    function LevelNest(levelIndex, starsCount, isPlayable){

        self = this;

        // EVENT TYPE
        LevelNest.LEVEL_SELECTED = "LEVEL_SELECTED";

        this.levelIndex = levelIndex;
        this.starsCount = starsCount;

        this.view = new createjs.Container();

        var url = "assets/common/nest-available.png";
        if(!isPlayable){
            url = "assets/common/nest-locked.png";
        }
        var nest = new createjs.Bitmap(preload.getResult(url));
        this.view.addChild(nest);
        nest.y = 25;

        if(this.starsCount != null && this.starsCount > 0){
            var stars = new createjs.Bitmap("assets/common/stars_"+this.starsCount+".png");
            this.view.addChild(stars);
            stars.x = 12;
        }

        if(isPlayable){
            this.view.cursor = 'pointer';
            this.view.addEventListener("click", $.proxy( clickHandler, this ));
        }
    }

    function clickHandler(e){
        self.view.off();
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  this.levelIndex;
        self.view.dispatchEvent(event);
    }

    return LevelNest;
})();