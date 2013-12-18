(function(){

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
        this.backgrounds = [];
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
        for(var m=0; m < this.backgrounds.length; m++){
            var background = this.backgrounds[m];
            this.view.removeChild(background.view);
            this.backgrounds.splice(m,1);
        }
        this.removeBird();
        this.removeGround();
        this.removeNest();
        //this.removeBackground();
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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 09/12/13
 * Time: 21:21
 * To change this template use File | Settings | File Templates.
 */

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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 18/12/13
 * Time: 21:05
 * To change this template use File | Settings | File Templates.
 */

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Balloon = (function(){

    function Balloon(x, y, width, height, direction){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("balloon"));
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

        var circle1 = new box2d.b2CircleShape(this.width/3 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "balloon";
        this.view.body.CreateFixture(fixDef);

        if(direction === "right"){
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(1,0));
            this.view.scaleX = -1;
        }else{
            this.view.body.SetLinearVelocity(new box2d.b2Vec2(-1,0));
        }

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.updateView();
    }

    Balloon.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 70;
        this.view.y = this.view.body.GetPosition().y * SCALE - 60;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    return Balloon;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Bird = (function(){

    var self;

    function Bird(x, y, width, height){

        self = null;
        self = this;

        // EVENT TYPES
        Bird.DIED = "DIED";

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.impulse = 10;
        this.maxRotations = 0;
        this.evolution = 0;
        this.isDead = false;

        //this.view = new createjs.Bitmap("img/egg.png");
        //this.view.regX = this.view.regY = this.width/2; // put registration point in center

        this.view = new createjs.Container();
        var data = {
            images: ["img/egg-spritesheet.png"],
            frames: {width:51, height:55},
            animations: {one:[0], two:[1], three:[2], fly:[3,4,5,6]}
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
        //bodyDef.fixedRotation = true;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("bird");

        var circle1 = new box2d.b2CircleShape(this.width/2 / SCALE);
        circle1.m_p.Set(0,0.5);
        fixDef.shape = circle1;
        fixDef.userData = "center-egg";
        this.view.body.CreateFixture(fixDef);

        var circle3 = new box2d.b2CircleShape(((this.width/2)-2) / SCALE);
        circle3.m_p.Set(0,0);
        fixDef.shape = circle3;
        fixDef.userData = "top-egg";
        this.view.body.CreateFixture(fixDef);

        //this.push();

       /*$("body").on("keyup",function(e){
            console.log("[Bird] keycode: "+e.which);
            if(e.which === 39){ // naar rechts


                var angle = 90.0 //or whatever you angle is
                var pos = self.view.body.GetPosition();
                self.view.body.SetTransform( self.view.body.GetPosition(), angle );
                self.view.body.SetTransform( self.view.body.GetPosition(), 30 );
                self.view.body.SetPositionAndAngle(self.view.body.GetPosition(), self.view.body.GetAngle()+1);

                self.view.body.ApplyAngularImpulse(1500);
                self.view.body.SetLinearDamping(10);
            }
            else if(e.which === 37){ // naar links
            }
            else if(e.which === 38){ // naar beneden
            }
            else if(e.which == 38){ // naar boven
                self.view.body.ApplyTorque(80);
                applyImpulse(self.view.body, -90, self.impulse);
            }
            else if(e.which == 40){ // naar beneden
                applyImpulse(self.view.body, -90, -self.impulse);
            }
        });*/

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = (this.view.body.GetAngle()) * (180 / Math.PI);

        if(!self.isDead && (this.view.rotation/360 > this.maxRotations && !this.isDead)){
            birdDied();
        }

        if(!self.isDead && (this.view.x > stage.canvas.width || this.view.x < 0 || this.view.y > stage.canvas.height)){
            birdDied();
        }
    }

    function birdDied(){
        var event = new createjs.Event(Bird.DIED);
        self.view.dispatchEvent(event);
        self.isDead = true;
    }

    Bird.prototype.push = function(){
        //this.view.body.type = box2d.b2Body.b2_dynamicBody;
        this.view.body.SetType(box2d.b2Body.b2_dynamicBody);
        applyImpulse(self.view.body, -45, 20);
        //this.view.body.SetAngularVelocity(0);
    };

    Bird.prototype.moveRight = function(){
        applyImpulse(self.view.body, -5, self.impulse);
        self.view.body.ApplyTorque(self.impulse/2);
    };

    Bird.prototype.moveLeft = function(){
        self.view.body.ApplyTorque(-self.impulse/2);
        applyImpulse(self.view.body, 5, -self.impulse);
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
        applyImpulse(self.view.body, -90, 20);
    };

    Bird.prototype.rest = function(){
        this.view.body.SetType(box2d.b2Body.b2_staticBody);
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
            default :
                this.sprite.gotoAndStop("one");
        }
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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 01/12/13
 * Time: 21:59
 * To change this template use File | Settings | File Templates.
 */

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Cloud = (function(){

    var buoyancyController;

    function Cloud(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("cloud"));
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

        var circle1 = new box2d.b2CircleShape(this.width/3 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "cloud-part-one";
        this.view.body.CreateFixture(fixDef);

        var circle2 = new box2d.b2CircleShape(((this.width/3)-10) / SCALE);
        circle2.m_p.Set(2,0);
        fixDef.shape = circle2;
        fixDef.userData = "cloud-part-two";
        this.view.body.CreateFixture(fixDef);

        var circle3 = new box2d.b2CircleShape(((this.width/3)-6) / SCALE);
        circle3.m_p.Set(-2,0);
        fixDef.shape = circle3;
        fixDef.userData = "cloud-part-three";
        this.view.body.CreateFixture(fixDef);

        //applyImpulse(this.view.body, 0, 200);
        this.view.body.SetLinearVelocity(new box2d.b2Vec2(0.5,0));
        //this.view.body.SetLinearDamping(10);


         buoyancyController = new box2d.b2BuoyancyController();
         buoyancyController.normal.Set(0,-1);
         //buoyancyController.offset=-180/SCALE;
         buoyancyController.useDensity=true;
         buoyancyController.density=2.0;
         /*buoyancyController.linearDrag=5;
         buoyancyController.angularDrag=2;*/
         world.AddController(buoyancyController);


        $(this.view).on('tick', $.proxy( tick, this ));
        //this.updateView();
    }

    function tick(e){
        this.updateView();
    }

    Cloud.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 70;
        this.view.y = this.view.body.GetPosition().y * SCALE - 60;
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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 18/12/13
 * Time: 20:38
 * To change this template use File | Settings | File Templates.
 */

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var EnemyBird = (function(){

    function EnemyBird(x, y, width, height, direction){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("enemyBird"));
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
        bodyDef.userData = 'enemyBird';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("enemyBird");

        var circle1 = new box2d.b2CircleShape(this.width/3 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "enemy";
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
        this.updateView();
    }

    EnemyBird.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 70;
        this.view.y = this.view.body.GetPosition().y * SCALE - 60;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    return EnemyBird;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

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
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
    }

    return Ground;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */

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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */
/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Nest = (function(){

    function Nest(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("nest"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

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

        this.updateView();
        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    Nest.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 25;
        this.view.y = this.view.body.GetPosition().y * SCALE - 10;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Nest;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/11/13
 * Time: 14:39
 * To change this template use File | Settings | File Templates.
 */
/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Rock = (function(){

    function Rock(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("rock"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 1;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "rock";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    Rock.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 20;
        this.view.y = this.view.body.GetPosition().y * SCALE - 20;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Rock;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 22:03
 * To change this template use File | Settings | File Templates.
 */

/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Tornado = (function(){

    function Tornado(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("tornado"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 1;
        fixDef.isSensor = true;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "tornado";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        //this.view.body.SetLinearDamping(10);

        this.updateView();
        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    Tornado.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 20;
        this.view.y = this.view.body.GetPosition().y * SCALE - 20;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Tornado;

})();

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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:58
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */

var LevelNest = (function(){

    var self;

    function LevelNest(levelIndex, starsCount, isPlayable){

        self = this;

        // EVENT TYPE
        LevelNest.LEVEL_SELECTED = "LEVEL_SELECTED";

        this.levelIndex = levelIndex;
        this.starsCount = starsCount;
        this.isPlayable = isPlayable;

        this.view = new createjs.Container();

        var backgroundColor = new createjs.Shape();
        backgroundColor.graphics.beginFill(createjs.Graphics.getRGB(200,200,200));
        backgroundColor.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        backgroundColor.mouseEnabled = false;

        this.view.addChild(backgroundColor);

        var nest = new createjs.Bitmap("img/nest.png");
        this.view.addChild(nest);

        if(this.starsCount != null && this.starsCount > 0){
            var stars = new createjs.Bitmap("img/stars_"+this.starsCount+".png");
            this.view.addChild(stars);
        }

        this.view.on("click", $.proxy( clickHandler, this ));
    }

    function clickHandler(e){
        var event = new createjs.Event(LevelNest.LEVEL_SELECTED, true);
        event.levelIndex =  this.levelIndex;
        self.view.dispatchEvent(event);
    }

    return LevelNest;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals SoundManager:true  */

var Statistics = (function(){

    var self;

    function Statistics(x, y){

        self = this;

        Statistics.LEVELS_CLICKED = "LEVELS_CLICKED";

        this.view = new createjs.Container();
        this.view.x = x;
        this.view.y = y;

        this.stars = 1;
        this.level = 0;
        this.bounces = 1;
        this.leafsCount = 1;

        // LEVEL IND
        this.levelTxt = new createjs.Text("", "14px Arial", "#000000");
        this.view.addChild(this.levelTxt);

        // STARS IND
        var stars_data = {
            images: ["img/stars-spritesheet.png"],
            frames: {width:76, height:20},
            animations: {none:[3], one:[0], two:[1], three:[2]}
        };
        var spritesheet = new createjs.SpriteSheet(stars_data );
        this.starsSprite = new createjs.Sprite(spritesheet, "none");
        this.view.addChild(this.starsSprite);

        // SOUND MUTE
        var mute_data = {
            images: ["img/mute-spritesheet.png"],
            frames: {width:50, height:50},
            animations: {on:[0], mute:[1]}
        };
        var muteBtnspritesheet = new createjs.SpriteSheet(mute_data);
        this.muteBtnSprite = new createjs.Sprite(muteBtnspritesheet, "on");
        this.view.addChild(this.muteBtnSprite);
        this.muteBtnSprite.addEventListener("click", function(e){
            console.log("[Statistics] mute sound");
            SoundManager.togglePlayBackgroundMusic();
            if(SoundManager.isPlayingMusic){
                self.muteBtnSprite.gotoAndStop("on");
            }else{
                self.muteBtnSprite.gotoAndStop("mute");
            }
        });


        // LEVELS PANEL BTN
        var levelsBtn_data = {
            images: ["img/mute-spritesheet.png"],
            frames: {width:50, height:50},
            animations: {on:[0], mute:[1]}
        };
        var levelsBtnspritesheet = new createjs.SpriteSheet(levelsBtn_data);
        this.levelsBtnSprite = new createjs.Sprite(levelsBtnspritesheet, "on");
        this.levelsBtnSprite.x = 100;
        this.view.addChild(this.levelsBtnSprite);
        this.levelsBtnSprite.addEventListener("click", function(e){
            var event = new createjs.Event(Statistics.LEVELS_CLICKED);
            self.view.dispatchEvent(event);
        });

        updateStats();
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

    /*Statistics.prototype.starUp = function(){
        if(this.stars <= 2){
            this.stars++;
            updateStats();
        }
    };

    Statistics.prototype.starDown = function(){
        this.stars--;
        updateStats();
    };*/

    Statistics.prototype.increaseBounce = function(){
        this.bounces++;
        console.log("[bounces] "+this.bounces);
        updateStats();
    };

    Statistics.prototype.resetBounces = function(){
        this.bounces = 1;
    };

    Statistics.prototype.getStars = function(){
        return (self.bounces / self.leafsCount) * 3;
    };

    function updateStats(){

        self.levelTxt.text = "level: " + (self.level + 1);

        var frame = "none";
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
        self.starsSprite.gotoAndStop(frame);
    }

    return Statistics;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:31
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */

var GameOverScreen = (function(){

    var self;

    function GameOverScreen(){

        self = this;
        this.width = 500;
        this.height = 400;

        // EVENT TYPES
        GameOverScreen.RESTART_LEVEL = "RESTART_LEVEL";

        this.screenType = ScreenManager.GAME_OVER;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(255,0,0));
        colorPanel.graphics.drawRect(this.width/2, this.height/2 - 100, this.width , this.height);
        colorPanel.mouseEnabled = true;

        this.view.addChild(colorPanel);

        colorPanel.addEventListener("click", restartHandler);
    }

    function restartHandler(e){
        var event = new createjs.Event(GameOverScreen.RESTART_LEVEL, true);
        self.view.dispatchEvent(event);
    }

    return GameOverScreen;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:32
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */

var InstructionsScreen = (function(){

    var self;

    function InstructionsScreen(instructionsData){

        self = this;

        // EVENT TYPES
        InstructionsScreen.INSTRUCTIONS_DONE = "INSTRUCTIONS_DONE";

        this.instructionsData = instructionsData;
        this.currentInstruction = 0;
        this.screenType = ScreenManager.INSTRUCTIONS;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,255));
        colorPanel.graphics.drawRect(0,0,200,200);

        this.view.addChild(colorPanel);
        showNextInstruction();
        colorPanel.addEventListener("click",function(e){
            showNextInstruction();
        });
    }

    function showNextInstruction(){
        //console.log(self.instructionsData);
        if(self.currentInstruction < self.instructionsData.length){
            removeCurrentInstruction();
            self.instructionImg = new createjs.Bitmap("img/instructions/instruction-"+$(self.instructionsData[self.currentInstruction]).attr("img"));
            self.view.addChild(self.instructionImg);
            //console.log($(self.instructionsData[self.currentInstruction]).attr("img"));
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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 18:00
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals LevelNest:true  */

var LevelsScreen = (function(){

    var self;

    function LevelsScreen(gameData){

        self = this;

        this.gameData = gameData;
        this.screenType = ScreenManager.LEVELS;
        this.view = new createjs.Container();

        $("body").on("keydown",function(e){
            console.log("[LevelsScreen] keycode: "+e.which);
            if(e.which === 49){ //1
                levelSelected(0);
            }
            else if(e.which === 50){ //2
                levelSelected(1);
            }
            else if(e.which === 222){ //3
                levelSelected(2);
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
        for(var i=0; i < this.gameData.getLevelCount(); i++){
            var nest = new LevelNest(i,this.gameData.gamerData.levels[i],true);
            nest.view.x = i*130;
            self.view.addChild(nest.view);
        }
    }

    return LevelsScreen;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 21:39
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals publishScoreToFB:true  */

var NextLevelScreen = (function(){

    var self;

    function NextLevelScreen(){

        self = this;

        // EVENT TYPES
        NextLevelScreen.NEXT_LEVEL = "NEXT_LEVEL";

        this.screenType = ScreenManager.NEXT_LEVEL;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,255,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        this.view.addChild(colorPanel);
        colorPanel.addEventListener("click", nextLevelHandler);

        var postOnFb = new createjs.Bitmap('img/post-on-fb-btn.png');
        postOnFb.x = stage.canvas.width/2 - Math.round(57/2);
        postOnFb.y = stage.canvas.height/2 - Math.round(18/2);
        postOnFb.addEventListener("click", postOnFbHandler);
        this.view.addChild(postOnFb);

        var assetsPath = "img/";

        var manifest = [];

        /*var manifest = [
            {src:"egg-spritesheet.png", id:"egg-spritesheet"},
            {src:"cloud.png", id:"cloud"},
            {src:"grass.png", id:"grass"},
            {src:"leaf.png", id:"leaf"},
            {src:"nest.png", id:"nest"},
            {src:"rock.png", id:"rock"},
            {src:"stars-spritesheet.png", id:"stars-spritesheet"},
            {src:"bounce.mp3", id:"bounce_sound"},
            {src:"music.mp3|music.ogg", id:"music"},
            {src:"gameover.mp3|gameover.ogg", id:"gameover_sound"},
            {src:"success.mp3|success.ogg", id:"success_sound"}
        ];

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", handleComplete);
        preload.addEventListener("fileload", handleFileLoad);
        preload.addEventListener("error", handleError);
        preload.loadManifest(manifest, true, assetsPath);*/

        // TEMP
        $("body").on("keydown", function(e){
            if(e.which === 13){
                nextLevelHandler(e);
            }
        });
    }

    function nextLevelHandler(e){
        var event = new createjs.Event(NextLevelScreen.NEXT_LEVEL, true);
        self.view.dispatchEvent(event);
    }

    function postOnFbHandler(e){
        console.log("[NextLevelScreen] post on fb");
        publishScoreToFB(1,3);
    }

    return NextLevelScreen;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/11/13
 * Time: 20:21
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals preload:true  */

var StartScreen = (function(){

    var self;

    function StartScreen(){

        self = this;

        // EVENT TYPES
        StartScreen.START = "START";

        this.screenType = ScreenManager.START;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(255,255,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width, stage.canvas.height);
        this.view.addChild(colorPanel);

        this.progressEgg = new createjs.Bitmap('img/egg.png');
        this.progressEgg.regX = 41/2;
        this.progressEgg.regY = 56/2;
        this.progressEgg.x = stage.canvas.width/2;
        this.progressEgg.y = stage.canvas.height/2;
        this.view.addChild(this.progressEgg);

        var assetsPath = "img/";

        var manifest = [
            {src:"egg-spritesheet.png", id:"egg-spritesheet"},
            {src:"cloud.png", id:"cloud"},
            {src:"grass.png", id:"grass"},
            {src:"leaf.png", id:"leaf"},
            {src:"nest.png", id:"nest"},
            {src:"rock.png", id:"rock"},
            {src:"balloon.png", id:"balloon"},
            {src:"enemyBird.png", id:"enemyBird"},
            {src:"stars-spritesheet.png", id:"stars-spritesheet"},
            {src:"mute-spritesheet.png", id:"mute-spritesheet"},
            {src:"bounce.mp3", id:"bounce_sound"},
            {src:"music.mp3|music.ogg", id:"music"},
            {src:"gameover.mp3|gameover.ogg", id:"gameover_sound"},
            {src:"success.mp3|success.ogg", id:"success_sound"}
        ];

        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", handleComplete);
        preload.addEventListener("fileload", handleFileLoad);
        preload.addEventListener("error", handleError);
        preload.loadManifest(manifest, true, assetsPath);

        // Use this instead to use tag loading
        //preload = new createjs.PreloadJS(false);

        colorPanel.addEventListener("click", startHandler);
    }

    // -------- START CLICKED

    function startHandler(e){
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    }

     // ------- PRELOADING

    function handleProgress(event) {
        //bar.scaleX = event.loaded * loaderWidth;
        console.log(event.loaded);
        self.progressEgg.rotation = event.loaded * 180;
    }

    function handleFileLoad(event) {
        //console.log(event);
    }

    function handleComplete(e) {
        console.log("preloading complete!");
        var event = new createjs.Event(StartScreen.START, true);
        self.view.dispatchEvent(event);
    }

    function handleError(event){
        console.log("[StartScreen] error preload!"+event);
    }

    return StartScreen;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 09/12/13
 * Time: 22:44
 * To change this template use File | Settings | File Templates.
 */


/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:48
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals StartScreen:true  */
/* globals GameOverScreen:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals LevelsScreen:true  */
/* globals LevelNest:true  */

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
    }

    ScreenManager.prototype.showScreen = function(screenType){

        if(this.screen != null){
            return;
        }

        if(screenType === ScreenManager.GAME_OVER){
            this.screen = new GameOverScreen();
            this.screen.view.on(GameOverScreen.RESTART_LEVEL, function(e){
                console.log("[ScreenManager] RESTART LEVEL");
                    self.removeScreen();
            });
        }
        else if(screenType === ScreenManager.INSTRUCTIONS){
            this.screen = new InstructionsScreen();
        }
        /*else if(screenType == ScreenManager.NEXT_LEVEL){
            this.screen = new NextLevelScreen();
            this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
                console.log("[ScreenManager] NEXT LEVEL");
                self.removeScreen();
            });
        }*/
        else if(screenType === ScreenManager.START){
            this.screen = new StartScreen();
            this.screen.view.on(StartScreen.START, function(e){
                console.log("[ScreenManager] START");
                self.removeScreen();
            });
        }
        this.view.addChild(this.screen.view);
        console.log("[ScreenManager] added screen "+screenType);
    };

    ScreenManager.prototype.showLevelsScreen = function(gameData){
        this.screen = new LevelsScreen(gameData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(LevelNest.LEVEL_SELECTED, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showInstructionsScreen = function(instructionsData){
        this.screen = new InstructionsScreen(instructionsData);
        this.view.addChild(this.screen.view);
        this.screen.view.on(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.removeScreen();
        });
    };

    ScreenManager.prototype.showNextLevelScreen = function(){
        this.screen = new NextLevelScreen();
        this.view.addChild(this.screen.view);
        this.screen.view.on(NextLevelScreen.NEXT_LEVEL, function(e){
            console.log("[ScreenManager] NEXT LEVEL");
            self.removeScreen();
        });
    };

    ScreenManager.prototype.removeScreen = function(){
        if(this.screen != null){
            this.view.removeChild(this.screen.view);
            this.screen = null;
        }
    };

    return ScreenManager;
})();


/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 08/12/13
 * Time: 11:34
 * To change this template use File | Settings | File Templates.
 */

/* globals createjs:true  */

function SoundManager(){}

SoundManager.isPlayingMusic = false;
SoundManager.backgroundMusicInstance = null;
SoundManager.playSounds = false;

SoundManager.playBounce = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("bounce_sound");
    }
};

SoundManager.togglePlayBackgroundMusic = function(){
    if(SoundManager.playSounds){
        if(!SoundManager.isPlayingMusic){
            // play
            if(SoundManager.backgroundMusicInstance == null){
                SoundManager.backgroundMusicInstance = createjs.Sound.play("music", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
            }
            else{
                SoundManager.backgroundMusicInstance.setMute(false);
            }
        }else{
            // stop
            SoundManager.backgroundMusicInstance.setMute(true);
        }
        SoundManager.isPlayingMusic = !SoundManager.isPlayingMusic;
    }
};

SoundManager.playGameOver = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("gameover_sound");
    }
};

SoundManager.playSuccess = function(){
    if(SoundManager.playSounds){
        createjs.Sound.play("success_sound");
    }
};

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/11/13
 * Time: 15:23
 * To change this template use File | Settings | File Templates.
 */

/* globals UserData:true  */

var GameData = (function(){

    var self;

    function GameData(xmlPath){
        self = this;
        this.xmlPath = xmlPath;

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

    GameData.prototype.getAssetsToPreloadForLevel = function(i){
        console.log(this.getLevel(i).getElementsByTagName("instruction"));
        return this.getLevel(i).getElementsByTagName("instruction");
    };

    GameData.prototype.getStoredGamerData = function(){
        var data = localStorage.getItem("tjilp_game");
        if(data !== "undefined"){
            return JSON.parse(data);
        }
        return null;
    };

    GameData.prototype.didUserGetInstructionForLevel = function(i){
        //console.log("[GameData] didUserGetInstructionForLevel: "+self.gamerData.givenInstructions[i]);
        if(!self.gamerData.givenInstructions){
            return false;
        }
        if(self.gamerData.givenInstructions[i]){
            return true;
        }
        return false;
        //console.log(self.gamerData.givenInstructions[i]);
        //return self.gamerData.givenInstructions[i]?true:false;
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

    function save(){
        localStorage.setItem("tjilp_game",JSON.stringify(self.gamerData));
    }

    return GameData;

})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 01/12/13
 * Time: 11:07
 * To change this template use File | Settings | File Templates.
 */

var UserData = (function(){

    function UserData(){
        this.name = "Jonathan";
        this.id = 2304958271;

        this.levels = [];
        this.givenInstructions =[];
    }

    return UserData;
})();

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 01/12/13
 * Time: 10:55
 * To change this template use File | Settings | File Templates.
 */

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
                'I got'+ stars +' stars on level '+level
                ),
            link: 'http://tjilp.be',
            picture: 'http://www.baatsontwerp.nl/Styles/img/portfolio/illustraties/Tjilp/tjilp_web.jpg'
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

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */


/* globals Box2D:true  */
/* globals createjs:true  */
/* globals GameData:true  */
/* globals SoundManager:true  */
/* globals GameContainer:true  */
/* globals Statistics:true  */
/* globals ScreenManager:true  */
/* globals StartScreen:true  */
/* globals LevelNest:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals GameOverScreen:true  */
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
var stage, world, debug, preload;

(function(){

    var self;

    function init(){
        self = this;

        stage = new createjs.Stage(document.getElementById("game"));
        debug = document.getElementById('debug');
        this.width = stage.canvas.width;
        this.height = stage.canvas.height;
        this.levelStarted = false;
        this.collisionDetected = false;
        this.isPaused = true;

        this.gameData = new GameData('data/game.xml');
        $(this.gameData).on("parsed", gameDataLoadedHandler);
        this.gameData.parse();

        setupPhysics();
    }

    // ------------------- START UP FUNCTIONS

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

            var colliderA = contact.GetFixtureA().GetBody().GetUserData();
            var colliderB = contact.GetFixtureB().GetBody().GetUserData();

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
                    console.log("[APP] leaf collided "+colliderA, colliderB);
                    SoundManager.playBounce();
                    self.stats.increaseBounce();
                }
            }
            else if(colliderA === "nest" || colliderB === "nest"){
                if(!self.collisionDetected){
                    self.gameContainer.bird.rest();
                    showNextLevelScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "tornado" || colliderB === "tornado"){
                console.log("[APP] egg passed tornado");
                self.gameContainer.bird.tornadoFly();
            }
            else if(colliderA === "enemyBird" || colliderB === "enemyBird"){
                console.log("[APP] egg collided with enemybird");
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "balloon" || colliderB === "balloon"){
                console.log("[APP] egg collided with balloon");
                showGameOverScreen();
                self.collisionDetected = true;
            }
        };
        listener.EndContact = function(contact) {
            self.gameContainer.handleEndContact(contact);
        };
        listener.PostSolve = function(contact, impulse) {

        };
        listener.PreSolve = function(contact, oldManifold) {

        };
        world.SetContactListener(listener);
    }


    // --------------- STARTER FUNCTIONS

    function gameDataLoadedHandler(){

        drawLevel();
        addListeners();
        drawGameInfo();

        //showLevelsScreen();
        showStartScreen();
    }

    function addListeners(){

        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        $(document).on("keyup",function(e){
            console.log("[APP] keycode: "+e.which);
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
        });
    }

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
            level = self.gameData.getLevel(self.stats.level);
            self.stats.resetBounces();
            self.stats.leafsCount = $(level).find('leaf').length;
        }

        $(level).find('background').each(function(i, obj){
            self.gameContainer.createBackground($(obj).attr("img"));
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
        $(level).find('nest').each(function(i, obj){
            self.gameContainer.createNest($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('rock').each(function(i, obj){
            self.gameContainer.createRock($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('tornado').each(function(i, obj){
            self.gameContainer.createTornado($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('cloud').each(function(i, obj){
            self.gameContainer.createCloud($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('enemyBird').each(function(i, obj){
            self.gameContainer.createEnemyBird($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('balloon').each(function(i, obj){
            self.gameContainer.createBalloon($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('egg').each(function(i, obj){
            self.gameContainer.createBird($(obj).attr("x"), $(obj).attr("y"));
            self.gameContainer.bird.setMaxRotations(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("maxRotations"));
            self.gameContainer.bird.setEvolution(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("evolution"));
        });
    }


    // --------------- CREATE STATIC GAME INFO

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        this.stats.view.addEventListener(Statistics.LEVELS_CLICKED, showLevelsScreen);
        stage.addChild(this.stats.view);
    }

    function createScreenManager(){
        this.screenManager = new ScreenManager();
        stage.addChild(this.screenManager.view);
    }


    // --------------- GAME NAVIGATION HANDLERS

    function showStartScreen(){
        self.screenManager.showScreen(ScreenManager.START);
        self.screenManager.view.on(StartScreen.START, function(e){
            showLevelsScreen();
        });
    }

    function showLevelsScreen(){
        self.isPaused = true;
        self.screenManager.showLevelsScreen(self.gameData);
        self.screenManager.view.on(LevelNest.LEVEL_SELECTED, function(e){
            self.stats.setLevel(e.levelIndex);
            drawLevel();
            var instructionsData = self.gameData.getLevelInstructionsForLevel(self.stats.level);
            if(instructionsData.length > 0 && !self.gameData.didUserGetInstructionForLevel(self.stats.level)){
                console.log("[APP] show instructions");
                showInstructionsScreen(instructionsData);
            }
            else{
                console.log("[APP] start game");
                startGame();
            }
        });
    }

    function showInstructionsScreen(instructionsData){
        console.log(instructionsData);
        self.isPaused = true;
        self.screenManager.showInstructionsScreen(instructionsData);
        //self.screenManager.showLevelsScreen(self.gameData);
        self.screenManager.view.on(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            console.log("[APP] instructions done!");
            self.gameData.storeGamerInstructionGiven(self.stats.level);
            startGame();
        });
    }

    function startGame(){
        self.isPaused = false;
        SoundManager.togglePlayBackgroundMusic();
    }

    function showGameOverScreen(){
        SoundManager.playGameOver();
        self.screenManager.showScreen(ScreenManager.GAME_OVER);
        self.screenManager.view.on(GameOverScreen.RESTART_LEVEL, restartLevelHandler);
    }

    function showNextLevelScreen(){
        SoundManager.playSuccess();
        self.gameData.storeGamerLevelData(this.stats.level, this.stats.getStars()); // KEEP GAMER DATA STORED
        console.log("[stars] "+this.stats.getStars());
        self.screenManager.showNextLevelScreen();
        self.screenManager.view.on(NextLevelScreen.NEXT_LEVEL, nextLevelHandler);
    }

    function launchEgg(){
        console.log("[APP] game paused: " + self.isPaused);
        if(self.levelStarted || self.isPaused)
        {
            return;
        }
        this.gameContainer.bird.push();

        this.gameContainer.bird.view.on(Bird.DIED, function(){
            console.log("[APP] bird died");
            showGameOverScreen();
        });
        self.levelStarted = true;
    }

    function restartLevelHandler(e){
        drawLevel();
        self.collisionDetected = false;
    }

    function nextLevelHandler(e){
        self.stats.levelUp();
        drawLevel();
        self.collisionDetected = false;
    }


    // --------------- TICK

    function tick(){
        if(this.levelStarted){
            if(this.gameContainer.bird.view.y  < 80){
                stage.y = - this.gameContainer.bird.view.y + 80;
            }
            else{
                stage.y=0;
            }
        }
        stage.update();
        world.DrawDebugData();
        world.Step(1/60, 10, 10);
        world.ClearForces();
    }

    init();

})();




})();