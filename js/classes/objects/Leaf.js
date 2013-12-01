/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

var Leaf = (function(){

    var buoyancyController;

    function Leaf(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap("img/leaf.png");
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.4;
        fixDef.restitution = 0.8;
        //fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "leaf";

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

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        //this.view.body.SetLinearDamping(10);


        /*buoyancyController = new box2d.b2BuoyancyController();
        buoyancyController.normal.Set(0,-1);
        buoyancyController.offset=-180/SCALE;
        buoyancyController.useDensity=true;
        buoyancyController.density=2.0;
        buoyancyController.linearDrag=5;
        buoyancyController.angularDrag=2;
        world.AddController(buoyancyController);

        listenForContact();*/
        //buoyancyController.AddBody(fixDef.body);
        //this.view.body = world.CreateBody(bodyDef);
        //this.view.body.CreateFixture(fixDef);

        $(this.view).on('tick', $.proxy( tick, this ));
        //this.updateView();
    }

    function tick(e){
        this.updateView();
    }

    Leaf.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 20;
        this.view.y = this.view.body.GetPosition().y * SCALE - 20;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    }

    function listenForContact(){
        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact){
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if(fixtureA.IsSensor()){
                var bodyB = fixtureB.GetBody();
                if(!bodyB.GetControllerList()) buoyancyController.AddBody(bodyB);
            }else if(fixtureB.IsSensor()){
                var bodyA = fixtureA.GetBody();
                if(!bodyA.GetControllerList()) buoyancyController.AddBody(bodyA);
            }
        }
        listener.EndContact = function(contact){
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if(fixtureA.IsSensor()){
                var bodyB = fixtureB.GetBody();
                console.log(bodyB);
                if(bodyB.GetControllerList()) buoyancyController.RemoveBody(bodyB);
            }else if(fixtureB.IsSensor()){
                var bodyA = fixtureA.GetBody();
                if(bodyA.GetControllerList()) buoyancyController.RemoveBody(bodyA);
            }
        }
        world.SetContactListener(listener);
    }

    return Leaf;

})();