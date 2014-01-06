/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 27/12/13
 * Time: 10:34
 * To change this template use File | Settings | File Templates.
 */

/* globals preload:true  */
/* globals SCALE:true  */

/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var TimeCoin = (function(){

    var self;

    function TimeCoin(x, y, worth, index){

        self = this;

        this.x = x;
        this.y = y;
        this.width = 31;
        this.height = 31;
        this.worth = worth;

        this.view = new createjs.Bitmap(preload.getResult("time-coin"));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.isSensor = true;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_kinematicBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        //bodyDef.userData = 'timeCoin'+index;

        this.view.body = world.CreateBody(bodyDef);
        this.view.body.SetUserData('timeCoin'+index);

        var circle1 = new box2d.b2CircleShape(this.width/2 / SCALE);
        circle1.m_p.Set(0,0);
        fixDef.shape = circle1;
        fixDef.userData = "timeCoin"+index;
        this.view.body.CreateFixture(fixDef);

        this.updateView();
        animate(this.view);
        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    function animate(view){
        createjs.Tween.removeTweens(view);
        createjs.Tween.get(view).to({y:view.y - 10}, 1000 + Math.random()*500).call(function(e){
            createjs.Tween.get(this).to({y:view.y + 10}, 1000 + Math.random()*500).call(function(){
                animate(this);
            });
        });
    }

    function tick(e){
        this.updateView();
    }

    TimeCoin.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return TimeCoin;

})();