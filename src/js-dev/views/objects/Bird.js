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
/* globals Twirl:true  */

var Bird = (function(){

    var self;

    function Bird(x, y, width, height){

        self = this;

        // EVENT TYPES
        Bird.DIED = "DIED";

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.impulse = 7;
        this.maxRotations = 0;
        this.evolution = 0;
        this.isDead = false;

        //this.view = new createjs.Bitmap("img/egg.png");
        //this.view.regX = this.view.regY = this.width/2; // put registration point in center

        this.view = new createjs.Container();
        var data = {
            images: ["assets/common/egg-spritesheet.png"],
            frames: {width:45, height:55},
            animations: {one:[0], two:[1], three:[2], four:[3], fly:[3,4,5,6]}
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

        var circle3 = new box2d.b2CircleShape(((this.width/2.3)-4) / SCALE);
        circle3.m_p.Set(-0.2,-0.5);
        fixDef.shape = circle3;
        fixDef.userData = "bird";
        this.view.body.CreateFixture(fixDef);

        var circle1 = new box2d.b2CircleShape(this.width/2.3 / SCALE);
        circle1.m_p.Set(-0.2,0.1);
        fixDef.shape = circle1;
        fixDef.userData = "bird";
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

        /*if(!self.isDead && (this.view.rotation/360 > this.maxRotations && !this.isDead)){
            birdDied();
        }*/

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
        applyImpulse(self.view.body, -45, 15);
        this.view.body.SetAngularVelocity(-1);
    };

    Bird.prototype.moveRight = function(){
        self.view.body.ApplyTorque(self.impulse);
        applyImpulse(self.view.body, 0, self.impulse);
        self.view.body.SetAngularVelocity(1);
        self.impulseAnimation(Twirl.LEFT_DIRECTION);
    };

    Bird.prototype.moveLeft = function(){
        self.view.body.ApplyTorque(-self.impulse);
        applyImpulse(self.view.body, 0, -self.impulse);
        self.view.body.SetAngularVelocity(-1);
        self.impulseAnimation(Twirl.RIGHT_DIRECTION);
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

    Bird.prototype.rest = function(nestPosition){
        this.view.body.SetType(box2d.b2Body.b2_staticBody);
        this.view.removeAllEventListeners();
        console.log(this.view.rotation%90, this.view.rotation, 90*(this.view.rotation%180));
        createjs.Tween.get(this.view).to({rotation:360, x:nestPosition.x+35, y:nestPosition.y-20},300);
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
            case 4:
                this.sprite.gotoAndStop("four");
                break;
            default :
                this.sprite.gotoAndStop("one");
        }
    };

    Bird.prototype.impulseAnimation = function(direction){
        //console.log("[Bird] rotation:"+this.view.rotation % 90);
        /*if(this.view.rotation < 0){
            if(direction === Twirl.LEFT_DIRECTION){
                direction = Twirl.RIGHT_DIRECTION;
            }else{
                direction = Twirl.LEFT_DIRECTION;
            }
        }*/
        var twirl = new Twirl(this.view.x + 60, this.view.y, direction);
        stage.addChild(twirl.view);
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