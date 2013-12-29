/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 21/11/13
 * Time: 14:39
 * To change this template use File | Settings | File Templates.
 */
/* globals preload:true  */
/* globals SCALE:true  */
/* globals world:true  */
/* globals stage:true  */
/* globals createjs:true  */
/* globals box2d:true  */

var Rock = (function(){

    function Rock(x, y, width, height){

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.view = new createjs.Bitmap(preload.getResult("rock"));
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

        fixDef.shape = new box2d.b2PolygonShape();
        var vertices = [];
        vertices.push(new box2d.b2Vec2(-0.7, -7));
        vertices.push(new box2d.b2Vec2(7, 3.3));
        vertices.push(new box2d.b2Vec2(-7, 3.3));
        fixDef.shape.SetAsVector(vertices, 3);
        fixDef.userData = "rock";
        /*fixDef.shape = new box2d.b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE, this.height / SCALE);*/
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.updateView();
    }

    Rock.prototype.updateView = function(){
        this.view.x = this.view.body.GetPosition().x * SCALE - 20;
        this.view.y = this.view.body.GetPosition().y * SCALE - 20;
        this.view.rotation = this.view.body.GetAngle * (180 / Math.PI);
    };

    return Rock;

})();