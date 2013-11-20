/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

var Bird = (function(){

    var self;

    function Bird(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.impulse = 40;

        this.view = new createjs.Bitmap("img/soccer.png");
        this.view.regX = this.view.regY = this.width/2; // put registration point in center

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.3;
        fixDef.restitution = 0;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = 'bird';

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData("bird");

        var circle1 = new box2d.b2CircleShape(this.width/2 / SCALE);
        fixDef.shape = circle1;
        fixDef.userData = "center-egg";
        this.view.body.CreateFixture(fixDef);

        var circle2 = new box2d.b2CircleShape(((this.width/2)-10) / SCALE);
        circle2.m_p.Set(0.8,0);
        fixDef.shape = circle2;
        fixDef.userData = "bottom-egg";
        this.view.body.CreateFixture(fixDef);

        var circle3 = new box2d.b2CircleShape(((this.width/2)-10) / SCALE);
        circle3.m_p.Set(-0.8,0);
        fixDef.shape = circle3;
        fixDef.userData = "top-egg";
        this.view.body.CreateFixture(fixDef);

        self = this;
        applyImpulse(self.view.body, -45, 30);

        $("body").on("keydown",function(e){
            console.log("[Bird] keycode: "+e.which);
            if(e.which == 39){ // naar rechts
                applyImpulse(self.view.body, -45, self.impulse);
            }
            else if(e.which == 37){ // naar links
                applyImpulse(self.view.body, 45, -self.impulse);
            }
            else if(e.which == 38){ // naar boven
                applyImpulse(self.view.body, -90, self.impulse);
            }
            else if(e.which == 40){ // naar beneden
                applyImpulse(self.view.body, -90, -self.impulse);
            }
        });

        $(this.view).on('tick', $.proxy( tick, this ));
    }

    function applyImpulse(body, degrees, power) {
        body.ApplyImpulse(new box2d.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
            Math.sin(degrees * (Math.PI / 180)) * power),
            body.GetWorldCenter());
    }

    function tick(e){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    }

    return Bird;

})();