/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 10:05
 * To change this template use File | Settings | File Templates.
 */

var GameContainer = (function(){

    var self;

    function GameContainer(gameData){

        self = this;

        this.view = new createjs.Container();

        this.leafs = new Array();
        this.obstacles = new Array();
    }

    GameContainer.prototype.createGround = function(xPos, yPos, width, height){
        this.ground = new Ground(xPos,yPos, width, height);
        this.view.addChild(this.ground.view);
    }

    GameContainer.prototype.createRock = function(xPos, yPos){
        var obstacle = new Rock(xPos, translateYPos(yPos), 40, 240);
        this.view.addChild(obstacle.view);
        this.obstacles.push(obstacle);
    }

    GameContainer.prototype.createLeaf = function(xPos, yPos){
        var leaf = new Leaf(xPos, yPos, 20, 20);
        this.view.addChild(leaf.view);
        this.leafs.push(leaf);
    }

    GameContainer.prototype.createBird = function(){
        this.bird = new Bird(-20, -20, 40, 40);
        this.view.addChild(this.bird.view);
    }

    GameContainer.prototype.createNest = function(xPos, yPos){
        if(xPos==null){
            xPos = stage.canvas.width - 20;
        }
        this.nest = new Nest(xPos, translateYPos(yPos), 20, 20);
        this.view.addChild(this.nest.view);
    }

    GameContainer.prototype.createTornado = function(xPos, yPos){
        var tornado = new Tornado(xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(tornado.view);
        this.obstacles.push(tornado);
    }

    GameContainer.prototype.removeBird = function(){
        if(this.bird != null){
            world.DestroyBody(this.bird.view.body);
            this.view.removeChild(this.bird.view);
            this.bird = null;
        }
    }

    GameContainer.prototype.removeGround = function(){
        if(this.ground != null){
            world.DestroyBody(this.ground.view.body);
            this.view.removeChild(this.ground.view);
            this.ground = null;
        }
    }

    GameContainer.prototype.removeNest = function(){
        if(this.nest != null){
            world.DestroyBody(this.nest.view.body);
            this.view.removeChild(this.nest.view);
            this.nest = null;
        }
    }

    GameContainer.prototype.resetContainer = function(){
        for(var i=0; i < this.leafs.length; i++){
            var leaf = this.leafs[i];
            world.DestroyBody(leaf.view.body);
            this.view.removeChild(leaf.view);
            this.leafs.splice(i,1);
        }
        for(var i=0; i < this.obstacles.length; i++){
            var obstacle = this.obstacles[i];
            world.DestroyBody(obstacle.view.body);
            this.view.removeChild(obstacle.view);
            this.obstacles.splice(i,1);
        }
        this.removeBird();
        this.removeGround();
        this.removeNest();
    }


    // --------------- HELPERS

    function translateYPos(yPos){
        var newYPos = stage.canvas.height - yPos;
        return newYPos;
    }

    return GameContainer;

})();