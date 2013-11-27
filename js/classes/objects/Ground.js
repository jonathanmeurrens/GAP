/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */

var Ground = (function(){

    var self;

    function Ground(x, y, width, height){

        self = this;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap("img/grass.png");
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "ground";
        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        adjustView();

        //$(this.view).on('tick', $.proxy( tick, this ));
    }

    function tick(e){

    }

    function adjustView(){
        self.view.x = self.view.body.GetPosition().x * SCALE;
        self.view.y = self.view.body.GetPosition().y * SCALE;
        self.view.rotation = self.view.body.GetAngle * (180 / Math.PI);
    }

    return Ground;

})();