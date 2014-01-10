/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Tornado = (function(){

    function Tornado(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 1;
        fixDef.isSensor = true;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = (parseInt(this.x)+350) / SCALE;
        bodyDef.position.y = (parseInt(this.y)+340) / SCALE;
        bodyDef.userData = "tornado";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);
        fixDef.userData = "tornado";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.view.x = x;
        this.view.y = y;

    }

    return Tornado;

})();