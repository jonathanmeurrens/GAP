/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Branch = (function(){

    function Branch(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.1;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "branch";

        fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, (this.height - 20) / SCALE);
        fixDef.userData = "branch";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    Branch.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 9;
        this.view.y = this.view.body.GetPosition().y * SCALE + 20;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Branch;

})();