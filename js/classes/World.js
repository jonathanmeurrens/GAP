/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/10/13
 * Time: 13:54
 * To change this template use File | Settings | File Templates.
 */

var World = (function(){

    function World(width, height){
        /*this.friction = 0.8;
        this.gravity = 0.3;*/
        this.width = width;
        this.height = height;
        this.container = new createjs.Container();

        var g = new createjs.Graphics();
        g.setStrokeStyle(1);
        g.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g.beginFill(createjs.Graphics.getRGB(255,0,0));
        g.drawRect(0, 0, width, height)
        var s = new createjs.Shape(g);

        this.container.addChild(s);
        //s.beginStroke("#F00").beginFill("#00F").drawRect(0, 0, width, height).draw(myContext2D);
    }

    World.prototype.addChild = function(element){
        this.container.addChild(element);
    }

    World.prototype.followPlayerX = function(player, width, offset){
        var x = -(player.view.x - (width/2)) + offset;
        if(x < this.boundW){
            this.container.x = this.boundW;
        }else if(x > 0){
            this.container.x = 0;
        }else{
            this.container.x = x;
        }
        //console.log(x);
    }

    World.prototype.followPlayerY = function(player, height, offset){
        //console.log(player.view.y);
        var y = -(player.view.y - (height/2)) + offset;
        if(y < this.boundH){
            this.container.y = this.boundH;
        }else if(y > 0){
            this.container.y = 0;
        }else{
            this.container.y = y;
            //console.log(y);
        }
        //console.log(y);
    }

    return World;
})();