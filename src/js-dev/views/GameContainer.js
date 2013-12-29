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
/* globals TimeCoin:true  */
/* globals MiniTree:true  */

var GameContainer = (function(){

    var self;

    function GameContainer(gameData){

        self = this;

        GameContainer.COIN_REMOVED = "COIN_REMOVED";

        this.gameData = gameData;

        this.view = new createjs.Container();

        this.leafs = [];
        this.obstacles = [];
        this.clouds = [];
        this.trees = [];
        this.backgrounds = [];
        this.timeCoins = [];

        $(this.view).on('tick', $.proxy(tick, this));
    }

    GameContainer.prototype.createBackground = function(url){
        var background = new Background(url);
        this.view.addChild(background.view);
        this.backgrounds.push(background);
    };

    GameContainer.prototype.createGround = function(url, xPos, yPos, width, height){
        this.ground = new Ground(url, xPos, yPos, width, height);
        this.view.addChild(this.ground.view);
    };

    GameContainer.prototype.createRock = function(xPos, yPos){
        var obstacle = new Rock(xPos, translateYPos(yPos), 475, 358);
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
        this.nest = new Nest(xPos, translateYPos(yPos), 30, 12);
        this.view.addChild(this.nest.view);
    };

    GameContainer.prototype.createTornado = function(xPos, yPos){
        var tornado = new Tornado(xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(tornado.view);
        this.obstacles.push(tornado);
    };

    GameContainer.prototype.createCloud = function(url, xPos, yPos){
        var cloud = new Cloud(url, xPos, translateYPos(yPos), 150, 150);
        this.view.addChild(cloud.view);
        this.clouds.push(cloud);
    };

    GameContainer.prototype.createEnemyBird = function(url, xPos, yPos, direction){
        var enemyBird = new EnemyBird(url, xPos, translateYPos(yPos), direction);
        this.view.addChild(enemyBird.view);
        this.obstacles.push(enemyBird);
    };

    GameContainer.prototype.createBalloon = function(url, xPos, yPos, direction){
        var balloon = new Balloon(url, xPos, translateYPos(yPos), 93, 157, direction);
        this.view.addChild(balloon.view);
        this.obstacles.push(balloon);
    };

    GameContainer.prototype.createTree = function(url, xPos, width, height){
        var tree = new Tree(url, xPos, width, height);
        this.view.addChild(tree.view);
        this.trees.push(tree);
    };

    GameContainer.prototype.createTimeCoin = function(xPos, yPos, worth, index){
        var timeCoin = new TimeCoin(xPos, translateYPos(yPos), worth, index);
        this.view.addChild(timeCoin.view);
        this.timeCoins.push(timeCoin);
    };

    GameContainer.prototype.createMiniTree = function(url, xPos){
        var miniTree = new MiniTree(url, xPos, translateYPos(0), 20, 245);
        this.view.addChild(miniTree.view);
        this.obstacles.push(miniTree);
    };



    GameContainer.prototype.removeTimeCoinWithUserData = function(userData){
        for(var n=0; n < this.timeCoins.length; n++){
            var timeCoin = this.timeCoins[n];
            if(timeCoin.view.body.GetUserData() === userData){
                world.DestroyBody(timeCoin.view.body);
                this.view.removeChild(timeCoin.view);
                this.timeCoins.splice(n,1);
                var event = new createjs.Event(GameContainer.COIN_REMOVED);
                self.view.dispatchEvent(event);
            }
        }
    };

    GameContainer.prototype.removeBird = function(){
        if(this.bird != null){
            world.DestroyBody(this.bird.view.body);
            this.view.removeChild(this.bird.view);
            this.bird = null;
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

        var length = this.leafs.length;
        for(var q=0; q < length; q++){
            var leaf = this.leafs.pop();
            world.DestroyBody(leaf.view.body);
            this.view.removeChild(leaf.view);
        }

        length = this.obstacles.length;
        for(var j=0; j < length; j++){
            var obstacle = this.obstacles.pop();
            world.DestroyBody(obstacle.view.body);
            this.view.removeChild(obstacle.view);
        }
        length = this.clouds.length;
        for(var k=0; k < length; k++){
            var cloud = this.clouds.pop();
            world.DestroyBody(cloud.view.body);
            this.view.removeChild(cloud.view);
        }
        length = this.trees.length;
        for(var l=0; l < length; l++){
            var tree = this.trees.pop();
            this.view.removeChild(tree.view);
        }
        length = this.backgrounds.length;
        for(var m=0; m < length; m++){
            var background = this.backgrounds.pop();
            this.view.removeChild(background.view);
        }
        length = this.timeCoins.length;
        for(var n=0; n < length; n++){
            var timeCoin = this.timeCoins.pop();
            world.DestroyBody(timeCoin.view.body);
            this.view.removeChild(timeCoin.view);
        }
        this.removeBird();
        this.removeGround();
        this.removeNest();
    };

    GameContainer.prototype.parallaxLeft = function(){
        var bg = this.backgrounds[1].view;
        createjs.Tween.removeTweens(bg);
        createjs.Tween.get(bg).to({x:bg.x+10}, 1000);
    };

    GameContainer.prototype.parallaxRight = function(){
        var bg = this.backgrounds[1].view;
        createjs.Tween.removeTweens(bg);
        createjs.Tween.get(bg).to({x:bg.x-10}, 1000);
    };

    GameContainer.prototype.handleBeginContact = function(contact){
        var colliderA = contact.GetFixtureA().GetBody().GetUserData();
        var colliderB = contact.GetFixtureB().GetBody().GetUserData();

        //console.log("[GameContainer] -- endContact -- " + colliderA + " / " + colliderB);

        /*if(colliderA === "leaf" || colliderB === "leaf"){
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
        }*/
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


    function tick(e){
        if(self.bird != null){
            if(self.bird.view.y  < 80){
                self.view.y = -self.bird.view.y + 80;
            }
            else{
                self.view.y=0;
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