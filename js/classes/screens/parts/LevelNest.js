/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:58
 * To change this template use File | Settings | File Templates.
 */

var LevelNest = (function(){

    var self;

    function LevelNest(levelIndex, starsCount, isPlayable){

        self = this;

        // EVENT TYPE
        LevelNest.LEVEL_SELECTED = "LEVEL_SELECTED";

        this.levelIndex = levelIndex;
        this.starsCount = starsCount;
        this.isPlayable = isPlayable;

        this.view = new createjs.Container();

        var backgroundColor = new createjs.Shape();
        backgroundColor.graphics.beginFill(createjs.Graphics.getRGB(200,200,200));
        backgroundColor.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        backgroundColor.mouseEnabled = false;

        this.view.addChild(backgroundColor);

        var nest = new createjs.Bitmap("img/nest.png");
        this.view.addChild(nest);

        if(this.starsCount != null && this.starsCount > 0){
            var stars = new createjs.Bitmap("img/stars_"+this.starsCount+".png");
            this.view.addChild(stars);
        }

        this.view.on("click", $.proxy( clickHandler, this ));
    }

    function clickHandler(e){
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  this.levelIndex;
        self.view.dispatchEvent(event);
    }

    return LevelNest;
})();