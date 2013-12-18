/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 10:05
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals world:true  */
/* globals createjs:true  */

/* globals Background:true  */
/* globals Ground:true  */
/* globals Rock:true  */
/* globals Leaf:true  */
/* globals Bird:true  */
/* globals Nest:true  */
/* globals Tornado:true  */
/* globals Cloud:true  */
/* globals Tree:true  */
/* globals EnemyBird:true  */
/* globals Balloon:true  */

var GameContainer = (function(){

    var self;

    function GameContainer(gameData){

        self = this;

        this.gameData = gameData;

        this.view = new createjs.Container();

        this.leafs = [];
        this.obstacles = [];
        this.clouds = [];
        this.trees = [];
    }

    GameContainer.prototype.createBackground = function(url){
        this.background = new Background(url);
        this.view.addChild(this.background.view);
    };

    GameContainer.prototype.createGround = function(url, xPos, yPos, width, height){
        this.ground = new Ground(url, xPos, yPos, width, height);
        this.view.addChild(this.ground.view);
    };

    GameContainer.prototype.createRock = function(xPos, yPos){
        var obstacle = new Rock(xPos, translateYPos(yPos), 40, 240);
        this.view.addChild(obstacle.view);
        this.obstacles.push(obstacle);
    };

    GameContainer.prototype.createLeaf = function(xPos, yPos, angle, restitution){
        var leaf = new Leaf(xPos, translateYPos(yPos), 58, 6.5, angle, restitution);
        this.view.addChild(leaf.view);
        this.leafs.push(leaf);
    };

    GameContainer.prototype.createBird = function(xPos, yPos){
        this.bird = new Bird(xPos, translateYPos(yPos), 40, 40);
        this.view.addChild(this.bird.view);
    };

    GameContainer.prototype.createNest = function(xPos, yPos){
        if(xPos==null){
            xPos = stage.canvas.width - 20;
        }
        this.nest = new Nest(xPos, translateYPos(yPos), 50, 16);
        this.view.addChild(this.nest.view);
    };

    GameContainer.prototype.createTornado = function(xPos, yPos){
        var tornado = new Tornado(xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(tornado.view);
        this.obstacles.push(tornado);
    };

    GameContainer.prototype.createCloud = function(xPos, yPos){
        var cloud = new Cloud(xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(cloud.view);
        this.clouds.push(cloud);
    };

    GameContainer.prototype.createEnemyBird = function(xPos, yPos, direction){
        var enemyBird = new EnemyBird(xPos, translateYPos(yPos), 150, 150, direction);
        this.view.addChild(enemyBird.view);
        this.obstacles.push(enemyBird);
    };

    GameContainer.prototype.createBalloon = function(xPos, yPos, direction){
        var balloon = new Balloon(xPos, translateYPos(yPos), 150, 150, direction);
        this.view.addChild(balloon.view);
        this.obstacles.push(balloon);
    };

    GameContainer.prototype.createTree = function(url, xPos, width, height){
        var tree = new Tree(url, xPos, width, height);
        this.view.addChild(tree.view);
        this.trees.push(tree);
    };

    GameContainer.prototype.removeBird = function(){
        if(this.bird != null){
            world.DestroyBody(this.bird.view.body);
            this.view.removeChild(this.bird.view);
            this.bird = null;
        }
    };

    GameContainer.prototype.removeBackground = function(){
        if(this.background != null){
            this.view.removeChild(this.background.view);
            this.background = null;
        }
    };

    GameContainer.prototype.removeGround = function(){
        if(this.ground != null){
            world.DestroyBody(this.ground.view.body);
            this.view.removeChild(this.ground.view);
            this.ground = null;
        }
    };

    GameContainer.prototype.removeNest = function(){
        if(this.nest != null){
            world.DestroyBody(this.nest.view.body);
            this.view.removeChild(this.nest.view);
            this.nest = null;
        }
    };

    GameContainer.prototype.resetContainer = function(){
        for(var i=0; i < this.leafs.length; i++){
            var leaf = this.leafs[i];
            world.DestroyBody(leaf.view.body);
            this.view.removeChild(leaf.view);
            this.leafs.splice(i,1);
        }
        for(var j=0; j < this.obstacles.length; j++){
            var obstacle = this.obstacles[j];
            world.DestroyBody(obstacle.view.body);
            this.view.removeChild(obstacle.view);
            this.obstacles.splice(j,1);
        }
        for(var k=0; k < this.clouds.length; k++){
            var cloud = this.clouds[k];
            world.DestroyBody(cloud.view.body);
            this.view.removeChild(cloud.view);
            this.clouds.splice(k,1);
        }
        for(var l=0; l < this.trees.length; l++){
            var tree = this.trees[l];
            this.view.removeChild(tree.view);
            this.trees.splice(l,1);
        }
        this.removeBird();
        this.removeGround();
        this.removeNest();
        this.removeBackground();
    };

    GameContainer.prototype.handleBeginContact = function(contact){
        var colliderA = contact.GetFixtureA().GetBody().GetUserData();
        var colliderB = contact.GetFixtureB().GetBody().GetUserData();

        //console.log("[GameContainer] -- endContact -- " + colliderA + " / " + colliderB);

        if(colliderA === "leaf" || colliderB === "leaf"){
            for(var i=0; i < this.leafs.length; i++){
                var leaf = this.leafs[i];
                leaf.handleBeginContact(contact);
            }
        }
        else if(colliderA === "cloud" || colliderB === "cloud"){
            for(var j=0; j < this.clouds.length; j++){
                var cloud = this.clouds[j];
                cloud.handleBeginContact(contact);
            }
        }
    };

    GameContainer.prototype.handleEndContact = function(contact){
        var colliderA = contact.GetFixtureA().GetBody().GetUserData();
        var colliderB = contact.GetFixtureB().GetBody().GetUserData();
        //console.log("[GameContainer] -- endContact -- " + colliderA + " / " + colliderB);

        if(colliderA === "leaf" || colliderB === "leaf"){
            for(var i=0; i < this.leafs.length; i++){
                var leaf = this.leafs[i];
                leaf.handleEndContact(contact);
            }
        }
        else if(colliderA === "cloud" || colliderB === "cloud"){
            for(var j=0; j < this.clouds.length; j++){
                var cloud = this.clouds[j];
                cloud.handleEndContact(contact);
            }
        }
    };


    // --------------- HELPERS

    function translateYPos(yPos){
        var newYPos = stage.canvas.height - yPos;
        return newYPos;
    }

    return GameContainer;

})();