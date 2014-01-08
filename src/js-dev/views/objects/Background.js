/* globals stage:true  */
/* globals createjs:true  */

var Background = (function(){

    var self;

    function Background(url){

        self = this;

        this.x = 0;
        this.y = 0;
        this.width = stage.canvas.width;
        this.height = stage.canvas.height;

        this.view = new createjs.Bitmap(url);
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;
        this.view.x = stage.canvas.width/2;
        this.view.y = stage.canvas.height/2;
    }

    return Background;

})();