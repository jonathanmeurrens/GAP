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

         //buoyancyController = new box2d.b2BuoyancyController();
         //buoyancyController.normal.Set(0,-1);
         //buoyancyController.offset=-180/SCALE;
         //buoyancyController.useDensity=true;
         //buoyancyController.density=2.0;
         /*buoyancyController.linearDrag=5;
         buoyancyController.angularDrag=2;*/
         //world.AddController(buoyancyController);

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