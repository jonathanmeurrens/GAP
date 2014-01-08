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