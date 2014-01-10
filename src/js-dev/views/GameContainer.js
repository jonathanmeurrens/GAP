/* globals stage:true  */
/* globals world:true  */
/* globals destroyedBodies:true  */
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
/* globals Branch:true  */
/* globals preload:true  */

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
        this.nests = [];

        $(this.view).on('tick', $.proxy(tick, this));
    }

    GameContainer.prototype.showSpacebarInstruction = function(){
        if(this.spacebar_instruction == null){
            this.spacebar_instruction = new createjs.Bitmap(preload.getResult("assets/common/press_spacebar.png"));
            this.spacebar_instruction.regX = 370/2;
            this.spacebar_instruction.regY = 211/2;
            this.spacebar_instruction.x = 500;
            this.spacebar_instruction.y = 300;
            this.view.addChild(this.spacebar_instruction);
            this.spacebar_instruction.alpha = 0;
            createjs.Tween.get(this.spacebar_instruction).to({alpha:1}, 400);
        }else{
            this.removeSpacebarInstruction();
        }
    };

    GameContainer.prototype.removeSpacebarInstruction = function(){
        if(this.spacebar_instruction !== null){
            createjs.Tween.get(this.spacebar_instruction).to({alpha:0}, 400)
                .call(function(){
                    self.view.removeChild(self.spacebar_instruction);
                    self.spacebar_instruction = null;
                });
        }
    };

    GameContainer.prototype.createBackground = function(url){
        var background = new Background(url);
        this.view.addChild(background.view);
        this.backgrounds.push(background);
    };

    GameContainer.prototype.createGround = function(url, xPos, yPos, width, height){
        this.ground = new Ground(url, xPos, yPos, width, height);
        this.view.addChild(this.ground.view);
    };

    GameContainer.prototype.createRock = function(url, xPos, yPos, width, height){
        var obstacle = new Rock(url, xPos, translateYPos(yPos), width, height);
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

    GameContainer.prototype.createNest = function(xPos, yPos, isStart){
        if(xPos==null){
            xPos = stage.canvas.width - 20;
        }
        var nest = new Nest(xPos, translateYPos(yPos), 30, 12, isStart);
        if(isStart!=="true"){
            this.nest = nest;
        }
        this.view.addChild(nest.view);
        this.nests.push(nest);
    };

    GameContainer.prototype.createTornado = function(url, xPos, yPos){
        var tornado = new Tornado(url, xPos, translateYPos(yPos), 120, 230);
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

    GameContainer.prototype.createBranch = function(url, xPos, yPos){
        var branch = new Branch(url, xPos, translateYPos(yPos), 10, 70);
        this.view.addChild(branch.view);
        this.obstacles.push(branch);
    };

    GameContainer.prototype.removeTimeCoinWithUserData = function(userData){
        for(var n=0; n < this.timeCoins.length; n++){
            var timeCoin = this.timeCoins[n];
            if(timeCoin.view.body.GetUserData() === userData){
                destroyedBodies.push(timeCoin.view.body);
                this.view.removeChild(timeCoin.view);
                this.timeCoins.splice(n,1);
                var event = new createjs.Event(GameContainer.COIN_REMOVED);
                self.view.dispatchEvent(event);
            }
        }
    };

    GameContainer.prototype.removeBird = function(){
        if(this.bird != null){
            destroyedBodies.push(this.bird.view.body);
            this.view.removeChild(this.bird.view);
            this.bird = null;
        }
    };

    GameContainer.prototype.removeGround = function(){
        if(this.ground != null){
            destroyedBodies.push(this.ground.view.body);
            this.view.removeChild(this.ground.view);
            this.ground = null;
        }
    };

    GameContainer.prototype.removeNest = function(){
        if(this.nest != null){
            destroyedBodies.push(this.nest.view.body);
            this.view.removeChild(this.nest.view);
            this.nest = null;
        }
    };

    GameContainer.prototype.resetContainer = function(){
        var length = this.leafs.length;
        for(var q=0; q < length; q++){
            var leaf = this.leafs.pop();
            destroyedBodies.push(leaf.view.body);
            this.view.removeChild(leaf.view);
        }

        length = this.obstacles.length;
        for(var j=0; j < length; j++){
            var obstacle = this.obstacles.pop();
            destroyedBodies.push(obstacle.view.body);
            this.view.removeChild(obstacle.view);
        }
        length = this.clouds.length;
        for(var k=0; k < length; k++){
            var cloud = this.clouds.pop();
            destroyedBodies.push(cloud.view.body);
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
            destroyedBodies.push(timeCoin.view.body);
            this.view.removeChild(timeCoin.view);
        }
        length = this.nests.length;
        for(var x=0; x < length; x++){
            var nest = this.nests.pop();
            if(!nest.isStart){
                destroyedBodies.push(nest.view.body);
            }
            this.view.removeChild(nest.view);
        }
        this.removeBird();
        this.removeGround();
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