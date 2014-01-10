/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Rock = (function(){

    function Rock(url, x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult(url));
        this.view.regX = this.width/2;
        this.view.regY = this.height/2;

        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.1;

        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_staticBody;
        bodyDef.position.x = this.x / SCALE;
        bodyDef.position.y = this.y / SCALE;
        bodyDef.userData = "rock";

        var scaleX = width / 475;
        var scaleY = height / 358;

        fixDef.shape = new box2d.b2PolygonShape();
        var vertices = [];
        vertices.push(new box2d.b2Vec2(- (1-scaleX)*9, -6 * scaleY));
        vertices.push(new box2d.b2Vec2(6.3 * scaleX - (1-scaleX)*9, 3.3));
        vertices.push(new box2d.b2Vec2(-5.5 * scaleX - (1-scaleX)*9, 3.3));
        fixDef.shape.SetAsVector(vertices, 3);
        fixDef.userData = "rock";
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    Rock.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE;
        this.view.y = this.view.body.GetPosition().y * SCALE + 5;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Rock;

})();