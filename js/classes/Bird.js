/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

var Bird = (function(){

    function Bird(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap("img/soccer.png");
        this.view.regX = this.view.regY = this.width/2; // put registration point in center

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.5;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        fixDef.shape = new box2d.b2CircleShape(this.width/2 / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        /*var wind = new box2d.b2Vec2(1000,0);
        this.view.body.ApplyForce(wind,this.view.body.GetWorldCenter());*/

        applyImpulse(this.view.body, -45, 100);

        /*var angle = this.view.body.GetAngle();
        var impulse = new box2d.b2Vec2(Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180));
        impulse=1*impulse;
        this.view.body.ApplyImpulse(impulse,this.view.body.GetWorldCenter());*/


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

    Bird.prototype.jump = function(){
        console.log("[Bird] jump");
    }

    return Bird;

})();