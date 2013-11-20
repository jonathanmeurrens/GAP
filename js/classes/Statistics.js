/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */
var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        this.level = 0;
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;
        this.view.addChild(this.levelTxt);

        updateStats();
    }

    Statistics.prototype.levelUp = function(){
        this.level++;
        updateStats();

    }
    Statistics.prototype.levelDown = function(){
        this.level--;
        updateStats();
    }

    function updateStats(){
        console.log(self);
        self.levelTxt.text = "level: " + self.level;
        //console.log("[updated] "+this.level);
    }

    return Statistics;

})();