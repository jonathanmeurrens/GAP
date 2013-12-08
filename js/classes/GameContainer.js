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
        this.clouds = new Array();
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

    GameContainer.prototype.createLeaf = function(xPos, yPos, angle){
        var leaf = new Leaf(xPos, translateYPos(yPos), 20, 20, angle);
        this.view.addChild(leaf.view);
        this.leafs.push(leaf);
    }

    GameContainer.prototype.createBird = function(xPos, yPos){
        this.bird = new Bird(xPos, translateYPos(yPos), 40, 40);
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

    GameContainer.prototype.createCloud = function(xPos, yPos){
        var cloud = new Cloud(xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(cloud.view);
        this.clouds.push(cloud);
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
        for(var i=0; i < this.clouds.length; i++){
            var cloud = this.clouds[i];
            world.DestroyBody(cloud.view.body);
            this.view.removeChild(cloud.view);
            this.clouds.splice(i,1);
        }
        this.removeBird();
        this.removeGround();
        this.removeNest();
    }

    GameContainer.prototype.handleBeginContact = function(contact){
        var colliderA = contact.GetFixtureA().GetBody().GetUserData();
        var colliderB = contact.GetFixtureB().GetBody().GetUserData();

        //console.log("[GameContainer] -- endContact -- " + colliderA + " / " + colliderB);

        if(colliderA == "leaf" || colliderB == "leaf"){
            for(var i=0; i < this.leafs.length; i++){
                var leaf = this.leafs[i];
                leaf.handleBeginContact(contact);
            }
        }
        else if(colliderA == "cloud" || colliderB == "cloud"){
            for(var i=0; i < this.clouds.length; i++){
                var cloud = this.clouds[i];
                cloud.handleBeginContact(contact);
            }
        }
    }

    GameContainer.prototype.handleEndContact = function(contact){
        var colliderA = contact.GetFixtureA().GetBody().GetUserData();
        var colliderB = contact.GetFixtureB().GetBody().GetUserData();
        //console.log("[GameContainer] -- endContact -- " + colliderA + " / " + colliderB);

        if(colliderA == "leaf" || colliderB == "leaf"){
            for(var i=0; i < this.leafs.length; i++){
                var leaf = this.leafs[i];
                leaf.handleEndContact(contact);
            }
        }
        else if(colliderA == "cloud" || colliderB == "cloud"){
            for(var i=0; i < this.clouds.length; i++){
                var cloud = this.clouds[i];
                cloud.handleEndContact(contact);
            }
        }
    }


    // --------------- HELPERS

    function translateYPos(yPos){
        var newYPos = stage.canvas.height - yPos;
        return newYPos;
    }

    return GameContainer;

})();