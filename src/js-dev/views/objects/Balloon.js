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