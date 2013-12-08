/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */

var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2MassData : Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
    b2DistanceJointDef : Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2BuoyancyController : Box2D.Dynamics.Controllers.b2BuoyancyController
};
var SCALE = 30;
var stage, world, debug, preload;

(function(){

    //var former = console.log;
    /*console.log = function(msg){
        //former(msg);  //maintains existing logging via the console.
        $("#mylog").prepend("<div>" + msg + "</div>");
    }

    window.onerror = function(message, url, linenumber) {
        console.log("JavaScript error: " + message + " on line " +
            linenumber + " for " + url);
    }*/

    var self;

    function init(){
        self = this;

        stage = new createjs.Stage(document.getElementById("game"));
        debug = document.getElementById('debug');
        this.width = stage.canvas.width;
        this.height = stage.canvas.height;
        this.levelStarted = false;
        this.collisionDetected = false;
        this.isPaused = true;

        this.gameData = new GameData('data/game.xml');
        $(this.gameData).on("parsed", gameDataLoadedHandler);
        this.gameData.parse();

        setupPhysics();
    }

    // ------------------- START UP FUNCTIONS

    function setupPhysics(){

        // create world
        world = new box2d.b2World(new box2d.b2Vec2(0,20), true);

        // setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(debug.getContext('2d'));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.2);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact) {

            self.gameContainer.handleBeginContact(contact);

            var colliderA = contact.GetFixtureA().GetBody().GetUserData();
            var colliderB = contact.GetFixtureB().GetBody().GetUserData();

            if(colliderA == "ground" || colliderB=="ground"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA == "rock" || colliderB=="rock"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA == "leaf" && colliderB == "bird" || colliderB=="bird" && colliderA=="leaf"){
                if(!self.collisionDetected){
                    // make leaf move a bit
                    console.log("[APP] leaf collided "+colliderA, colliderB);
                    SoundManager.playBounce();
                }
            }
            else if(colliderA == "nest" || colliderB == "nest"){
                if(!self.collisionDetected){
                    this.gameContainer.bird.rest();
                    showNextLevelScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA == "tornado" || colliderB == "tornado"){
                console.log("[APP] egg passed tornado");
                self.gameContainer.bird.tornadoFly();
            }
        }
        listener.EndContact = function(contact) {
            self.gameContainer.handleEndContact(contact);
        }
        listener.PostSolve = function(contact, impulse) {

        }
        listener.PreSolve = function(contact, oldManifold) {

        }
        world.SetContactListener(listener);
    }


    // --------------- STARTER FUNCTIONS

    function gameDataLoadedHandler(){

        drawLevel();
        addListeners();
        drawGameInfo();

        //showLevelsScreen();
        showStartScreen();
    }

    function addListeners(){

        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        $(document).on("keydown",function(e){
            console.log("[APP] keycode: "+e.which);
            if(e.which == 32){
                launchEgg();
            }
        });
    }

    function drawGameInfo(){
        if(this.stats == null){
            createStatistics();
        }
        if(this.screenManager == null){
            createScreenManager();
        }
    }

    function drawLevel(){

        self.levelStarted = false;

        if(self.gameContainer == null){
            this.gameContainer = new GameContainer();
            stage.addChild(this.gameContainer.view);
        }

        this.gameContainer.resetContainer();

        var level=0;
        if(self.stats!=null)
            level = self.gameData.getLevel(self.stats.level);


        $(level).find('leaf').each(function(i, obj){
            self.gameContainer.createLeaf($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("rotation"));
        });
        $(level).find('nest').each(function(i, obj){
            self.gameContainer.createNest($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('rock').each(function(i, obj){
            self.gameContainer.createRock($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('tornado').each(function(i, obj){
            self.gameContainer.createTornado($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('cloud').each(function(i, obj){
            self.gameContainer.createCloud($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('egg').each(function(i, obj){
            self.gameContainer.createBird($(obj).attr("x"), $(obj).attr("y"));
            self.gameContainer.bird.setMaxRotations(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("maxRotations"));
            self.gameContainer.bird.setEvolution(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("evolution"));
        });
        $(level).find('ground').each(function(i, obj){
            self.gameContainer.createGround(0, self.height - 40, self.width, 40);
        });
    }


    // --------------- CREATE STATIC GAME INFO

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        stage.addChild(this.stats.view);
    }

    function createScreenManager(){
        this.screenManager = new ScreenManager();
        stage.addChild(this.screenManager.view);
    }


    // --------------- GAME NAVIGATION HANDLERS

    function showStartScreen(){
        self.screenManager.showScreen(ScreenManager.START);
        self.screenManager.view.on(StartScreen.START, function(e){
            showLevelsScreen();
        });
    }

    function showLevelsScreen(){
        self.isPaused = true;
        self.screenManager.showLevelsScreen(self.gameData);
        self.screenManager.view.on(LevelNest.LEVEL_SELECTED, function(e){
            self.stats.setLevel(e.levelIndex);
            drawLevel();
            var instructionsData = self.gameData.getLevelInstructionsForLevel(self.stats.level);
            console.log(instructionsData);
            if(instructionsData.length > 0){
                showInstructionsScreen(instructionsData);
            }
            else{
                self.isPaused = false;
            }
        });
    }

    function showInstructionsScreen(instructionsData){
        console.log(instructionsData);
        self.isPaused = true;
        self.screenManager.showInstructionsScreen(instructionsData);
        //self.screenManager.showLevelsScreen(self.gameData);
        self.screenManager.view.on(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            console.log("[APP] instructions done!");
            self.isPaused = false;
            SoundManager.togglePlayBackgroundMusic();
        });
    }

    function showGameOverScreen(){
        SoundManager.playGameOver();
        self.screenManager.showScreen(ScreenManager.GAME_OVER);
        self.screenManager.view.on(GameOverScreen.RESTART_LEVEL, restartLevelHandler);
    }

    function showNextLevelScreen(){
        SoundManager.playSuccess();
        self.gameData.storeGamerData(this.stats.level, this.stats.stars); // KEEP GAMER DATA STORED
        self.screenManager.showScreen(ScreenManager.NEXT_LEVEL);
        self.screenManager.view.on(NextLevelScreen.NEXT_LEVEL, nextLevelHandler);
    }

    function launchEgg(){
        console.log("[APP] game paused: " + self.isPaused);
        if(self.levelStarted || self.isPaused)
            return;

        this.gameContainer.bird.push();

        this.gameContainer.bird.view.on(Bird.DIED, function(){
            console.log("[APP] bird died");
            showGameOverScreen();
        });
        self.levelStarted = true;
    }

    function restartLevelHandler(e){
        drawLevel();
        self.collisionDetected = false;
    }

    function nextLevelHandler(e){
        self.stats.levelUp();
        drawLevel();
        self.collisionDetected = false;
    }


    // --------------- TICK

    function tick(){
        if(this.levelStarted){
            if(this.gameContainer.bird.view.y  < 80){
                stage.y = - this.gameContainer.bird.view.y + 80;
            }
            else{
                stage.y=0;
            }
        }
        stage.update();
        world.DrawDebugData();
        world.Step(1/60, 10, 10);
        world.ClearForces();
    }

    init();

})();


