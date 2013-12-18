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