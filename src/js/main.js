(function(){

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
        var branch = new Branch(url, xPos, translateYPos(yPos), 10, 135);
        this.view.addChild(branch.view);
        this.obstacles.push(branch);
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
        length = this.nests.length;
        for(var x=0; x < length; x++){
            var nest = this.nests.pop();
            if(!nest.isStart){
                world.DestroyBody(nest.view.body);
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

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Balloon = (function(){

    var self;

    function Balloon(url, x, y, width, height, direction){

        self = this;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 2;
        fixDef.friction = 0.3;
        fixDef.restitution = 0;
        fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_kinematicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = 'balloon';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("balloon");

        var circle1 = new box2d.b2CircleShape(this.width/2 / SCALE);
        circle1.m_p.Set(0,-1);
        fixDef.shape = circle1;
        fixDef.userData = "balloon";
        this.view.body.CreateFixture(fixDef);

        var circle2 = new box2d.b2CircleShape(this.width/4 / SCALE);
        circle2.m_p.Set(0,0.5);
        fixDef.shape = circle2;
        fixDef.userData = "balloon";
        this.view.body.CreateFixture(fixDef);

        var circle3 = new box2d.b2CircleShape(this.width/8 / SCALE);
        circle3.m_p.Set(0,2.2);
        fixDef.shape = circle3;
        fixDef.userData = "balloon";
        this.view.body.CreateFixture(fixDef);

        /*if(direction === "right"){
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(1,0));
            this.view.scaleX = -1;
        }else{
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(-1,0));
        }*/

        //$(this.view).on('tick', $.proxy( tick, this ));
        this.updateView();
        animate(this.view);
    }

    function tick(e){
        this.updateView();
    }

    Balloon.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({y:view.y + 30}, 1700).call(function(){
            createjs.Tween.get(this).to({y:this.y - 30}, 1700).call(function(){
                animate(this);
            });
        });
    }

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    return Balloon;

})();

/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */
/* globals Twirl:true  */
/* globals gameData:true  */
/* globals Sparkle:true  */

var Bird = (function(){

    var self;

    function Bird(x, y, width, height){

        self = this;

        // EVENT TYPES
        Bird.DIED = "DIED";

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.impulse = 7;
        this.maxRotations = 0;
        this.evolution = 0;
        this.isDead = false;

        //this.view = new createjs.Bitmap("img/egg.png");
        //this.view.regX = this.view.regY = this.width/2; // put registration point in center

        this.view = new createjs.Container();
        var data = {
            images: ["assets/common/egg-spritesheet.png"],
            frames: {width:45, height:55},
            animations: {one:[0], two:[1], three:[2], four:[3], fly:[3,4,5,6]}
        };
        var spritesheet = new createjs.SpriteSheet(data);
        this.sprite = new createjs.Sprite(spritesheet, "one");
        this.view.addChild(this.sprite);
        this.view.regX = 51/2;
        this.view.regY = 55/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 1;
        fixDef.restitution = 0;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = 'bird';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("bird");

        var circle3 = new box2d.b2CircleShape(((this.width/2.3)-4) / SCALE);
        circle3.m_p.Set(-0.2,-0.5);
        fixDef.shape = circle3;
        fixDef.userData = "bird";
        this.view.body.CreateFixture(fixDef);

        var circle1 = new box2d.b2CircleShape(this.width/2.3 / SCALE);
        circle1.m_p.Set(-0.2,0.1);
        fixDef.shape = circle1;
        fixDef.userData = "bird";
        this.view.body.CreateFixture(fixDef);

        var sparkle = new Sparkle(this.view.x + 70, this.view.y - 20, Sparkle.CIRCLE, 15);
        this.view.addChild(sparkle.view);

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){

        if(gameData.pauseGame){
            return;
        }

        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = (this.view.body.GetAngle()) * (180 / Math.PI);

        if(!self.isDead && (this.view.x > stage.canvas.width || this.view.x < 0 || this.view.y > stage.canvas.height)){
            birdDied();
        }
    }

    function birdDied(){
        var event = new createjs.Event(Bird.DIED);
        self.view.dispatchEvent(event);
        self.isDead = true;
    }

    Bird.prototype.die = function(){
      self.sprite.gotoAndStop(2);
    };

    Bird.prototype.push = function(){
        this.view.body.SetType(box2d.b2Body.b2_dynamicBody);
        applyImpulse(self.view.body, -45, 15);
        this.view.body.SetAngularVelocity(-1);
    };

    Bird.prototype.moveRight = function(){
        self.view.body.ApplyTorque(self.impulse*3);
        applyImpulse(self.view.body, 0, self.impulse);
        self.view.body.SetAngularVelocity(1);
        self.impulseAnimation(Twirl.LEFT_DIRECTION);
    };

    Bird.prototype.moveLeft = function(){
        self.view.body.ApplyTorque(-self.impulse*3);
        applyImpulse(self.view.body, 0, -self.impulse);
        self.view.body.SetAngularVelocity(-1);
        self.impulseAnimation(Twirl.RIGHT_DIRECTION);
    };

    Bird.prototype.fly = function(){
        if(this.evolution === 2){
            self.view.body.SetLinearDamping(10);
            applyImpulse(self.view.body, -90, self.impulse);
            this.sprite.gotoAndPlay("fly");
            setInterval(this.stopFly,2000);
        }
    };

    Bird.prototype.tornadoFly = function(){
        applyImpulse(self.view.body, -90, 40);
    };

    Bird.prototype.rest = function(nestPosition){
        this.view.body.SetType(box2d.b2Body.b2_staticBody);
        this.view.removeAllEventListeners();
        console.log(this.view.rotation%90, this.view.rotation, 90*(this.view.rotation%180));
        createjs.Tween.get(this.view).to({rotation:360, x:nestPosition.x+35, y:nestPosition.y-20},300);
    };

    Bird.prototype.stopFly = function(){
        console.log("[BIRD] stop flying");
        self.view.body.SetLinearDamping(0);
    };

    Bird.prototype.setEvolution = function(evolution){
        this.evolution = parseInt(evolution);
        switch(this.evolution){
            case 1:
                this.sprite.gotoAndStop("one");
                break;
            case 2:
                this.sprite.gotoAndStop("two");
                break;
            case 3:
                this.sprite.gotoAndStop("three");
                break;
            case 4:
                this.sprite.gotoAndStop("four");
                break;
            default :
                this.sprite.gotoAndStop("one");
        }
    };

    Bird.prototype.impulseAnimation = function(direction){
        //console.log("[Bird] rotation:"+this.view.rotation % 90);
        /*if(this.view.rotation < 0){
            if(direction === Twirl.LEFT_DIRECTION){
                direction = Twirl.RIGHT_DIRECTION;
            }else{
                direction = Twirl.LEFT_DIRECTION;
            }
        }*/
        var twirl = new Twirl(this.view.x + 60, this.view.y, direction);
        stage.addChild(twirl.view);
    };

    Bird.prototype.setMaxRotations = function(maxRotations){
        this.maxRotations = maxRotations;
    };

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    return Bird;

})();

/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Branch = (function(){

    function Branch(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.1;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "branch";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, (this.height - 20) / SCALE);
        fixDef.userData = "branch";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    Branch.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 56;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Branch;

})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Button = (function(){

    var self;

    function Button(button_type){

        self = this;

        this.view = new createjs.Container();

        var url = 'assets/common/buttons/' + button_type.toLowerCase()+".png";
        this.clickTimeout = null;

        this.width = 50;
        this.height = 50;

        if(button_type === Button.LEVELS){
            this.width = 87;
            this.height = 78;
        }
        else if(button_type === Button.NEXT_LEVEL){
            this.width = 99;
            this.height = 92;
        }
        else if(button_type === Button.PLAY_AGAIN){
            this.width = 83;
            this.height = 76;
        }
        else if(button_type === Button.FACEBOOK){
            this.width = 80;
            this.height = 72;
        }
        else if(button_type === Button.START){
            this.width = 70;
            this.height = 40;
        }
        else if(button_type === Button.START_GAME){
            this.width = 308;
            this.height = 123;
        }
        else if(button_type === Button.OPTIONS){
            this.width = 123;
            this.height = 60;
        }
        else if(button_type === Button.RESET_LEVELS){
            this.width = 172;
            this.height = 54;
        }
        else if(button_type === Button.BACK){
            this.width = 68;
            this.height = 41;
        }
        else if(button_type === Button.PAUSE){
            this.width = 42;
            this.height = 41;
        }
        else if(button_type === Button.RESUME){
            this.width = 81;
            this.height = 67;
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.btn = new createjs.Bitmap(preload.getResult(url));
        this.view.addChild(this.btn);
        this.btn.regX = this.width/2;
        this.btn.regY = this.height/2;

        this.btn.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.btn.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        this.view.cursor = 'pointer';
        this.btn.scaleX = 0.7;
        this.btn.scaleY = 0.7;
        createjs.Tween.get(this.btn).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
    }

    return Button;

})();

// BUTTON TYPES
Button.PLAY_AGAIN = "PLAY_AGAIN";
Button.NEXT_LEVEL = "NEXT_LEVEL";
Button.FACEBOOK = "FACEBOOK";
Button.MUTE = "MUTE";
Button.LEVELS = "LEVELS";
Button.START = "START";
Button.START_GAME = "START_GAME";
Button.OPTIONS = "OPTIONS";
Button.RESET_LEVELS = "RESET_LEVELS";
Button.BACK = "BACK";
Button.PAUSE = "PAUSE";
Button.RESUME = "RESUME";

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Cloud = (function(){

    var buoyancyController;
    var self;

    function Cloud(url, x, y, width, height){

        self = this;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 2;
        fixDef.friction = 0.3;
        fixDef.restitution = 0;
        fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_kinematicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = 'cloud';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("cloud");

        var circle1 = new box2d.b2CircleShape(this.width/3.5 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "cloud";
        this.view.body.CreateFixture(fixDef);

        var circle2 = new box2d.b2CircleShape(((this.width/3.5)-15) / SCALE);
        circle2.m_p.Set(2,0);
        fixDef.shape = circle2;
        fixDef.userData = "cloud";
        this.view.body.CreateFixture(fixDef);

        var circle3 = new box2d.b2CircleShape(((this.width/3.5)-10) / SCALE);
        circle3.m_p.Set(-2,0);
        fixDef.shape = circle3;
        fixDef.userData = "cloud";
        this.view.body.CreateFixture(fixDef);

        //applyImpulse(this.view.body, 0, 200);
        //this.view.body.SetLinearVelocity(new box2d.b2Vec2(0.5,0));
        //this.view.body.SetLinearDamping(10);


         buoyancyController = new box2d.b2BuoyancyController();
         buoyancyController.normal.Set(0,-1);
         //buoyancyController.offset=-180/SCALE;
         buoyancyController.useDensity=true;
         buoyancyController.density=2.0;
         /*buoyancyController.linearDrag=5;
         buoyancyController.angularDrag=2;*/
         world.AddController(buoyancyController);


        //$(this.view).on('tick', $.proxy( tick, this ));
        //this.updateView();
        this.updateView();
        animate(this.view);
    }

    function tick(e){
        this.updateView();
    }

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({y:view.y + 20}, 2300 + Math.random()*1000).call(function(){
            createjs.Tween.get(this).to({y:this.y - 20}, 2300 + Math.random()*1000).call(function(){
                animate(this);
            });
        });
    }

    Cloud.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 20;
        this.view.y = this.view.body.GetPosition().y * SCALE + 32;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    Cloud.prototype.handleBeginContact = function(contact){
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        if(fixtureA.IsSensor()){
            var bodyB = fixtureB.GetBody();
            if(!bodyB.GetControllerList()){
                buoyancyController.AddBody(bodyB);
            }
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            if(!bodyA.GetControllerList()){
                buoyancyController.AddBody(bodyA);
            }
        }
    };

    Cloud.prototype.handleEndContact = function(contact){
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        if(fixtureA.IsSensor()){
            var bodyB = fixtureB.GetBody();
            if(bodyB.GetControllerList()){
                buoyancyController.RemoveBody(bodyB);
            }
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            if(bodyA.GetControllerList()){
                buoyancyController.RemoveBody(bodyA);
            }
        }
    };

    return Cloud;

})();

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */
/* globals gameData:true  */

var EnemyBird = (function(){

    function EnemyBird(url, x, y, direction){

        this.x = x;
        this.y = y;
        this.width = 46;
        this.height = 32;

        this.view = new createjs.Container();
        var data = {
            framerate: 8,
            images: [url],
            frames: {width:46, height:32},
            animations: {fly:[0,1]}
        };
        var spritesheet = new createjs.SpriteSheet(data);
        this.sprite = new createjs.Sprite(spritesheet, "fly");
        this.view.addChild(this.sprite);
        this.view.regX = 46/2;
        this.view.regY = 32/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 2;
        fixDef.friction = 0.3;
        fixDef.restitution = 0;
        fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_kinematicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = 'enemyBird';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("enemyBird");

        var circle1 = new box2d.b2CircleShape(this.width/3.2 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "enemyBird";
        this.view.body.CreateFixture(fixDef);

        if(direction === "right"){
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(5,0));
            this.view.scaleX = -1;
        }else{
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(-5,0));
        }

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        if(gameData.pauseGame){
            return;
        }
        this.updateView();
    }

    EnemyBird.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return EnemyBird;

})();

/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Ground = (function(){

    var self;

    function Ground(url, x, y, width, height){

        self = this;

        // for physics ground
        var realHeight = 50;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(url);
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;
        this.view.x = stage.canvas.width/2;
        this.view.y = stage.canvas.height - height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = (stage.canvas.height - realHeight) / SCALE;
        bodyDef.userData = "ground";
        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, realHeight / SCALE);
        fixDef.userData = "ground";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
    }

    return Ground;

})();

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Leaf = (function(){

    var buoyancyController;

    function Leaf(x, y, width, height, rotation, restitution){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.restitution = restitution==null?1:restitution;

        this.view = new createjs.Bitmap(preload.getResult("leaf"));
        this.view.regX = this.width;
        this.view.regY = this.height;

        //WATER

       /* var fixDefWater = new box2d.b2FixtureDef();
        fixDefWater.density = 1;
        fixDefWater.friction = 0;
        fixDefWater.restitution = 0;
        fixDefWater.isSensor = true;

        var bodyDefWater = new box2d.b2BodyDef();
        bodyDefWater.type = box2d.b2Body.b2_staticBody;
        bodyDefWater.position.x = this.x / SCALE;
        bodyDefWater.position.y = (this.y + this.height*2) / SCALE;
        bodyDefWater.userData = "water";
        fixDefWater.shape = new box2d.b2PolygonShape();
        fixDefWater.shape.SetAsBox((this.width * 1.5) / SCALE, (this.height * 1.5) / SCALE);
        this.view.body = world.CreateBody(bodyDefWater);
        this.view.body.CreateFixture(fixDefWater);*/


        // BLAADJE
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 0.1;
        fixDef.friction = 0.4;
        fixDef.restitution = this.restitution;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "leaf";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        fixDef.userData = "leaf";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.body.SetAngle(rotation/180 * Math.PI);

        /*fixDef.shape = new box2d.b2CircleShape(0.6);
        var topg = world.CreateBody(bodyDef);
        topg.CreateFixture(fixDef);

        var bottomg = world.CreateBody(bodyDef);
        bottomg.CreateFixture(fixDef);
        bottomg.SetLinearDamping(500);
        //bottomg.SetLinearVelocity(1);
        //bottomg.SetAngularVelocity(0.06);

        var jointDef = new box2d.b2DistanceJointDef();
        //distanceJointDef.bodyA = bodyDef;
        //distanceJointDef.bodyB = bodyDef;
        var worldAnchorOnBody1 = new box2d.b2Vec2(bodyDef.position.x, bodyDef.position.y);
        var worldAnchorOnBody2 = new box2d.b2Vec2(bodyDef.position.x, bodyDef.position.y + 0.6);
        jointDef.Initialize(topg, bottomg, worldAnchorOnBody1, worldAnchorOnBody2);
        jointDef.collideConnected = true;
        world.CreateJoint(jointDef);
        //distanceJointDef.localAnchorA.Set(0.0, 0.0);
        //distanceJointDef.localAnchorB.Set(0.0, 0.0);*/




        //
        //this.view.body.SetLinearDamping(10);


       /* buoyancyController = new box2d.b2BuoyancyController();
        buoyancyController.normal.Set(0,-1);
        buoyancyController.offset=-180/SCALE;
        buoyancyController.density=1;
        buoyancyController.linearDrag=1;
        buoyancyController.angularDrag=1;
        world.AddController(buoyancyController);*/
        //buoyancyController.AddBody(fixDefWater.body);

        //listenForContact();
        //buoyancyController.AddBody(fixDef.body);
        //this.view.body = world.CreateBody(bodyDef);
        //this.view.body.CreateFixture(fixDef);

        $(this.view).on('tick', $.proxy( tick, this ));
        //this.updateView();
    }

    Leaf.prototype.handleBeginContact = function(contact){
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        if(fixtureA.IsSensor()){
            var bodyB = fixtureB.GetBody();
            if(!bodyB.GetControllerList()){
                buoyancyController.AddBody(bodyB);
            }
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            if(!bodyA.GetControllerList()){
                buoyancyController.AddBody(bodyA);
            }
        }
    };

    Leaf.prototype.handleEndContact = function(contact){
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        if(fixtureA.IsSensor()){
            var bodyB = fixtureB.GetBody();
            if(bodyB.GetControllerList()){
                buoyancyController.RemoveBody(bodyB);
            }
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            if(bodyA.GetControllerList()){
                buoyancyController.RemoveBody(bodyA);
            }
        }
    };

    function tick(e){
        this.updateView();
    }

    Leaf.prototype.updateView = function(){
        this.view.rotation = this.view.body.GetAngle() * (180 / Math.PI);
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
    };

    return Leaf;

})();

/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var MiniTree = (function(){

    function MiniTree(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.1;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "miniTree";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, (this.height - 20) / SCALE);
        fixDef.userData = "miniTree";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    MiniTree.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 50;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return MiniTree;

})();

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Nest = (function(){

    function Nest(x, y, width, height, isStart){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("nest"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        if(isStart === "true"){
            this.isStart = true;
        }
        else{
            this.isStart = false;
        }

        if(!isStart){
            var fixDef = new box2d.b2FixtureDef();
            fixDef.density = 1;
            fixDef.friction = 0.5;
            fixDef.restitution = 0;
            var bodyDef = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2Body.b2_staticBody;
            bodyDef.position.x = this.x / SCALE;
            bodyDef.position.y = this.y / SCALE;
            bodyDef.userData = "nest";
            fixDef.shape = new box2d.b2PolygonShape();
            fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
            this.view.body = world.CreateBody(bodyDef);
            this.view.body.CreateFixture(fixDef);

            var top_nest = new box2d.b2PolygonShape();
            top_nest.SetAsOrientedBox((this.width - 5) / SCALE, 3 / SCALE, new box2d.b2Vec2(0,-0.5));
            //top_nest.SetPosition(this.x / SCALE,  this.y / SCALE);
            //console.log("[Nest] position:"+top_nest.GetPosition());
            fixDef.shape = top_nest;
            fixDef.userData = "top-nest";
            this.view.body.CreateFixture(fixDef);
            this.updateView();
        }
        else{
            this.view.x = this.x;
            this.view.y = this.y;
        }

        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    Nest.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 32;
        this.view.y = this.view.body.GetPosition().y * SCALE - 13;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Nest;

})();

/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Rock = (function(){

    function Rock(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.1;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "rock";

        var scaleX = width / 475;
        var scaleY = height / 358;

        fixDef.shape = new box2d.b2PolygonShape();
        var vertices = [];
        vertices.push(new box2d.b2Vec2(- (1-scaleX)*9, -6 * scaleY));
        vertices.push(new box2d.b2Vec2(6.3 * scaleX - (1-scaleX)*9, 3.3));
        vertices.push(new box2d.b2Vec2(-5.5 * scaleX - (1-scaleX)*9, 3.3));
        fixDef.shape.SetAsVector(vertices, 3);
        fixDef.userData = "rock";
        /*fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);*/
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    Rock.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE + 5;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Rock;

})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Sparkle = (function(){

    var self;

    function Sparkle(xPos, yPos, type, maxAmount){

        self = this;

        this.view = new createjs.Container();

        this.width = 27;
        this.height = 26;
        this.type = type;
        this.maxAmount = maxAmount;
        this.amount = 0;
        if(type === Sparkle.TAIL){
            this.interval = setInterval(tailAnimation, 100);
        }else if(type === Sparkle.CIRCLE){
            this.interval = setInterval(circleAnimation, 100);
        }

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.view.x = xPos - 90;
        this.view.y = yPos;
        this.view.scaleX = this.view.scaleY = 0.6 + Math.random()*0.4;
    }

    function tailAnimation(){
        self.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.y = Math.random()*20;
        self.view.addChild(star);

        var toX =  50 + Math.random() * 100;

        createjs.Tween.get(star).to({scaleX:0, scaleY:0, rotate: 20 + Math.random()*30, x: toX},  400)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(self.amount > self.maxAmount){
            clearInterval(self.interval);
            self.interval = null;
            self.view.parent.removeChild(self.view);
        }
    }

    function circleAnimation(){
        self.amount++;

        var star = new createjs.Bitmap(preload.getResult("star-particle"));
        star.y = Math.random()* 120;
        star.x = Math.random()* 120;
        star.scaleX = star.scaleY = 0;
        self.view.addChild(star);

        createjs.Tween.get(star).to({scaleX:1, scaleY:1, rotate: 20 + Math.random()*30},  200)
            .call(function(){
                this.parent.removeChild(this);
            });

        if(self.amount > self.maxAmount && self.view !== null){
            clearInterval(self.interval);
            self.interval = null;
            self.view.parent.removeChild(self.view);
        }
    }

    return Sparkle;
})();

Sparkle.TAIL = "TAIL";
Sparkle.CIRCLE = "CIRCLE";

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var TimeCoin = (function(){

    var self;

    function TimeCoin(x, y, worth, index){

        self = this;

        this.x = x;
        this.y = y;
        this.width = 31;
        this.height = 31;
        this.worth = worth;

        this.view = new createjs.Bitmap(preload.getResult("time-coin"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_kinematicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        //bodyDef.userData = 'timeCoin'+index;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData('timeCoin'+index);

        var circle1 = new box2d.b2CircleShape(this.width/2 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "timeCoin"+index;
        this.view.body.CreateFixture(fixDef);

        this.updateView();
        animate(this.view);
        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({y:view.y - 10}, 1000 + Math.random()*500).call(function(e){
            createjs.Tween.get(this).to({y:view.y + 10}, 1000 + Math.random()*500).call(function(){
                animate(this);
            });
        });
    }

    function tick(e){
        this.updateView();
    }

    TimeCoin.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return TimeCoin;

})();

/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Tornado = (function(){

    function Tornado(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));


        console.log("[Tornado] pos", this.x, this.y);

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 1;
        fixDef.isSensor = true;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = (parseInt(this.x)+350) / SCALE;
        bodyDef.position.y = (parseInt(this.y)+340) / SCALE;
        bodyDef.userData = "tornado";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        fixDef.userData = "tornado";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.view.x = x;
        this.view.y = y;

        //this.updateView();
    }

    Tornado.prototype.updateView = function(){
       /* this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);*/
    };

    return Tornado;

})();

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

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var Twirl = (function(){

    var self;

    function Twirl(xPos, yPos, direction){

        self = this;

        this.view = new createjs.Bitmap(preload.getResult("twirl"));

        this.width = 11;
        this.height = 21;

        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        this.view.x = xPos - 90;
        this.view.y = yPos;
        var toX = xPos - 110;

        if(direction === Twirl.RIGHT_DIRECTION){
            this.view.scaleX = -1;
            this.view.x = xPos - 10;
            toX = xPos + 10;
        }


        createjs.Tween.get(this.view).to({scaleX:0, scaleY:0, rotate: 10, x: toX},  400)
            .call(function(){
                this.parent.removeChild(this);
            });
    }

    return Twirl;
})();

Twirl.LEFT_DIRECTION = "LEFT_DIRECTION";
Twirl.RIGHT_DIRECTION = "RIGHT_DIRECTION";

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */

var LevelNest = (function(){

    var self;

    function LevelNest(levelIndex, starsCount, isPlayable){

        self = this;

        // EVENT TYPE
        LevelNest.LEVEL_SELECTED = "LEVEL_SELECTED";

        this.levelIndex = levelIndex;
        this.starsCount = starsCount;

        this.view = new createjs.Container();

        var url = "assets/common/nest-available.png";
        if(!isPlayable){
            url = "assets/common/nest-locked.png";
        }
        var nest = new createjs.Bitmap(preload.getResult(url));
        this.view.addChild(nest);
        nest.y = 25;

        if(this.starsCount != null && this.starsCount > 0){
            var stars = new createjs.Bitmap("assets/common/stars_"+this.starsCount+".png");
            this.view.addChild(stars);
            stars.x = 12;
        }

        if(isPlayable){
            this.view.cursor = 'pointer';
            this.view.addEventListener("click", $.proxy( clickHandler, this ));
        }
    }

    function clickHandler(e){
        self.view.off();
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  this.levelIndex;
        self.view.dispatchEvent(event);
    }

    return LevelNest;
})();

/* globals stage:true  */
/* globals gameData:true  */
/* globals createjs:true  */
/* globals SoundManager:true  */
/* globals Button:true  */
/* globals Sparkle:true  */

var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        Statistics.LEVELS_CLICKED = "LEVELS_CLICKED";
        Statistics.TIME_OUT = "TIME_OUT";
        Statistics.PAUSE = "PAUSE";

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;

        this.stars = 1;
        this.level = 0;
        this.bounces = 0;
        this.leafsCount = 1;
        this.timeCount = 0;
        this.maxTime = 59;

        this.statsContainer = new createjs.Container();
        this.view.addChild(this.statsContainer);

        var background = new createjs.Bitmap('assets/common/progressbar/bg.png');
        background.regX = 255/2;
        background.x = stage.canvas.width/2;
        background.y = 7;
        this.statsContainer.addChild(background);

        // LEVEL IND
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");
        //this.view.addChild(this.levelTxt);
        this.levelTxt.x = stage.canvas.width/2 - 122/2;
        this.levelTxt.y = 10;
        this.levelTxt.alpha = 0;
        var levelSprite_data = {
            images: ["assets/common/progressbar/levels_spritesheet.png"],
            frames: {width:66, height:28.8}
        };
        var levelsSpritesheet = new createjs.SpriteSheet(levelSprite_data);
        this.levelsSprite = new createjs.Sprite(levelsSpritesheet);
        this.statsContainer.addChild(this.levelsSprite);
        this.levelsSprite.regX = 66/2;
        this.levelsSprite.x = stage.canvas.width/2;
        this.levelsSprite.y = 22;

        // TIME IND
        this.timeTxt = new createjs.Text("", "14px Arial", "#000000");
        //this.view.addChild(this.timeTxt);
        this.timeTxt.x = stage.canvas.width/2 - 170/2;
        this.timeTxt.y = 40;
        var progressSprite_data = {
            images: ["assets/common/progressbar/progress_bar_spritesheet.png"],
            frames: {width:200, height:15}
        };
        var progressSpritesheet = new createjs.SpriteSheet(progressSprite_data);
        this.progressSprite = new createjs.Sprite(progressSpritesheet);
        this.statsContainer.addChild(this.progressSprite);
        this.progressSprite.regX = 200/2;
        this.progressSprite.x = stage.canvas.width/2;
        this.progressSprite.y = 68;

        // SOUND MUTE
        var mute_data = {
            images: ["assets/common/buttons/mute.png"],
            frames: {width:28.5, height:37},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet, "on");
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            SoundManager.toggleSound();
            updateMuteBtnState();
        });

        // PAUZE BTN
        var pauzeBtn = new Button(Button.PAUSE);
        pauzeBtn.view.x = 90;
        pauzeBtn.view.y = 38;
        this.view.addChild(pauzeBtn.view);
        pauzeBtn.view.addEventListener("click", function(e){
            var event = new createjs.Event(Statistics.PAUSE);
            self.view.dispatchEvent(event);
            gameData.pauseGame = true;
        });

        updateStats();
        updateMuteBtnState();

        this.statsContainer.y = -200;
        this.statsContainer.x = -15;
    }

    function updateMuteBtnState(){
        if(SoundManager.playSounds || gameData.isMusicOn){
            self.muteBtnSprite.gotoAndStop("on");
        }else{
            self.muteBtnSprite.gotoAndStop("mute");
        }
    }

    Statistics.prototype.setLevel = function(levelIndex){
        this.level = levelIndex;
        updateStats();
    };

    Statistics.prototype.levelUp = function(){
        this.level++;
        updateStats();
    };

    Statistics.prototype.levelDown = function(){
        this.level--;
        updateStats();
    };

    Statistics.prototype.increaseBounce = function(){
        this.bounces++;
        updateStats();
    };

    Statistics.prototype.earnTime = function(){
        var extra = this.maxTime/10;
        if(this.timeCount + extra < this.maxTime){
            this.timeCount += extra;
        }
        var sparkle = new Sparkle(self.progressSprite.x + (180 * (this.timeCount/this.maxTime)), self.progressSprite.y, Sparkle.TAIL, 15);
        self.view.addChild(sparkle.view);
    };

    Statistics.prototype.resetStats = function(){
        this.statsContainer.y = -200;
        clearInterval(this.timer);
        this.timer = null;
        this.timeCount = this.maxTime;
        this.timer = setInterval(updateTime, 1000);
        this.bounces = 0;
        updateTime();
    };

    Statistics.prototype.showStats = function(){
        this.statsContainer.y = -200;
        createjs.Tween.get(this.statsContainer).to({y:0}, 700, createjs.Ease.cubicOut);
    };

    Statistics.prototype.hideStats = function(){
        createjs.Tween.get(this.statsContainer).to({y:-200}, 700, createjs.Ease.cubicIn);
    };

    Statistics.prototype.getStars = function(){
        var stars = Math.round(this.timeCount / (this.maxTime - this.maxTime/15) * 3);
        console.log("[Statistics] stars:" + stars, this.timeCount, this.maxTime);
        return stars;
    };

    function updateStats(){

        self.levelTxt.text = "level: " + (self.level + 1);
        self.levelsSprite.gotoAndStop(self.level);

        /*var frame = "none";
        switch(this.self.starsSprite){
            case 0:
                frame = "none";
                break;
            case 1:
                frame = "one";
                break;
            case 2:
                frame = "two";
                break;
            case 3:
                frame = "three";
                break;
            default:
                frame = "none";
        }
        self.starsSprite.gotoAndStop(frame);*/
    }

    function updateTime(){

        if(gameData.pauseGame){
            return;
        }

       self.progressSprite.gotoAndStop(Math.round((self.timeCount / self.maxTime)*67));

        var timeTxt = "time left: 00:";
        if(self.timeCount<10){
            timeTxt += "0";
        }
        timeTxt +=self.timeCount;
        self.timeTxt.text = timeTxt;

        self.timeCount--;

        if(self.timeCount < 0){
            clearInterval(self.timer);
            self.timer = null;
            var event = new createjs.Event(Statistics.TIME_OUT);
            self.view.dispatchEvent(event);
        }
    }

    return Statistics;

})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */

var EndScreen = (function(){

    var self;

    function EndScreen(){

        self = this;

        // EVENT TYPES
        EndScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("end-background"));
        this.view.addChild(background);

        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 143;
        playAgainBtn.view.y = this.height + 24;
        this.view.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(EndScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });
    }

    return EndScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */
/* globals publishScoreToFB:true  */

var GameOverScreen = (function(){

    var self;

    function GameOverScreen(){

        self = this;

        // EVENT TYPES
        GameOverScreen.MENU = "MENU";
        GameOverScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.width = 352;
        this.height = 234;
        this.view = new createjs.Container();

        this.container = new createjs.Container();
        this.container.regX = this.width/2;
        this.container.regY = this.height/2;
        this.container.x = stage.canvas.width/2;
        this.container.y = stage.canvas.height/2 - 35;

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        this.view.addChild(this.container);

        var background = new createjs.Bitmap(preload.getResult("failed-background"));
        this.container.addChild(background);

        // FACEBOOK
        var facebookBtn = new Button(Button.FACEBOOK);
        facebookBtn.view.x = 260;
        facebookBtn.view.y = 50;
        facebookBtn.view.y = facebookBtn.view.y;
        this.container.addChild(facebookBtn.view);
        facebookBtn.view.on("click", postOnFbHandler);


        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 143;
        playAgainBtn.view.y = this.height + 24;
        this.container.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(GameOverScreen.RESTART_LEVEL, true);
            self.view.dispatchEvent(event);
        });
    }

    function postOnFbHandler(e){
        publishScoreToFB(1,3);
    }

    return GameOverScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */

var InstructionsScreen = (function(){

    var self;

    function InstructionsScreen(instructionsData){

        self = this;

        // EVENT TYPES
        InstructionsScreen.INSTRUCTIONS_DONE = "INSTRUCTIONS_DONE";

        this.instructionsData = instructionsData;
        this.currentInstruction = 0;
        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        showNextInstruction();

        this.view.cursor = 'pointer';
        this.view.addEventListener("click",function(e){
            showNextInstruction();
        });
    }

    function showNextInstruction(){
        if(self.currentInstruction < self.instructionsData.length){
            removeCurrentInstruction();
            self.instructionImg = new createjs.Bitmap(preload.getResult($(self.instructionsData[self.currentInstruction]).attr("img")));
            self.view.addChild(self.instructionImg);
            console.log($(self.instructionsData[self.currentInstruction]).attr("img"));
        }
        else{
            removeCurrentInstruction();
            var event = new createjs.Event(InstructionsScreen.INSTRUCTIONS_DONE, true);
            self.view.dispatchEvent(event);
        }
        self.currentInstruction++;
    }

    function removeCurrentInstruction(){
        if(self.instructionImg != null){
            self.view.removeChild(self.instructionImg);
            self.instructionImg = null;
        }
    }

    return InstructionsScreen;
})();

/* globals gameData:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals LevelNest:true  */
/* globals preload:true  */
/* globals Button:true  */

var LevelsScreen = (function(){

    var self;

    function LevelsScreen(fromPause){

        self = this;

        // EVENT TYPES
        LevelsScreen.BACK = "BACK";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult('assets/common/bg.png'));
        this.view.addChild(background);

        if(fromPause){
            var backBtn = new Button(Button.BACK);
            this.view.addChild(backBtn.view);
            backBtn.view.x = 100;
            backBtn.view.y = 70;
            backBtn.view.addEventListener("click", function(){
                var event = new createjs.Event(LevelsScreen.BACK, true);
                self.view.dispatchEvent(event);
            });
        }

        $("body").on("keydown",function(e){
            if(e.which === 49){ //1
                levelSelected(0);
            }
            else if(e.which === 50){ //2
                levelSelected(1);
            }
            else if(e.which === 222){ //3
                levelSelected(2);
            }
            else if(e.which === 53){ //4
                levelSelected(3);
            }
            else if(e.which === 54){ //5
                levelSelected(4);
            }
            else if(e.which === 54){ //5
                levelSelected(4);
            }
            else if(e.which === 55){ //5
                levelSelected(5);
            }
            else if(e.which === 56){ //5
                levelSelected(6);
            }
            else if(e.which === 57){ //5
                levelSelected(7);
            }
            else if(e.which === 58){ //5
                levelSelected(8);
            }
            else if(e.which === 59){ //5
                levelSelected(9);
            }
        });

        showLevels();
    }

    function levelSelected(i){
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  i;
        self.view.dispatchEvent(event);
    }

    function showLevels(){
        var levelsContainer = new createjs.Container();
        self.view.addChild(levelsContainer);

        var yPos = 0;
        var xPos = 0;
        for(var i=0; i < gameData.getLevelCount(); i++){
            var locked = false;
            if(i <= gameData.gamerData.levels.length)
            {
                locked = false;
            }
            var nest = new LevelNest(i,gameData.gamerData.levels[i],!locked);
            nest.view.x = xPos;
            nest.view.y = yPos;
            xPos += 160;
            if(i%4 >= 3){
                yPos+=120;
                xPos = 0;
            }
            levelsContainer.addChild(nest.view);
        }
        levelsContainer.x = 215;
        levelsContainer.y = 100;
    }

    return LevelsScreen;

})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals publishScoreToFB:true  */
/* globals Button:true  */
/* globals LevelNest:true  */
/* globals preload:true  */

var NextLevelScreen = (function(){

    var self;

    function NextLevelScreen(level, stars){

        self = this;

        // EVENT TYPES
        NextLevelScreen.NEXT_LEVEL = "NEXT_LEVEL";
        NextLevelScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.screenType = ScreenManager.NEXT_LEVEL;
        this.stars = stars;
        this.level = level;
        this.width = 351;
        this.height = 233;
        this.view = new createjs.Container();

        this.container = new createjs.Container();
        this.container.regX = this.width/2;
        this.container.regY = this.height/2;
        this.container.x = stage.canvas.width/2;
        this.container.y = stage.canvas.height/2 - 35;

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        this.view.addChild(this.container);
        var background = new createjs.Bitmap(preload.getResult("success-background"));
        this.container.addChild(background);

        // FACEBOOK
        var facebookBtn = new Button(Button.FACEBOOK);
        facebookBtn.view.x = 260;
        facebookBtn.view.y = 50;
        facebookBtn.view.y = facebookBtn.view.y;
        this.container.addChild(facebookBtn.view);
        facebookBtn.view.on("click", postOnFbHandler);


        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 143;
        playAgainBtn.view.y = this.height + 24;
        this.container.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(NextLevelScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });

        // NEXT LEVEL
        var nextLevelBtn = new Button(Button.NEXT_LEVEL);
        nextLevelBtn.view.x = 297;
        nextLevelBtn.view.y = playAgainBtn.view.y + 6;
        this.container.addChild(nextLevelBtn.view);
        nextLevelBtn.view.on("click", function(){
            var event = new createjs.Event(NextLevelScreen.NEXT_LEVEL, true);
            self.view.dispatchEvent(event);
        });


        // STARS
        var levelNest = new LevelNest(0, stars, true);
        this.container.addChild(levelNest.view);
        levelNest.view.x = 125;
        levelNest.view.y = 20;

        // TEMP
        /*$("body").on("keydown", function(e){
            if(e.which === 13){
                nextLevelHandler(e);
            }
        });*/
    }

    function postOnFbHandler(e){
        publishScoreToFB(self.level + 1, self.stars);
    }

    return NextLevelScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */
/* globals Button:true  */
/* globals gameData:true  */

var OptionsScreen = (function(){

    var self;

    function OptionsScreen(){

        // EVENT TYPES
        OptionsScreen.SAVE = "SAVE";
        OptionsScreen.CANCEL = "CANCEL";

        self = this;

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("assets/common/startpage/bg.png"));
        this.view.addChild(background);

        var boom = new createjs.Bitmap(preload.getResult("assets/common/startpage/boom.png"));
        boom.y = stage.canvas.height - 539;
        this.view.addChild(boom);

        var tjilp = new createjs.Bitmap(preload.getResult("assets/common/startpage/tjilp.png"));
        tjilp.y = 50;
        tjilp.x = 400;
        this.view.addChild(tjilp);

        var bosjes = new createjs.Bitmap(preload.getResult("assets/common/startpage/bosjes_onderaan.png"));
        bosjes.y = stage.canvas.height - 88;
        this.view.addChild(bosjes);


        // MUSIC MUTE
        var mute_data = {
            images: ["assets/common/buttons/music_spritesheet.png"],
            frames: {width:449/2, height:43},
            animations: {on:[1], mute:[0]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet);
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.x = 614;
        this.muteBtnSprite.y = 286;
        this.muteBtnSprite.regX = 184/2;
        this.muteBtnSprite.regY = 54/2;
        this.muteBtnSprite.scaleX = 0.7;
        this.muteBtnSprite.scaleY = 0.7;
        this.muteBtnSprite.cursor = 'pointer';
        this.muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isMusicOn = !gameData.gamerData.isMusicOn;
            updateButtonsStates();
            var event = new createjs.Event(OptionsScreen.SAVE, true);
            self.view.dispatchEvent(event);
        });
        createjs.Tween.get(this.muteBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.muteBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.muteBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });


        // FX MUTE
        var fx_mute_data = {
            images: ["assets/common/buttons/soundfx_spritesheet.png"],
            frames: {width:449/2, height:43},
            animations: {on:[1], mute:[0]}
        };
        var fx_muteBtnspritesheet = new createjs.SpriteSheet(fx_mute_data);
        this.fx_muteBtnSprite = new createjs.Sprite(fx_muteBtnspritesheet);
        this.view.addChild(this.fx_muteBtnSprite);
        this.fx_muteBtnSprite.x = 650;
        this.fx_muteBtnSprite.y = 354;
        this.fx_muteBtnSprite.regX = 202/2;
        this.fx_muteBtnSprite.regY = 54/2;
        this.fx_muteBtnSprite.scaleX = 0.7;
        this.fx_muteBtnSprite.scaleY = 0.7;
        this.fx_muteBtnSprite.cursor = 'pointer';
        this.fx_muteBtnSprite.addEventListener("click", function(e){
            gameData.gamerData.isFxOn = !gameData.gamerData.isFxOn;
            updateButtonsStates();
            var event = new createjs.Event(OptionsScreen.SAVE, true);
            self.view.dispatchEvent(event);
        });
        createjs.Tween.get(this.fx_muteBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.fx_muteBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.fx_muteBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });

        // FX MUTE
        var reset_data = {
            images: ["assets/common/buttons/reset_levels.png"],
            frames: {width:324/2, height:48},
            animations: {default:[0], done:[1]}
        };
        var resetBtnspritesheet = new createjs.SpriteSheet(reset_data);
        this.resetBtnSprite = new createjs.Sprite(resetBtnspritesheet);
        this.view.addChild(this.resetBtnSprite);
        this.resetBtnSprite.regX = 160/2;
        this.resetBtnSprite.regY = 24/2;
        this.resetBtnSprite.scaleX = 0.7;
        this.resetBtnSprite.scaleY = 0.7;
        this.resetBtnSprite.x = 648;
        this.resetBtnSprite.y = 415;
        this.resetBtnSprite.cursor = 'pointer';
        this.resetBtnSprite.addEventListener("click", function(e){
            var event = new createjs.Event(OptionsScreen.RESET_LEVELS, true);
            self.view.dispatchEvent(event);
            self.resetBtnSprite.gotoAndStop("done");
        });
        createjs.Tween.get(this.resetBtnSprite).to({scaleX:1, scaleY:1},  1400, createjs.Ease.elasticOut);
        this.resetBtnSprite.addEventListener("mouseover", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.07, scaleY:1.07},  100);
        });
        this.resetBtnSprite.addEventListener("mouseout", function(e){
            createjs.Tween.get(e.target).to({scaleX:1.0, scaleY:1.0},  100);
        });



        // BACK BTN
        var backBtn = new Button(Button.BACK);
        this.view.addChild(backBtn.view);
        backBtn.view.x = 530;
        backBtn.view.y = 235;
        backBtn.view.addEventListener("click", function(){
            var event = new createjs.Event(OptionsScreen.CANCEL, true);
            self.view.dispatchEvent(event);
        });

        updateButtonsStates();
    }

    function updateButtonsStates(){
        if(gameData.gamerData.isMusicOn){
            self.muteBtnSprite.gotoAndStop("on");
        }else{
            self.muteBtnSprite.gotoAndStop("mute");
        }

        if(gameData.gamerData.isFxOn){
            self.fx_muteBtnSprite.gotoAndStop("on");
        }else{
            self.fx_muteBtnSprite.gotoAndStop("mute");
        }
    }

    return OptionsScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */
/* globals publishScoreToFB:true  */

var PauseScreen = (function(){

    var self;

    function PauseScreen(){

        self = this;

        // EVENT TYPES
        PauseScreen.LEVELS = "LEVELS";
        PauseScreen.RESUME = "RESUME";
        PauseScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.width = 370;
        this.height = 211;
        this.view = new createjs.Container();

        this.container = new createjs.Container();
        this.container.regX = this.width/2;
        this.container.regY = this.height/2;
        this.container.x = stage.canvas.width/2;
        this.container.y = stage.canvas.height/2 - 35;

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        this.view.addChild(this.container);

        var background = new createjs.Bitmap(preload.getResult("paused-background"));
        this.container.addChild(background);


        // RESUME BTN
        var resumeBtn = new Button(Button.RESUME);
        resumeBtn.view.x = 230;
        resumeBtn.view.y = this.height - 20;
        this.container.addChild(resumeBtn.view);
        resumeBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.RESUME, true);
            self.view.dispatchEvent(event);
        });

        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 145;
        playAgainBtn.view.y = this.height - 20;
        this.container.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });

        // MENU BTN
        var menuBtn = new Button(Button.LEVELS);
        menuBtn.view.x = 320;
        menuBtn.view.y = this.height - 20;
        this.container.addChild(menuBtn.view);
        menuBtn.view.on("click", function(){
            var event = new createjs.Event(PauseScreen.LEVELS, true);
            self.view.dispatchEvent(event);
        });
    }

    return PauseScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */
/* globals Button:true  */

var StartScreen = (function(){

    var self;

    function StartScreen(){

        self = this;

        // EVENT TYPES
        StartScreen.START = "START";
        StartScreen.OPTIONS = "OPTIONS";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("assets/common/startpage/bg.png"));
        this.view.addChild(background);

        var boom = new createjs.Bitmap(preload.getResult("assets/common/startpage/boom.png"));
        boom.y = stage.canvas.height - 539;
        this.view.addChild(boom);

        var bosjes = new createjs.Bitmap(preload.getResult("assets/common/startpage/bosjes_onderaan.png"));
        bosjes.y = stage.canvas.height - 88;
        this.view.addChild(bosjes);

        var tjilp = new createjs.Bitmap(preload.getResult("assets/common/startpage/tjilp.png"));
        tjilp.y = 50;
        tjilp.x = 400;
        this.view.addChild(tjilp);

        var startGameBtn = new Button(Button.START_GAME);
        this.view.addChild(startGameBtn.view);
        startGameBtn.view.addEventListener("click", startHandler);
        startGameBtn.view.x = 800;
        startGameBtn.view.y = 370;

        var optionsBtn = new Button(Button.OPTIONS);
        this.view.addChild(optionsBtn.view);
        optionsBtn.view.addEventListener("click", optionsHandler);
        optionsBtn.view.x = 710;
        optionsBtn.view.y = 453;


        $("body").on("keydown", function(e){
            if(e.which === 83){
                startHandler(e);
            }
        });
    }

    function startHandler(e){
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    }

    function optionsHandler(e){
        var event = new createjs.Event(StartScreen.OPTIONS, true);
        self.view.dispatchEvent(event);
    }

    return StartScreen;
})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals preload:true  */


var PreloadManager = (function(){

    var self;

    function PreloadManager(){
        self = this;

        PreloadManager.LOADING_DONE = "LOADING_DONE";

        this.isPreloadingGame = false;
        this.view = new createjs.Container();

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", self.handleProgress);
        preload.addEventListener("complete", self.handleComplete);
        preload.addEventListener("fileload", self.handleFileLoad);

        this.preloaderView = new createjs.Container();

        var background = new createjs.Bitmap('assets/common/preloader/bg.png');
        this.preloaderView.addChild(background);

        this.earth = new createjs.Bitmap('assets/common/preloader/bg2.png');
        this.earth.regX = 592/2;
        this.earth.regY = 592/2;
        this.earth.x = stage.canvas.width/2;
        this.earth.y = stage.canvas.height/2;
        this.preloaderView.addChild(this.earth);

        this.progressEgg = new createjs.Bitmap('assets/common/preloader/eitje.png');
        this.progressEgg.regX = 83/2;
        this.progressEgg.regY = 91/2;
        this.progressEgg.x = stage.canvas.width/2;
        this.progressEgg.y = stage.canvas.height/2;
        this.preloaderView.addChild(this.progressEgg);

        this.removePreloaderTimeout = null;
    }

    PreloadManager.prototype.preloadGame = function(){
        showPreloader();
        self.isPreloadingGame = true;
        var manifest = [
            {src:"assets/common/dead-star-particle.png", id:"dead-star-particle"},
            {src:"assets/common/star-particle.png", id:"star-particle"},
            {src:"assets/common/bg.png"},
            {src:"assets/common/startpage/bg.png"},
            {src:"assets/common/startpage/boom.png"},
            {src:"assets/common/startpage/bosjes_onderaan.png"},
            {src:"assets/common/startpage/tjilp.png"},

            {src:"assets/common/end/bg.png", id:"end-background"},
            {src:"assets/common/pause/bg.png", id:"paused-background"},
            {src:"assets/common/succeed_1.png", id:"success-background"},
            {src:"assets/common/failed.png", id:"failed-background"},
            {src:"assets/common/time-coin.png", id:"time-coin"},
            {src:"assets/common/egg-spritesheet.png"},
            {src:"assets/common/leaf.png", id:"leaf"},
            {src:"assets/common/nest.png", id:"nest"},
            {src:"assets/common/nest-available.png"},
            {src:"assets/common/nest-locked.png"},
            {src:"assets/common/twirl.png", id:"twirl"},
            {src:"assets/common/rock.png", id:"rock"},
            {src:"assets/common/stars-spritesheet.png"},
            {src:"assets/common/press_spacebar.png"},
            {src:"assets/common/progressbar/progress_bar_spritesheet.png"},
            {src:"assets/common/progressbar/levels_spritesheet.png"},
            {src:"assets/common/progressbar/bg.png"},

            {src:"assets/common/buttons/retry.png"},
            {src:"assets/common/buttons/resume.png"},
            {src:"assets/common/buttons/back.png"},
            {src:"assets/common/buttons/facebook.png"},
            {src:"assets/common/buttons/next_level.png"},
            {src:"assets/common/buttons/play_again.png"},
            {src:"assets/common/buttons/pause.png"},
            {src:"assets/common/buttons/levels.png"},
            {src:"assets/common/buttons/mute.png"},
            {src:"assets/common/buttons/options.png"},
            {src:"assets/common/buttons/start_game.png"},
            {src:"assets/common/buttons/reset_levels.png"},
            {src:"assets/common/buttons/music_spritesheet.png"},
            {src:"assets/common/buttons/soundfx_spritesheet.png"},

            {src:"assets/sound/bounce.mp3", id:"bounce_sound"},
            {src:"assets/sound/coin.ogg", id:"coin_sound"},
            {src:"assets/sound/music.ogg", id:"music"},
            {src:"assets/sound/gameover.ogg", id:"gameover_sound"},
            {src:"assets/sound/success.ogg", id:"success_sound"}
        ];
        createjs.Sound.alternateExtensions = ["mp3"];
        preload.loadManifest(manifest, true);
    };

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({rotation:-180}, 6000 + Math.random()*1000).call(function(){
            createjs.Tween.get(this).to({y:this.rotation-180}, 6000).call(function(){
                animate(this);
            });
        });
    }

    PreloadManager.prototype.preloadLevel = function(manifest){
        showPreloader();
        self.isPreloadingGame = false;
        preload.loadManifest(manifest, true);
    };

    PreloadManager.prototype.handleProgress = function(event) {
        //console.log(event.loaded);
        self.progressEgg.rotation = event.loaded * 360;
    };

    PreloadManager.prototype.handleFileLoad = function(event) {
        //console.log(event);
    };

    PreloadManager.prototype.handleComplete = function(e) {
        removePreloader();
        var event = new createjs.Event(PreloadManager.LOADING_DONE, true);
        self.view.dispatchEvent(event);
    };

    PreloadManager.prototype.handleError = function(event){
        console.log("[StartScreen] error preload!"+event);
    };

    function showPreloader(){
        animate(self.earth);
        stage.addChild(self.preloaderView);
    }

    function removePreloader(){
        createjs.Tween.removeTweens(self.earth);
        stage.removeChild(self.preloaderView);
       /* self.removePreloaderTimeout = setTimeout(function(){

            clearTimeout(self.removePreloaderTimeout);
            self.removePreloaderTimeout = null;
        }, 1000);*/
    }

    return PreloadManager;

})();

/* globals stage:true  */
/* globals createjs:true  */
/* globals StartScreen:true  */
/* globals GameOverScreen:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals LevelsScreen:true  */
/* globals LevelNest:true  */
/* globals OptionsScreen:true  */
/* globals PauseScreen:true  */
/* globals EndScreen:true  */

var ScreenManager = (function(){

    var self;

    function ScreenManager(){

        self = this;

        this.view = new createjs.Container();
        this.screen = null;

        ScreenManager.GAME_OVER = "GAME_OVER";
        ScreenManager.INSTRUCTIONS = "INSTRUCTIONS";
        ScreenManager.NEXT_LEVEL = "NEXT_LEVEL";
        ScreenManager.LEVELS = "LEVELS";
        ScreenManager.START = "START";
        ScreenManager.PAUSE = "PAUSE";
        ScreenManager.END = "END";
    }

    ScreenManager.prototype.showScreen = function(screenType){

        if(this.screen != null){
            return;
        }

        if(screenType === ScreenManager.GAME_OVER){
            this.screen = new GameOverScreen();
            this.screen.view.on(GameOverScreen.RESTART_LEVEL, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.on(StartScreen.START, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.PAUSE){
            this.screen = new PauseScreen();
            this.screen.view.addEventListener(PauseScreen.RESUME, function(e){
                self.removeScreen();
            });
            this.screen.view.addEventListener(PauseScreen.PLAY_AGAIN, function(e){
                self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.END){
            this.screen = new EndScreen();
            this.screen.view.on(EndScreen.PLAY_AGAIN, function(e){
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
    };

    ScreenManager.prototype.showOptionsScreen = function(gamerData){
        self.removeScreen();
        this.screen = new OptionsScreen(gamerData);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(OptionsScreen.CANCEL, function(e){
            self.removeScreen();
            self.showScreen(ScreenManager.START);
        });
    };

    ScreenManager.prototype.showLevelsScreen = function(fromPause){
        if(fromPause){
            self.removeScreen();
            console.log("[ScreenManager] remove pause screen");
        }
        this.screen = new LevelsScreen(fromPause);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(LevelNest.LEVEL_SELECTED, function(){
            self.removeScreen();
        });
        this.screen.view.addEventListener(LevelsScreen.BACK, function(){
            self.removeScreen();
            self.showScreen(ScreenManager.PAUSE);
        });

    };

    ScreenManager.prototype.showInstructionsScreen = function(instructionsData){
        this.screen = new InstructionsScreen(instructionsData);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showNextLevelScreen = function(level, stars){
        this.screen = new NextLevelScreen(level, stars);
        this.view.addChild(this.screen.view);
        this.screen.view.addEventListener(NextLevelScreen.NEXT_LEVEL, function(e){
            self.removeScreen();

        });
        this.screen.view.addEventListener(NextLevelScreen.PLAY_AGAIN, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.removeScreen = function(){
        if(self.screen != null){
            self.view.removeChild(self.screen.view);
            self.screen = null;
        }
    };

    return ScreenManager;
})();


/* globals createjs:true  */
/* globals gameData:true  */

function SoundManager(){}

SoundManager.backgroundMusicInstance = null;
SoundManager.playSounds = false;

SoundManager.toggleSound = function(){

    SoundManager.playSounds = !SoundManager.playSounds;
    if(SoundManager.playSounds){
            // play
            if(SoundManager.backgroundMusicInstance === null){
                SoundManager.backgroundMusicInstance = createjs.Sound.play("music", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
            }
            else{
                SoundManager.backgroundMusicInstance.setMute(false);
            }
    }
    else if(SoundManager.backgroundMusicInstance !== null){
        // stop
        SoundManager.backgroundMusicInstance.setMute(true);
    }
};

SoundManager.startSounds = function(){
    if(SoundManager.backgroundMusicInstance == null && gameData.gamerData.isMusicOn){
        this.toggleSound();
    }
};

SoundManager.playBounce = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("bounce_sound");
    }
};

SoundManager.playGameOver = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("gameover_sound");
    }
};

SoundManager.playSuccess = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("success_sound");
    }
};

SoundManager.playCoinCatched = function(){
    if(SoundManager.playSounds || gameData.gamerData.isFxOn){
        createjs.Sound.play("coin_sound");
    }
};

/* globals UserData:true  */

var GameData = (function(){

    var self;

    function GameData(xmlPath){
        self = this;
        this.xmlPath = xmlPath;

        this.pauseGame = false;

        this.gamerData = this.getStoredGamerData();
        if(this.gamerData == null){
            this.gamerData = new UserData();
        }
        console.log(this.gamerData);
    }

    GameData.prototype.parse = function(){
        $.ajax({
            url: this.xmlPath,
            type: "GET",
            dataType: "xml",
            success:function(result){
                self.levelsData = result;
                $(self).trigger("parsed");
            }
        });
    };

    GameData.prototype.getLevelCount = function(){
        return self.levelsData.getElementsByTagName("levels")[0].childElementCount;
    };

    GameData.prototype.getLevel = function(i){
        return self.levelsData.getElementsByTagName("levels")[0].getElementsByTagName("level")[i];
    };

    GameData.prototype.getEggDataForLevel = function(i){
        return this.getLevel(i).getElementsByTagName("egg")[0];
    };

    GameData.prototype.getLevelInstructionsForLevel = function(i){
        return this.getLevel(i).getElementsByTagName("instruction");
    };

    GameData.prototype.getManifestForLevel = function(i){
        var manifest = [];
        $(this.getLevel(i)).find("*").each(function(i, obj){
            if($(obj).attr("img")!=null){
                manifest.push({src:$(obj).attr("img")});
            }
        });
        return manifest;
    };

    GameData.prototype.getStoredGamerData = function(){
        var data = localStorage.getItem("tjilp_game");
        if(data !== "undefined"){
            return JSON.parse(data);
        }
        return null;
    };

    GameData.prototype.didUserGetInstructionForLevel = function(i){
        if(!self.gamerData.givenInstructions){
            return false;
        }
        if(self.gamerData.givenInstructions[i]){
            return true;
        }
        return false;
    };

    GameData.prototype.storeGamerLevelData = function(level, stars){
        if(this.gamerData.levels[level] == null || this.gamerData.levels[level] < stars){ // level nog niet gespeeld of aantal sterren hoger dan vorige keer
            self.gamerData.levels[level] = stars;
            save();
        }
    };

    GameData.prototype.storeGamerInstructionGiven = function(level){
        self.gamerData.givenInstructions[level] = true;
        save();
    };

    GameData.prototype.storeSettings = function(){
        save();
    };

    GameData.prototype.resetStorage = function(){
        localStorage.setItem("tjilp_game","");
        localStorage.clear();
    };

    function save(){
        localStorage.setItem("tjilp_game",JSON.stringify(self.gamerData));
    }

    return GameData;

})();

var UserData = (function(){

    function UserData(){
        this.name = "Jonathan";
        this.id = 2304958271;

        this.levels = [];
        this.givenInstructions = [];
        this.isMusicOn = true;
        this.isFxOn = true;
    }

    return UserData;
})();

/* globals FB:true  */

window.fbAsyncInit = function() {
    FB.init({
        appId      : '596243747091537',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });


// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below
// will be handled.
/*FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs.
    if (response.status === 'connected') {
    // The response object is returned with a status field that lets the app know the current
    // login status of the person. In this case, we're handling the situation where they
    // have logged in to the app.
    testAPI();
    } else if (response.status === 'not_authorized') {
    // In this case, the person is logged into Facebook, but not into the app, so we call
    // FB.login() to prompt them to do so.
    // In real-life usage, you wouldn't want to immediately prompt someone to login
    // like this, for two reasons:
    // (1) JavaScript created popup windows are blocked by most browsers unless they
    // result from direct interaction from people using the app (such as a mouse click)
    // (2) it is a bad experience to be continually prompted to login upon page load.
    FB.login();
    } else {
    // In this case, the person is not logged into Facebook, so we call the login()
    // function to prompt them to do so. Note that at this stage there is no indication
    // of whether they are logged into the app. If they aren't then they'll see the Login
    // dialog right after they log in to Facebook.
    // The same caveats as above apply to the FB.login() call here.
    FB.login();
    }
});*/
};

// Load the SDK asynchronously
(function(d)
{
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful.
// This testAPI() function is only called in those cases.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
    });
}

function publishScoreToFB(level, stars){
    /*FB.api('/me/feed', 'post',{
       message:'Tjilp',
       name: 'Post name',
       description:'description'
    }, function(data){
        console.log(data);
    });*/
    FB.ui(
        {
            method: 'stream.publish',
            display:'popup',
            message: '',
            name: 'Tjilp',
            caption: 'Check out my score!',
            description: (
                'I got '+ stars +' stars on level '+level
                ),
            link: 'http://tjilp.be',
            picture: 'http://jnthn.be/GAP/img/tjilp-score.png'
        },
        function(response) {
            if (response && response.post_id) {
                //alert('Post was published.');
                console.log('Post was published');
            } else {
                //alert('Post was not published.');
                console.log('Post NOT published');
            }
        }
    );
}

/* globals Box2D:true  */
/* globals createjs:true  */
/* globals GameData:true  */
/* globals PreloadManager:true  */
/* globals SoundManager:true  */
/* globals GameContainer:true  */
/* globals Statistics:true  */
/* globals ScreenManager:true  */
/* globals StartScreen:true  */
/* globals LevelNest:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals GameOverScreen:true  */
/* globals PauseScreen:true  */
/* globals OptionsScreen:true  */
/* globals Bird:true  */


var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2MassData : Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
    b2DistanceJointDef : Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2BuoyancyController : Box2D.Dynamics.Controllers.b2BuoyancyController
};
var SCALE = 30;
var stage, world, debug, preload, gameData;

(function(){

    var self;

    function init(){
        self = this;

        stage = new createjs.Stage(document.getElementById("game"));
        stage.enableMouseOver();
        debug = document.getElementById('debug');
        this.width = stage.canvas.width;
        this.height = stage.canvas.height;
        this.levelStarted = false;
        this.collisionDetected = false;
        this.isPaused = true;
        this.keypressCount = 0;

        gameData = new GameData('data/game.xml');
        $(gameData).on("parsed", gameDataLoadedHandler);
        gameData.parse();

        setupPhysics();
        addListeners();
    }

    // ------------------- PHYSICS FUNCTIONS

    function setupPhysics(){

        // create world
        world = new box2d.b2World(new box2d.b2Vec2(0,20), true);

        // setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(debug.getContext('2d'));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.2);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

        var listener = new Box2D.Dynamics.b2ContactListener();
        listener.BeginContact = function(contact) {

            self.gameContainer.handleBeginContact(contact);

            var colliderA = contact.GetFixtureA().GetUserData();
            var colliderB = contact.GetFixtureB().GetUserData();
            //console.log("[MAIN] collision: ",contact.GetFixtureA().GetUserData(), contact.GetFixtureB().GetUserData());

            if(colliderA === "ground" || colliderB === "ground"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "rock" || colliderB === "rock"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "leaf" && colliderB === "bird" || colliderB === "bird" && colliderA === "leaf"){
                if(!self.collisionDetected){
                    // make leaf move a bit
                    SoundManager.playBounce();
                    self.stats.increaseBounce();
                }
            }
            else if(colliderA === "top-nest" || colliderB === "top-nest"){
                if(!self.collisionDetected){
                    self.gameContainer.bird.rest({x:self.gameContainer.nest.view.x, y:self.gameContainer.nest.view.y});
                    showNextLevelScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "tornado" || colliderB === "tornado"){
                self.gameContainer.bird.tornadoFly();
            }
            else if(colliderA === "enemyBird" || colliderB === "enemyBird"){
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "balloon" || colliderB === "balloon"){
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "miniTree" || colliderB === "miniTree"){
                showGameOverScreen();
                self.collisionDetected = true;
            }

            if(colliderA !== null && colliderB !== null){
                if(colliderA.indexOf("timeCoin") !== -1 || colliderB.indexOf("timeCoin") !== -1){
                    if(colliderA.indexOf("timeCoin") !== -1){
                        self.gameContainer.removeTimeCoinWithUserData(colliderA);
                    }
                    else{
                        self.gameContainer.removeTimeCoinWithUserData(colliderB);
                    }
                    self.gameContainer.view.addEventListener(GameContainer.COIN_REMOVED, catchedCoinHandler);
                }
            }
        };
        listener.EndContact = function(contact) {
            self.gameContainer.handleEndContact(contact);
        };
        /*listener.PostSolve = function(contact, impulse) {

        };
        listener.PreSolve = function(contact, oldManifold) {

        };*/
        world.SetContactListener(listener);
    }


    //**
    //
    //
    // --------------- STARTER FUNCTIONS

    function gameDataLoadedHandler(){
        self.preloadManager = new PreloadManager();
        self.preloadManager.view.addEventListener(PreloadManager.LOADING_DONE, preloadHandler);
        self.preloadManager.preloadGame();
    }

    function preloadHandler(e){
        if(self.preloadManager.isPreloadingGame){
            drawLevel();
            drawGameInfo();
            showStartScreen();

        }else{
            var instructionsData = gameData.getLevelInstructionsForLevel(self.stats.level);
            if(instructionsData.length > 0 && !gameData.didUserGetInstructionForLevel(self.stats.level)){
                drawLevel();
                showInstructionsScreen(instructionsData);
            }
            else{
                startGame();
            }
        }
    }

    function addListeners(){

        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        $(document).on("keydown",function(e){

            if(e.which >= 37 && e.which <= 39){
               self.keypressCount++;
                if(self.keypressCount > 3){
                    return;
                }
            }

            if(e.which === 32){
                launchEgg();
            }
            else if(e.which === 39){
                self.gameContainer.bird.moveRight();
            }
            else if(e.which === 37){
                self.gameContainer.bird.moveLeft();
            }
            else if(e.which === 38){
                self.gameContainer.bird.fly();
            }
            else if(e.which === 80){
                //self.isPaused = !self.isPaused;
                gameData.pauseGame = !gameData.pauseGame;
            }
        });
        $(document).on("keyup", function(){
            self.keypressCount = 0;
        });
    }

    //**
    //
    //
    // ------------------ MAIN DRAWING FUNCTIONS

    function drawGameInfo(){
        if(this.stats == null){
            createStatistics();
        }
        if(this.screenManager == null){
            createScreenManager();
        }
    }

    function drawLevel(){

        self.levelStarted = false;

        if(self.gameContainer == null){
            this.gameContainer = new GameContainer();
            stage.addChild(this.gameContainer.view);
        }

        this.gameContainer.resetContainer();

        var level=0;
        if(self.stats!=null){
            level = gameData.getLevel(self.stats.level);
            self.stats.leafsCount = $(level).find('leaf').length;
            self.stats.maxTime = $(level).attr("time");
        }

        $(level).find('background').each(function(i, obj){
            if(i<=0){
                $("#game").css('background-image','url('+$(obj).attr("img")+')');
            }
            else{
                self.gameContainer.createBackground($(obj).attr("img"));
            }
        });
        $(level).find('ground').each(function(i, obj){
            self.gameContainer.createGround($(obj).attr("img"), self.width/2, self.height - parseInt($(obj).attr("height")), self.width, parseInt($(obj).attr("height")));
        });
        $(level).find('tree').each(function(i, obj){
            self.gameContainer.createTree($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("width"), $(obj).attr("height"));
        });
        $(level).find('leaf').each(function(i, obj){
            self.gameContainer.createLeaf($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("rotation"), $(obj).attr("restitution"));
        });
        $(level).find('rock').each(function(i, obj){
            self.gameContainer.createRock($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("width"), $(obj).attr("height"));
        });
        $(level).find('tornado').each(function(i, obj){
            self.gameContainer.createTornado($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('enemyBird').each(function(i, obj){
            self.gameContainer.createEnemyBird($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('balloon').each(function(i, obj){
            self.gameContainer.createBalloon($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('egg').each(function(i, obj){
            self.gameContainer.createBird($(obj).attr("x"), $(obj).attr("y"));
            self.gameContainer.bird.setMaxRotations(gameData.getEggDataForLevel(self.stats.level).getAttribute("maxRotations"));
            self.gameContainer.bird.setEvolution(gameData.getEggDataForLevel(self.stats.level).getAttribute("evolution"));
        });
        $(level).find('nest').each(function(i, obj){
            self.gameContainer.createNest($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("start"));
        });
        $(level).find('miniTree').each(function(i, obj){
            self.gameContainer.createMiniTree( $(obj).attr("img"), $(obj).attr("x"));
        });
        $(level).find('branch').each(function(i, obj){
            self.gameContainer.createBranch( $(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('cloud').each(function(i, obj){
            self.gameContainer.createCloud($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('timeCoin').each(function(i, obj){
            self.gameContainer.createTimeCoin($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("worth"), i);
        });
    }


    //**
    //
    //
    // --------------- CREATE STATIC GAME INFO

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        this.stats.view.addEventListener(Statistics.LEVELS_CLICKED, showLevelsScreen);
        this.stats.view.addEventListener(Statistics.TIME_OUT, showGameOverScreen);
        this.stats.view.addEventListener(Statistics.PAUSE, showPauseScreen);
        stage.addChild(this.stats.view);
    }

    function createScreenManager(){
        this.screenManager = new ScreenManager();
        stage.addChild(this.screenManager.view);
    }


    //**
    //
    //
    // --------------- GAME NAVIGATION HANDLERS

    function showPauseScreen(){
        self.screenManager.showScreen(ScreenManager.PAUSE);
        self.screenManager.view.addEventListener(PauseScreen.LEVELS, function(e){
            showLevelsScreen(true);
        });
        self.screenManager.view.addEventListener(PauseScreen.RESUME, function(e){
            gameData.pauseGame = false;
        });
        self.screenManager.view.addEventListener(PauseScreen.PLAY_AGAIN, function(e){
            gameData.pauseGame = false;
            startGame();
        });
    }

    function showStartScreen(){
        self.screenManager.showScreen(ScreenManager.START);
        self.screenManager.view.addEventListener(StartScreen.START, function(e){
            showLevelsScreen(false);
        });
        self.screenManager.view.addEventListener(StartScreen.OPTIONS, function(e){
            showOptionsScreen();
        });
    }

    function showLevelsScreen(fromPause){
        if(!fromPause){
            self.isPaused = true;
        }
        self.screenManager.showLevelsScreen(fromPause);
        self.screenManager.view.addEventListener(LevelNest.LEVEL_SELECTED, function(e){
            gameData.pauseGame = false;
            self.stats.setLevel(e.levelIndex);
            preloadLevel(e.levelIndex);
        });
    }

    function showOptionsScreen(){
        self.isPaused = true;
        self.screenManager.showOptionsScreen();
        self.screenManager.view.addEventListener(OptionsScreen.SAVE, function(e){
            gameData.storeSettings();
        });
        self.screenManager.view.addEventListener(OptionsScreen.RESET_LEVELS, function(e){
            gameData.resetStorage();
        });
    }

    function preloadLevel(levelIndex){
        self.preloadManager.preloadLevel(gameData.getManifestForLevel(levelIndex));
    }

    function showInstructionsScreen(instructionsData){
        console.log(instructionsData);
        self.isPaused = true;
        self.screenManager.showInstructionsScreen(instructionsData);
        self.screenManager.view.addEventListener(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            gameData.storeGamerInstructionGiven(self.stats.level);
            startGame();
        });
    }

    function startGame(){
        drawLevel();
        self.isPaused = false;
        self.collisionDetected = false;
        self.stats.resetStats();
        self.stats.showStats();
        SoundManager.startSounds();
        self.gameContainer.showSpacebarInstruction();
    }

    function showGameOverScreen(){
        if(!self.isPaused){
            console.log("[MAIN] show game over screen");
            SoundManager.playGameOver();
            self.screenManager.showScreen(ScreenManager.GAME_OVER);
            self.screenManager.view.addEventListener(GameOverScreen.RESTART_LEVEL, restartLevelHandler);
            self.isPaused = true;
            self.gameContainer.bird.die();
            self.stats.hideStats();
        }
    }

    function showNextLevelScreen(){
        if(!self.isPaused){

            if(self.stats.level >= 2){
                self.screenManager.showScreen(ScreenManager.END);
            }else{
                SoundManager.playSuccess();
                gameData.storeGamerLevelData(this.stats.level, this.stats.getStars()); // KEEP GAMER DATA STORED
                self.isPaused = true;
                self.screenManager.showNextLevelScreen(this.stats.level, this.stats.getStars());
                self.screenManager.view.addEventListener(NextLevelScreen.NEXT_LEVEL, nextLevelHandler);
                self.screenManager.view.addEventListener(NextLevelScreen.PLAY_AGAIN, restartLevelHandler);
                self.stats.hideStats();
            }
        }
    }

    function restartLevelHandler(e){
        startGame();
        self.isPaused = false;
        self.collisionDetected = false;
    }

    function nextLevelHandler(e){
        self.stats.levelUp();
        preloadLevel(self.stats.level);
    }


    //**
    //
    //
    // --------------- EGG

    function launchEgg(){
        if(self.levelStarted || self.isPaused)
        {
            return;
        }
        self.gameContainer.removeSpacebarInstruction();
        this.gameContainer.bird.push();
        this.gameContainer.bird.view.addEventListener(Bird.DIED, function(){
           showGameOverScreen();
        });
        self.levelStarted = true;
    }

    function catchedCoinHandler(e){
        self.stats.earnTime();
        self.gameContainer.view.removeEventListener(GameContainer.COIN_REMOVED, catchedCoinHandler);
        SoundManager.playCoinCatched();
    }


    // --------------- TICK

    function tick(){
        stage.update();

        if(!gameData.pauseGame){
            world.DrawDebugData();
            world.Step(1/60, 10, 10);
            world.ClearForces();
        }
    }

    init();

})();




})();