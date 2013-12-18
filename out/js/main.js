!function(a,b){function c(){}function d(a,b){FB.ui({method:"stream.publish",display:"popup",message:"",name:"Tjilp",caption:"Check out my score!",description:"I got"+b+" stars on level "+a,link:"http://tjilp.be",picture:"http://www.baatsontwerp.nl/Styles/img/portfolio/illustraties/Tjilp/tjilp_web.jpg"},function(a){a&&a.post_id?console.log("Post was published"):console.log("Post NOT published")})}b["true"]=a;var e=function(){function a(a){c=this,this.gameData=a,this.view=new createjs.Container,this.leafs=[],this.obstacles=[],this.clouds=[],this.trees=[]}function b(a){var b=y.canvas.height-a;return b}var c;return a.prototype.createBackground=function(a){this.background=new f(a),this.view.addChild(this.background.view)},a.prototype.createGround=function(a,b,c,d,e){this.ground=new i(a,b,c,d,e),this.view.addChild(this.ground.view)},a.prototype.createRock=function(a,c){var d=new l(a,b(c),40,240);this.view.addChild(d.view),this.obstacles.push(d)},a.prototype.createLeaf=function(a,c,d,e){var f=new j(a,b(c),58,6.5,d,e);this.view.addChild(f.view),this.leafs.push(f)},a.prototype.createBird=function(a,c){this.bird=new g(a,b(c),40,40),this.view.addChild(this.bird.view)},a.prototype.createNest=function(a,c){null==a&&(a=y.canvas.width-20),this.nest=new k(a,b(c),50,16),this.view.addChild(this.nest.view)},a.prototype.createTornado=function(a,c){var d=new m(a,b(c),150,150);this.view.addChild(d.view),this.obstacles.push(d)},a.prototype.createCloud=function(a,c){var d=new h(a,b(c),150,150);this.view.addChild(d.view),this.clouds.push(d)},a.prototype.createTree=function(a,b,c,d){var e=new n(a,b,c,d);this.view.addChild(e.view),this.trees.push(e)},a.prototype.removeBird=function(){null!=this.bird&&(z.DestroyBody(this.bird.view.body),this.view.removeChild(this.bird.view),this.bird=null)},a.prototype.removeBackground=function(){null!=this.background&&(this.view.removeChild(this.background.view),this.background=null)},a.prototype.removeGround=function(){null!=this.ground&&(z.DestroyBody(this.ground.view.body),this.view.removeChild(this.ground.view),this.ground=null)},a.prototype.removeNest=function(){null!=this.nest&&(z.DestroyBody(this.nest.view.body),this.view.removeChild(this.nest.view),this.nest=null)},a.prototype.resetContainer=function(){for(var a=0;a<this.leafs.length;a++){var b=this.leafs[a];z.DestroyBody(b.view.body),this.view.removeChild(b.view),this.leafs.splice(a,1)}for(var c=0;c<this.obstacles.length;c++){var d=this.obstacles[a];z.DestroyBody(d.view.body),this.view.removeChild(d.view),this.obstacles.splice(c,1)}for(var e=0;e<this.clouds.length;e++){var f=this.clouds[e];z.DestroyBody(f.view.body),this.view.removeChild(f.view),this.clouds.splice(e,1)}for(var g=0;g<this.trees.length;g++){var h=this.trees[g];this.view.removeChild(h.view),this.trees.splice(g,1)}this.removeBird(),this.removeGround(),this.removeNest(),this.removeBackground()},a.prototype.handleBeginContact=function(a){var b=a.GetFixtureA().GetBody().GetUserData(),c=a.GetFixtureB().GetBody().GetUserData();if("leaf"===b||"leaf"===c)for(var d=0;d<this.leafs.length;d++){var e=this.leafs[d];e.handleBeginContact(a)}else if("cloud"===b||"cloud"===c)for(var f=0;f<this.clouds.length;f++){var g=this.clouds[f];g.handleBeginContact(a)}},a.prototype.handleEndContact=function(a){var b=a.GetFixtureA().GetBody().GetUserData(),c=a.GetFixtureB().GetBody().GetUserData();if("leaf"===b||"leaf"===c)for(var d=0;d<this.leafs.length;d++){var e=this.leafs[d];e.handleEndContact(a)}else if("cloud"===b||"cloud"===c)for(var f=0;f<this.clouds.length;f++){var g=this.clouds[f];g.handleEndContact(a)}},a}(),f=function(){function a(a){b=this,this.x=0,this.y=0,this.width=y.canvas.width,this.height=y.canvas.height,this.view=new createjs.Bitmap(a),this.view.regX=this.width/2,this.view.regY=this.height/2,this.view.x=y.canvas.width/2,this.view.y=y.canvas.height/2}var b;return a}(),g=function(){function a(c,f,g,h){e=this,a.DIED="DIED",this.x=c,this.y=f,this.width=g,this.height=h,this.impulse=10,this.maxRotations=0,this.evolution=0,this.isDead=!1,this.view=new createjs.Container;var i={images:["img/egg-spritesheet.png"],frames:{width:51,height:55},animations:{one:[0],two:[1],three:[2],fly:[3,4,5,6]}},j=new createjs.SpriteSheet(i);this.sprite=new createjs.Sprite(j,"one"),this.view.addChild(this.sprite),this.view.regX=25.5,this.view.regY=27.5;var k=new C.b2FixtureDef;k.density=1,k.friction=.3,k.restitution=0;var l=new C.b2BodyDef;l.type=C.b2Body.b2_staticBody,l.position.x=this.x/D,l.position.y=this.y/D,l.userData="bird",l.fixedRotation=!0,this.view.body=z.CreateBody(l),this.view.body.SetUserData("bird");var m=new C.b2CircleShape(this.width/2/D);m.m_p.Set(0,.5),k.shape=m,k.userData="center-egg",this.view.body.CreateFixture(k);var n=new C.b2CircleShape((this.width/2-2)/D);n.m_p.Set(0,0),k.shape=n,k.userData="top-egg",this.view.body.CreateFixture(k),$("body").on("keydown",function(a){console.log("[Bird] keycode: "+a.which),39===a.which?d(e.view.body,0,e.impulse):37===a.which?d(e.view.body,0,-e.impulse):38===a.which&&e.fly()}),$(this.view).on("tick",$.proxy(b,this))}function b(){this.view.x=this.view.body.GetPosition().x*D,this.view.y=this.view.body.GetPosition().y*D,this.view.rotation=this.view.body.GetAngle()*(180/Math.PI),!e.isDead&&this.view.rotation/360>this.maxRotations&&!this.isDead&&c(),!e.isDead&&(this.view.x>y.canvas.width||this.view.x<0||this.view.y>y.canvas.height)&&c()}function c(){var b=new createjs.Event(a.DIED);this.view.dispatchEvent(b),e.isDead=!0}function d(a,b,c){a.ApplyImpulse(new C.b2Vec2(Math.cos(b*(Math.PI/180))*c,Math.sin(b*(Math.PI/180))*c),a.GetWorldCenter())}var e;return a.prototype.push=function(){this.view.body.SetType(C.b2Body.b2_dynamicBody),this.view.body.SetAngularVelocity(.5),d(e.view.body,-45,20)},a.prototype.tornadoFly=function(){d(e.view.body,-90,20)},a.prototype.fly=function(){2===this.evolution&&(e.view.body.SetLinearDamping(10),d(e.view.body,-90,e.impulse),this.sprite.gotoAndPlay("fly"),setInterval(this.stopFly,2e3))},a.prototype.rest=function(){this.view.body.SetType(C.b2Body.b2_staticBody)},a.prototype.stopFly=function(){console.log("[BIRD] stop flying"),e.view.body.SetLinearDamping(0)},a.prototype.setEvolution=function(a){switch(this.evolution=parseInt(a),this.evolution){case 1:this.sprite.gotoAndStop("one");break;case 2:this.sprite.gotoAndStop("two");break;case 3:this.sprite.gotoAndStop("three");break;default:this.sprite.gotoAndStop("one")}},a.prototype.setMaxRotations=function(a){this.maxRotations=a},a}(),h=function(){function a(a,d,e,f){this.x=a,this.y=d,this.width=e,this.height=f,this.view=new createjs.Bitmap(B.getResult("cloud")),this.view.regX=this.width/2,this.view.regY=this.height/2;var g=new C.b2FixtureDef;g.density=2,g.friction=.3,g.restitution=0,g.isSensor=!0;var h=new C.b2BodyDef;h.type=C.b2Body.b2_kinematicBody,h.position.x=this.x/D,h.position.y=this.y/D,h.userData="cloud",this.view.body=z.CreateBody(h),this.view.body.SetUserData("cloud");var i=new C.b2CircleShape(this.width/3/D);i.m_p.Set(0,0),g.shape=i,g.userData="cloud-part-one",this.view.body.CreateFixture(g);var j=new C.b2CircleShape((this.width/3-10)/D);j.m_p.Set(2,0),g.shape=j,g.userData="cloud-part-two",this.view.body.CreateFixture(g);var k=new C.b2CircleShape((this.width/3-6)/D);k.m_p.Set(-2,0),g.shape=k,g.userData="cloud-part-three",this.view.body.CreateFixture(g),this.view.body.SetLinearVelocity(new C.b2Vec2(.5,0)),c=new C.b2BuoyancyController,c.normal.Set(0,-1),c.useDensity=!0,c.density=2,z.AddController(c),$(this.view).on("tick",$.proxy(b,this))}function b(){this.updateView()}var c;return a.prototype.updateView=function(){this.view.x=this.view.body.GetPosition().x*D-70,this.view.y=this.view.body.GetPosition().y*D-60,this.view.rotation=this.view.body.GetAngle*(180/Math.PI)},a.prototype.handleBeginContact=function(a){var b=a.GetFixtureA(),d=a.GetFixtureB();if(b.IsSensor()){var e=d.GetBody();e.GetControllerList()||c.AddBody(e)}else if(d.IsSensor()){var f=b.GetBody();f.GetControllerList()||c.AddBody(f)}},a.prototype.handleEndContact=function(a){var b=a.GetFixtureA(),d=a.GetFixtureB();if(b.IsSensor()){var e=d.GetBody();e.GetControllerList()&&c.RemoveBody(e)}else if(d.IsSensor()){var f=b.GetBody();f.GetControllerList()&&c.RemoveBody(f)}},a}(),i=function(){function a(a,c,d,e,f){b=this;var g=50;this.x=c,this.y=d,this.width=e,this.height=f,this.view=new createjs.Bitmap(a),this.view.regX=this.width/2,this.view.regY=this.height/2,this.view.x=y.canvas.width/2,this.view.y=y.canvas.height-f/2;var h=new C.b2FixtureDef;h.density=1,h.friction=.5,h.restitution=0;var i=new C.b2BodyDef;i.type=C.b2Body.b2_staticBody,i.position.x=this.x/D,i.position.y=(y.canvas.height-g)/D,i.userData="ground",h.shape=new C.b2PolygonShape,h.shape.SetAsBox(this.width/D,g/D),this.view.body=z.CreateBody(i),this.view.body.CreateFixture(h)}var b;return a}(),j=function(){function a(a,c,d,e,f,g){this.x=a,this.y=c,this.width=d,this.height=e,this.rotation=f,this.restitution=null==g?1:g,this.view=new createjs.Bitmap(B.getResult("leaf")),this.view.regX=this.width,this.view.regY=this.height;var h=new C.b2FixtureDef;h.density=.1,h.friction=.4,h.restitution=this.restitution;var i=new C.b2BodyDef;i.type=C.b2Body.b2_staticBody,i.position.x=this.x/D,i.position.y=this.y/D,i.userData="leaf",h.shape=new C.b2PolygonShape,h.shape.SetAsBox(this.width/D,this.height/D),this.view.body=z.CreateBody(i),this.view.body.CreateFixture(h),this.view.body.SetAngle(f/180*Math.PI),$(this.view).on("tick",$.proxy(b,this))}function b(){this.updateView()}var c;return a.prototype.handleBeginContact=function(a){var b=a.GetFixtureA(),d=a.GetFixtureB();if(b.IsSensor()){var e=d.GetBody();e.GetControllerList()||c.AddBody(e)}else if(d.IsSensor()){var f=b.GetBody();f.GetControllerList()||c.AddBody(f)}},a.prototype.handleEndContact=function(a){var b=a.GetFixtureA(),d=a.GetFixtureB();if(b.IsSensor()){var e=d.GetBody();e.GetControllerList()&&c.RemoveBody(e)}else if(d.IsSensor()){var f=b.GetBody();f.GetControllerList()&&c.RemoveBody(f)}},a.prototype.updateView=function(){this.view.rotation=this.view.body.GetAngle()*(180/Math.PI),this.view.x=this.view.body.GetPosition().x*D,this.view.y=this.view.body.GetPosition().y*D},a}(),k=function(){function a(a,b,c,d){this.x=a,this.y=b,this.width=c,this.height=d,this.view=new createjs.Bitmap(B.getResult("nest")),this.view.regX=this.width/2,this.view.regY=this.height/2;var e=new C.b2FixtureDef;e.density=1,e.friction=.5,e.restitution=0;var f=new C.b2BodyDef;f.type=C.b2Body.b2_staticBody,f.position.x=this.x/D,f.position.y=this.y/D,f.userData="nest",e.shape=new C.b2PolygonShape,e.shape.SetAsBox(this.width/D,this.height/D),this.view.body=z.CreateBody(f),this.view.body.CreateFixture(e),this.updateView()}return a.prototype.updateView=function(){this.view.x=this.view.body.GetPosition().x*D-25,this.view.y=this.view.body.GetPosition().y*D-10,this.view.rotation=this.view.body.GetAngle*(180/Math.PI)},a}(),l=function(){function a(a,b,c,d){this.x=a,this.y=b,this.width=c,this.height=d,this.view=new createjs.Bitmap(B.getResult("rock")),this.view.regX=this.width/2,this.view.regY=this.height/2;var e=new C.b2FixtureDef;e.density=1,e.friction=.5,e.restitution=1;var f=new C.b2BodyDef;f.type=C.b2Body.b2_staticBody,f.position.x=this.x/D,f.position.y=this.y/D,f.userData="rock",e.shape=new C.b2PolygonShape,e.shape.SetAsBox(this.width/D,this.height/D),this.view.body=z.CreateBody(f),this.view.body.CreateFixture(e),this.updateView()}return a.prototype.updateView=function(){this.view.x=this.view.body.GetPosition().x*D-20,this.view.y=this.view.body.GetPosition().y*D-20,this.view.rotation=this.view.body.GetAngle*(180/Math.PI)},a}(),m=function(){function a(a,b,c,d){this.x=a,this.y=b,this.width=c,this.height=d,this.view=new createjs.Bitmap(B.getResult("tornado")),this.view.regX=this.width/2,this.view.regY=this.height/2;var e=new C.b2FixtureDef;e.density=1,e.friction=.5,e.restitution=1,e.isSensor=!0;var f=new C.b2BodyDef;f.type=C.b2Body.b2_staticBody,f.position.x=this.x/D,f.position.y=this.y/D,f.userData="tornado",e.shape=new C.b2PolygonShape,e.shape.SetAsBox(this.width/D,this.height/D),this.view.body=z.CreateBody(f),this.view.body.CreateFixture(e),this.updateView()}return a.prototype.updateView=function(){this.view.x=this.view.body.GetPosition().x*D-20,this.view.y=this.view.body.GetPosition().y*D-20,this.view.rotation=this.view.body.GetAngle*(180/Math.PI)},a}(),n=function(){function a(a,c,d,e){b=this,this.x=c,this.y=y.canvas.height-e/2,this.width=d,this.height=e,this.view=new createjs.Bitmap(a),this.view.regX=this.width/2,this.view.regY=this.height/2,this.view.x=this.x,this.view.y=this.y}var b;return a}(),o=function(){function a(d,e,f){c=this,a.LEVEL_SELECTED="LEVEL_SELECTED",this.levelIndex=d,this.starsCount=e,this.isPlayable=f,this.view=new createjs.Container;var g=new createjs.Shape;g.graphics.beginFill(createjs.Graphics.getRGB(200,200,200)),g.graphics.drawRect(0,0,y.canvas.width,y.canvas.height),g.mouseEnabled=!1,this.view.addChild(g);var h=new createjs.Bitmap("img/nest.png");if(this.view.addChild(h),null!=this.starsCount&&this.starsCount>0){var i=new createjs.Bitmap("img/stars_"+this.starsCount+".png");this.view.addChild(i)}this.view.on("click",$.proxy(b,this))}function b(){var b=new createjs.Event(a.LEVEL_SELECTED,!0);b.levelIndex=this.levelIndex,c.view.dispatchEvent(b)}var c;return a}(),p=function(){function a(a,e){d=this,this.view=new createjs.Container,this.view.x=a,this.view.y=e,this.stars=1,this.level=0,this.bounces=1,this.leafsCount=1,this.levelTxt=new createjs.Text("","14px Arial","#000000"),this.view.addChild(this.levelTxt);var f={images:["img/stars-spritesheet.png"],frames:{width:76,height:20},animations:{none:[3],one:[0],two:[1],three:[2]}},g=new createjs.SpriteSheet(f);this.starsSprite=new createjs.Sprite(g,"none"),this.view.addChild(this.starsSprite);var h={images:["img/mute-spritesheet.png"],frames:{width:50,height:50},animations:{on:[0],mute:[1]}},i=new createjs.SpriteSheet(h);this.muteBtnSprite=new createjs.Sprite(i,"on"),this.view.addChild(this.muteBtnSprite),this.muteBtnSprite.addEventListener("click",function(){console.log("[Statistics] mute sound"),c.togglePlayBackgroundMusic(),c.isPlayingMusic?d.muteBtnSprite.gotoAndStop("on"):d.muteBtnSprite.gotoAndStop("mute")}),b()}function b(){d.levelTxt.text="level: "+(d.level+1);var a="none";switch(this.self.starsSprite){case 0:a="none";break;case 1:a="one";break;case 2:a="two";break;case 3:a="three";break;default:a="none"}d.starsSprite.gotoAndStop(a)}var d;return a.prototype.setLevel=function(a){this.level=a,b()},a.prototype.levelUp=function(){this.level++,b()},a.prototype.levelDown=function(){this.level--,b()},a.prototype.increaseBounce=function(){this.bounces++,console.log("[bounces] "+this.bounces),b()},a.prototype.resetBounces=function(){this.bounces=1},a.prototype.getStars=function(){return d.bounces/d.leafsCount*3},a}(),q=function(){function a(){c=this,this.width=500,this.height=400,a.RESTART_LEVEL="RESTART_LEVEL",this.screenType=v.GAME_OVER,this.view=new createjs.Container;var d=new createjs.Shape;d.graphics.beginFill(createjs.Graphics.getRGB(255,0,0)),d.graphics.drawRect(this.width/2,this.height/2-100,this.width,this.height),d.mouseEnabled=!0,this.view.addChild(d),d.addEventListener("click",b)}function b(){var b=new createjs.Event(a.RESTART_LEVEL,!0);c.view.dispatchEvent(b)}var c;return a}(),r=function(){function a(c){d=this,a.INSTRUCTIONS_DONE="INSTRUCTIONS_DONE",this.instructionsData=c,this.currentInstruction=0,this.screenType=v.INSTRUCTIONS,this.view=new createjs.Container;var e=new createjs.Shape;e.graphics.beginFill(createjs.Graphics.getRGB(0,0,255)),e.graphics.drawRect(0,0,200,200),this.view.addChild(e),b(),e.addEventListener("click",function(){b()})}function b(){if(d.currentInstruction<d.instructionsData.length)c(),d.instructionImg=new createjs.Bitmap("img/instructions/instruction-"+$(d.instructionsData[d.currentInstruction]).attr("img")),d.view.addChild(d.instructionImg);else{c();var b=new createjs.Event(a.INSTRUCTIONS_DONE,!0);d.view.dispatchEvent(b)}d.currentInstruction++}function c(){null!=d.instructionImg&&(d.view.removeChild(d.instructionImg),d.instructionImg=null)}var d;return a}(),s=function(){function a(a){d=this,this.gameData=a,this.screenType=v.LEVELS,this.view=new createjs.Container,$("body").on("keydown",function(a){console.log("[LevelsScreen] keycode: "+a.which),49===a.which?b(0):50===a.which?b(1):222===a.which&&b(2)}),c()}function b(a){var b=new createjs.Event(o.LEVEL_SELECTED,!0);b.levelIndex=a,d.view.dispatchEvent(b)}function c(){for(var a=0;a<this.gameData.getLevelCount();a++){var b=new o(a,this.gameData.gamerData.levels[a],!0);b.view.x=130*a,d.view.addChild(b.view)}}var d;return a}(),t=function(){function a(){e=this,a.NEXT_LEVEL="NEXT_LEVEL",this.screenType=v.NEXT_LEVEL,this.view=new createjs.Container;var d=new createjs.Shape;d.graphics.beginFill(createjs.Graphics.getRGB(0,255,0)),d.graphics.drawRect(0,0,y.canvas.width,y.canvas.height),this.view.addChild(d),d.addEventListener("click",b);var f=new createjs.Bitmap("img/post-on-fb-btn.png");f.x=y.canvas.width/2-Math.round(28.5),f.y=y.canvas.height/2-Math.round(9),f.addEventListener("click",c),this.view.addChild(f);$("body").on("keydown",function(a){13===a.which&&b(a)})}function b(){var b=new createjs.Event(a.NEXT_LEVEL,!0);e.view.dispatchEvent(b)}function c(){console.log("[NextLevelScreen] post on fb"),d(1,3)}var e;return a}(),u=function(){function a(){g=this,a.START="START",this.screenType=v.START,this.view=new createjs.Container;var h=new createjs.Shape;h.graphics.beginFill(createjs.Graphics.getRGB(255,255,0)),h.graphics.drawRect(0,0,y.canvas.width,y.canvas.height),this.view.addChild(h),this.progressEgg=new createjs.Bitmap("img/egg.png"),this.progressEgg.regX=20.5,this.progressEgg.regY=28,this.progressEgg.x=y.canvas.width/2,this.progressEgg.y=y.canvas.height/2,this.view.addChild(this.progressEgg);var i="img/",j=[{src:"egg-spritesheet.png",id:"egg-spritesheet"},{src:"cloud.png",id:"cloud"},{src:"grass.png",id:"grass"},{src:"leaf.png",id:"leaf"},{src:"nest.png",id:"nest"},{src:"rock.png",id:"rock"},{src:"stars-spritesheet.png",id:"stars-spritesheet"},{src:"bounce.mp3",id:"bounce_sound"},{src:"music.mp3|music.ogg",id:"music"},{src:"gameover.mp3|gameover.ogg",id:"gameover_sound"},{src:"success.mp3|success.ogg",id:"success_sound"}];B=new createjs.LoadQueue,B.installPlugin(createjs.Sound),B.addEventListener("progress",c),B.addEventListener("complete",e),B.addEventListener("fileload",d),B.addEventListener("error",f),B.loadManifest(j,!0,i),h.addEventListener("click",b)}function b(){var b=new createjs.Event(a.START,!0);g.view.dispatchEvent(b)}function c(a){console.log(a.loaded),g.progressEgg.rotation=180*a.loaded}function d(){}function e(){console.log("preloading complete!");var b=new createjs.Event(a.START,!0);g.view.dispatchEvent(b)}function f(a){console.log("[StartScreen] error preload!"+a)}var g;return a}(),v=function(){function a(){b=this,this.view=new createjs.Container,this.screen=null,a.GAME_OVER="GAME_OVER",a.INSTRUCTIONS="INSTRUCTIONS",a.NEXT_LEVEL="NEXT_LEVEL",a.LEVELS="LEVELS",a.START="START"}var b;return a.prototype.showScreen=function(c){null==this.screen&&(c===a.GAME_OVER?(this.screen=new q,this.screen.view.on(q.RESTART_LEVEL,function(){console.log("[ScreenManager] RESTART LEVEL"),b.removeScreen()})):c===a.INSTRUCTIONS?this.screen=new r:c===a.START&&(this.screen=new u,this.screen.view.on(u.START,function(){console.log("[ScreenManager] START"),b.removeScreen()})),this.view.addChild(this.screen.view),console.log("[ScreenManager] added screen "+c))},a.prototype.showLevelsScreen=function(a){this.screen=new s(a),this.view.addChild(this.screen.view),this.screen.view.on(o.LEVEL_SELECTED,function(){b.removeScreen()})},a.prototype.showInstructionsScreen=function(a){this.screen=new r(a),this.view.addChild(this.screen.view),this.screen.view.on(r.INSTRUCTIONS_DONE,function(){b.removeScreen()})},a.prototype.showNextLevelScreen=function(){this.screen=new t,this.view.addChild(this.screen.view),this.screen.view.on(t.NEXT_LEVEL,function(){console.log("[ScreenManager] NEXT LEVEL"),b.removeScreen()})},a.prototype.removeScreen=function(){null!=this.screen&&(this.view.removeChild(this.screen.view),this.screen=null)},a}();c.isPlayingMusic=!1,c.backgroundMusicInstance=null,c.playBounce=function(){createjs.Sound.play("bounce_sound")},c.togglePlayBackgroundMusic=function(){c.isPlayingMusic?c.backgroundMusicInstance.setMute(!0):null==c.backgroundMusicInstance?c.backgroundMusicInstance=createjs.Sound.play("music",{interrupt:createjs.Sound.INTERRUPT_NONE,loop:-1,volume:.4}):c.backgroundMusicInstance.setMute(!1),c.isPlayingMusic=!c.isPlayingMusic},c.playGameOver=function(){createjs.Sound.play("gameover_sound")},c.playSuccess=function(){createjs.Sound.play("success_sound")};var w=function(){function a(a){c=this,this.xmlPath=a,this.gamerData=this.getStoredGamerData(),null==this.gamerData&&(this.gamerData=new x),console.log(this.gamerData)}function b(){localStorage.setItem("tjilp_game",JSON.stringify(c.gamerData))}var c;return a.prototype.parse=function(){$.ajax({url:this.xmlPath,type:"GET",dataType:"xml",success:function(a){c.levelsData=a,$(c).trigger("parsed")}})},a.prototype.getLevelCount=function(){return c.levelsData.getElementsByTagName("levels")[0].childElementCount},a.prototype.getLevel=function(a){return c.levelsData.getElementsByTagName("levels")[0].getElementsByTagName("level")[a]},a.prototype.getEggDataForLevel=function(a){return this.getLevel(a).getElementsByTagName("egg")[0]},a.prototype.getLevelInstructionsForLevel=function(a){return this.getLevel(a).getElementsByTagName("instruction")},a.prototype.getAssetsToPreloadForLevel=function(a){return console.log(this.getLevel(a).getElementsByTagName("instruction")),this.getLevel(a).getElementsByTagName("instruction")},a.prototype.getStoredGamerData=function(){var a=localStorage.getItem("tjilp_game");return"undefined"!==a?JSON.parse(a):null},a.prototype.didUserGetInstructionForLevel=function(a){return c.gamerData.givenInstructions?c.gamerData.givenInstructions[a]?!0:!1:!1},a.prototype.storeGamerLevelData=function(a,d){(null==this.gamerData.levels[a]||this.gamerData.levels[a]<d)&&(c.gamerData.levels[a]=d,b())},a.prototype.storeGamerInstructionGiven=function(a){c.gamerData.givenInstructions[a]=!0,b()},a}(),x=function(){function a(){this.name="Jonathan",this.id=2304958271,this.levels=[],this.givenInstructions=[]}return a}();window.fbAsyncInit=function(){FB.init({appId:"596243747091537",status:!0,cookie:!0,xfbml:!0})},function(a){var b,c="facebook-jssdk",d=a.getElementsByTagName("script")[0];a.getElementById(c)||(b=a.createElement("script"),b.id=c,b.async=!0,b.src="//connect.facebook.net/en_US/all.js",d.parentNode.insertBefore(b,d))}(document);var y,z,A,B,C={b2Vec2:Box2D.Common.Math.b2Vec2,b2BodyDef:Box2D.Dynamics.b2BodyDef,b2Body:Box2D.Dynamics.b2Body,b2FixtureDef:Box2D.Dynamics.b2FixtureDef,b2Fixture:Box2D.Dynamics.b2Fixture,b2World:Box2D.Dynamics.b2World,b2MassData:Box2D.Collision.Shapes.b2MassData,b2PolygonShape:Box2D.Collision.Shapes.b2PolygonShape,b2CircleShape:Box2D.Collision.Shapes.b2CircleShape,b2DebugDraw:Box2D.Dynamics.b2DebugDraw,b2DistanceJointDef:Box2D.Dynamics.Joints.b2DistanceJointDef,b2BuoyancyController:Box2D.Dynamics.Controllers.b2BuoyancyController},D=30;!function(){function a(){I=this,y=new createjs.Stage(document.getElementById("game")),A=document.getElementById("debug"),this.width=y.canvas.width,this.height=y.canvas.height,this.levelStarted=!1,this.collisionDetected=!1,this.isPaused=!0,this.gameData=new w("data/game.xml"),$(this.gameData).on("parsed",d),this.gameData.parse(),b()}function b(){z=new C.b2World(new C.b2Vec2(0,20),!0);var a=new C.b2DebugDraw;a.SetSprite(A.getContext("2d")),a.SetDrawScale(D),a.SetFillAlpha(.2),a.SetFlags(C.b2DebugDraw.e_shapeBit|C.b2DebugDraw.e_jointBit),z.SetDebugDraw(a);var b=new Box2D.Dynamics.b2ContactListener;b.BeginContact=function(a){I.gameContainer.handleBeginContact(a);var b=a.GetFixtureA().GetBody().GetUserData(),d=a.GetFixtureB().GetBody().GetUserData();"ground"===b||"ground"===d?I.collisionDetected||(x(),I.collisionDetected=!0):"rock"===b||"rock"===d?I.collisionDetected||(x(),I.collisionDetected=!0):"leaf"===b&&"bird"===d||"bird"===d&&"leaf"===b?I.collisionDetected||(console.log("[APP] leaf collided "+b,d),c.playBounce(),I.stats.increaseBounce()):"nest"===b||"nest"===d?I.collisionDetected||(I.gameContainer.bird.rest(),B(),I.collisionDetected=!0):("tornado"===b||"tornado"===d)&&(console.log("[APP] egg passed tornado"),I.gameContainer.bird.tornadoFly())},b.EndContact=function(a){I.gameContainer.handleEndContact(a)},b.PostSolve=function(){},b.PreSolve=function(){},z.SetContactListener(b)}function d(){i(),f(),h(),l()}function f(){createjs.Ticker.addEventListener("tick",H),createjs.Ticker.setFPS(60),createjs.Ticker.useRAF=!0,$(document).on("keydown",function(a){console.log("[APP] keycode: "+a.which),32===a.which&&E()})}function h(){null==this.stats&&j(),null==this.screenManager&&k()}function i(){I.levelStarted=!1,null==I.gameContainer&&(this.gameContainer=new e,y.addChild(this.gameContainer.view)),this.gameContainer.resetContainer();var a=0;null!=I.stats&&(a=I.gameData.getLevel(I.stats.level),I.stats.resetBounces(),I.stats.leafsCount=$(a).find("leaf").length),$(a).find("background").each(function(a,b){I.gameContainer.createBackground($(b).attr("img"))}),$(a).find("ground").each(function(a,b){I.gameContainer.createGround($(b).attr("img"),I.width/2,I.height-parseInt($(b).attr("height")),I.width,parseInt($(b).attr("height")))}),$(a).find("tree").each(function(a,b){I.gameContainer.createTree($(b).attr("img"),$(b).attr("x"),$(b).attr("width"),$(b).attr("height"))}),$(a).find("leaf").each(function(a,b){I.gameContainer.createLeaf($(b).attr("x"),$(b).attr("y"),$(b).attr("rotation"),$(b).attr("restitution"))}),$(a).find("nest").each(function(a,b){I.gameContainer.createNest($(b).attr("x"),$(b).attr("y"))}),$(a).find("rock").each(function(a,b){I.gameContainer.createRock($(b).attr("x"),$(b).attr("y"))}),$(a).find("tornado").each(function(a,b){I.gameContainer.createTornado($(b).attr("x"),$(b).attr("y"))}),$(a).find("cloud").each(function(a,b){I.gameContainer.createCloud($(b).attr("x"),$(b).attr("y"))}),$(a).find("egg").each(function(a,b){I.gameContainer.createBird($(b).attr("x"),$(b).attr("y")),I.gameContainer.bird.setMaxRotations(I.gameData.getEggDataForLevel(I.stats.level).getAttribute("maxRotations")),I.gameContainer.bird.setEvolution(I.gameData.getEggDataForLevel(I.stats.level).getAttribute("evolution"))})}function j(){this.stats=new p(20,20),y.addChild(this.stats.view)}function k(){this.screenManager=new v,y.addChild(this.screenManager.view)}function l(){I.screenManager.showScreen(v.START),I.screenManager.view.on(u.START,function(){m()})}function m(){I.isPaused=!0,I.screenManager.showLevelsScreen(I.gameData),I.screenManager.view.on(o.LEVEL_SELECTED,function(a){I.stats.setLevel(a.levelIndex),i();var b=I.gameData.getLevelInstructionsForLevel(I.stats.level);b.length>0&&!I.gameData.didUserGetInstructionForLevel(I.stats.level)?(console.log("[APP] show instructions"),n(b)):(console.log("[APP] start game"),s())})}function n(a){console.log(a),I.isPaused=!0,I.screenManager.showInstructionsScreen(a),I.screenManager.view.on(r.INSTRUCTIONS_DONE,function(){console.log("[APP] instructions done!"),I.gameData.storeGamerInstructionGiven(I.stats.level),s()})}function s(){I.isPaused=!1,c.togglePlayBackgroundMusic()}function x(){c.playGameOver(),I.screenManager.showScreen(v.GAME_OVER),I.screenManager.view.on(q.RESTART_LEVEL,F)}function B(){c.playSuccess(),I.gameData.storeGamerLevelData(this.stats.level,this.stats.getStars()),console.log("[stars] "+this.stats.getStars()),I.screenManager.showNextLevelScreen(),I.screenManager.view.on(t.NEXT_LEVEL,G)}function E(){console.log("[APP] game paused: "+I.isPaused),I.levelStarted||I.isPaused||(this.gameContainer.bird.push(),this.gameContainer.bird.view.on(g.DIED,function(){console.log("[APP] bird died"),x()}),I.levelStarted=!0)}function F(){i(),I.collisionDetected=!1}function G(){I.stats.levelUp(),i(),I.collisionDetected=!1}function H(){this.levelStarted&&(y.y=this.gameContainer.bird.view.y<80?-this.gameContainer.bird.view.y+80:0),y.update(),z.DrawDebugData(),z.Step(1/60,10,10),z.ClearForces()}var I;a()}()}({},function(){return this}());