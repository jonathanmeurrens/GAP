/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 01/12/13
 * Time: 21:59
 * To change this template use File | Settings | File Templates.
 */

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
    }

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
            //console.log("contact with cloud" + bodyB);
            if(!bodyB.GetControllerList()) buoyancyController.AddBody(bodyB);
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            //console.log("contact with cloud" + bodyA);
            if(!bodyA.GetControllerList()) buoyancyController.AddBody(bodyA);
        }
    }

    Cloud.prototype.handleEndContact = function(contact){
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        if(fixtureA.IsSensor()){
            var bodyB = fixtureB.GetBody();
            //console.log("end contact with cloud" + bodyB);
            if(bodyB.GetControllerList()) buoyancyController.RemoveBody(bodyB);
        }else if(fixtureB.IsSensor()){
            var bodyA = fixtureA.GetBody();
            //console.log("end contact with cloud" + bodyA);
            if(bodyA.GetControllerList()) buoyancyController.RemoveBody(bodyA);
        }
    }

    return Cloud;

})();