/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 09/12/13
 * Time: 21:27
 * To change this template use File | Settings | File Templates.
 */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */

var Tree = (function(){

    var self;

    function Tree(url, x, width, height){

        self = this;

        this.x = x;
        this.y = stage.canvas.height - height/2;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(url);
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;
        this.view.x = this.x;
        this.view.y = this.y;
    }

    return Tree;

})();