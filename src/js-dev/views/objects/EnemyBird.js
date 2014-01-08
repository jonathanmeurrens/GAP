/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */
/* globals gameData:true  */

var EnemyBird = (function(){

    function EnemyBird(url, x, y, direction){

        this.x = x;
        this.y = y;
        this.width = 46;
        this.height = 32;

        this.view = new createjs.Container();
        var data = {
            framerate: 8,
            images: [url],
            frames: {width:46, height:32},
            animations: {fly:[0,1]}
        };
        var spritesheet = new createjs.SpriteSheet(data);
        this.sprite = new createjs.Sprite(spritesheet, "fly");
        this.view.addChild(this.sprite);
        this.view.regX = 46/2;
        this.view.regY = 32/2;

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

        var circle1 = new box2d.b2CircleShape(this.width/3.2 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "enemyBird";
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
        if(gameData.pauseGame){
            return;
        }
        this.updateView();
    }

    EnemyBird.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return EnemyBird;

})();