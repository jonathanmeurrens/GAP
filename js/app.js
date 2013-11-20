/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */


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
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw
};
var SCALE = 30;
var stage, world;

(function(){


    //var former = console.log;
    console.log = function(msg){
        //former(msg);  //maintains existing logging via the console.
        $("#mylog").prepend("<div>" + msg + "</div>");
    }

    window.onerror = function(message, url, linenumber) {
        console.log("JavaScript error: " + message + " on line " +
            linenumber + " for " + url);
    }

    var self;


    function init(){
        self = this;

        stage = new createjs.Stage(document.getElementById("game"));

        setupPhysics();

        createGround();
        createNest();
        createLeafs();
        createBird();
        createStatistics();

        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;
    }

    function setupPhysics(){

        // create world
        world = new box2d.b2World(new box2d.b2Vec2(0,20), true);

        // setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(stage.canvas.getContext('2d'));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact) {
            //console.log(contact);
            var colliderA = contact.GetFixtureA().GetBody().GetUserData();
            var colliderB = contact.GetFixtureB().GetBody().GetUserData();
            //console.log("[App] BeginContact: "+colliderA + " collided with " + colliderB);

            if(colliderA == "ground" || colliderB=="ground"){
                console.log("[App] Game Over!");
            }
            else if(colliderA == "leaf" && colliderB == "bird" || colliderB=="bird" && colliderA=="leaf"){
                console.log("[App] "+contact.GetFixtureB().GetUserData());
            }
            else if(colliderA == "nest" || colliderB == "nest"){
                console.log("[App] Level up! ");
                self.stats.levelUp();
            }
        }
        listener.EndContact = function(contact) {
            //console.log("[App] EndContact: "+contact.GetFixtureB().GetBody().GetUserData() + " collided with " + contact.GetFixtureA().GetBody().GetUserData());
        }
        listener.PostSolve = function(contact, impulse) {

        }
        listener.PreSolve = function(contact, oldManifold) {

        }
        world.SetContactListener(listener);
    }

    function createGround(){
        var ground = new Ground(0,stage.canvas.height - 40, stage.canvas.width, 40);
        stage.addChild(ground.view);
    }

    function createLeafs(){
        var leaf = new Leaf(stage.canvas.width/4.5, stage.canvas.height/2, 20, 20);
        stage.addChild(leaf.view);
        var leaf2 = new Leaf(stage.canvas.width/1.5, stage.canvas.height/2, 20, 20);
        stage.addChild(leaf2.view);

        /*for(var i=0; i<3; i++){
            var leaf = new Leaf(Math.random() * 800, Math.random()*600, 20, 20);
            stage.addChild(leaf.view);
        }*/
    }

    function createBird(){
        var bird = new Bird(0, 0, 50, 50);
        stage.addChild(bird.view);
    }

    function createNest(){
        var nest = new Nest(stage.canvas.width-20, stage.canvas.height/4, 20, 20);
        stage.addChild(nest.view);
    }

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        stage.addChild(stats.view);
    }

    function tick(){
        //console.log("tick");
        stage.update();
        //world.DrawDebugData();
        world.Step(1/60, 10, 10);
        world.ClearForces();
    }

    init();

})();


