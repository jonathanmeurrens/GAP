/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */


/* globals Box2D:true  */
/* globals createjs:true  */
/* globals GameData:true  */
/* globals SoundManager:true  */
/* globals GameContainer:true  */
/* globals Statistics:true  */
/* globals ScreenManager:true  */
/* globals StartScreen:true  */
/* globals LevelNest:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals GameOverScreen:true  */
/* globals Bird:true  */


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

        var listener = new Box2D.Dynamics.b2ContactListener();
        listener.BeginContact = function(contact) {

            self.gameContainer.handleBeginContact(contact);

            var colliderA = contact.GetFixtureA().GetBody().GetUserData();
            var colliderB = contact.GetFixtureB().GetBody().GetUserData();

            if(colliderA === "ground" || colliderB === "ground"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "rock" || colliderB === "rock"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "leaf" && colliderB === "bird" || colliderB === "bird" && colliderA === "leaf"){
                if(!self.collisionDetected){
                    // make leaf move a bit
                    console.log("[APP] leaf collided "+colliderA, colliderB);
                    SoundManager.playBounce();
                    self.stats.increaseBounce();
                }
            }
            else if(colliderA === "nest" || colliderB === "nest"){
                if(!self.collisionDetected){
                    self.gameContainer.bird.rest();
                    showNextLevelScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "tornado" || colliderB === "tornado"){
                console.log("[APP] egg passed tornado");
                self.gameContainer.bird.tornadoFly();
            }
            else if(colliderA === "enemyBird" || colliderB === "enemyBird"){
                console.log("[APP] egg collided with enemybird");
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "balloon" || colliderB === "balloon"){
                console.log("[APP] egg collided with balloon");
                showGameOverScreen();
                self.collisionDetected = true;
            }
        };
        listener.EndContact = function(contact) {
            self.gameContainer.handleEndContact(contact);
        };
        listener.PostSolve = function(contact, impulse) {

        };
        listener.PreSolve = function(contact, oldManifold) {

        };
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

        $(document).on("keyup",function(e){
            console.log("[APP] keycode: "+e.which);
            if(e.which === 32){
                launchEgg();
            }
            else if(e.which === 39){
                self.gameContainer.bird.moveRight();
            }
            else if(e.which === 37){
                self.gameContainer.bird.moveLeft();
            }
            else if(e.which === 38){
                self.gameContainer.bird.fly();
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
        if(self.stats!=null){
            level = self.gameData.getLevel(self.stats.level);
            self.stats.resetBounces();
            self.stats.leafsCount = $(level).find('leaf').length;
        }

        $(level).find('background').each(function(i, obj){
            self.gameContainer.createBackground($(obj).attr("img"));
        });
        $(level).find('ground').each(function(i, obj){
            self.gameContainer.createGround($(obj).attr("img"), self.width/2, self.height - parseInt($(obj).attr("height")), self.width, parseInt($(obj).attr("height")));
        });
        $(level).find('tree').each(function(i, obj){
            self.gameContainer.createTree($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("width"), $(obj).attr("height"));
        });
        $(level).find('leaf').each(function(i, obj){
            self.gameContainer.createLeaf($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("rotation"), $(obj).attr("restitution"));
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
        $(level).find('enemyBird').each(function(i, obj){
            self.gameContainer.createEnemyBird($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('balloon').each(function(i, obj){
            self.gameContainer.createBalloon($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('egg').each(function(i, obj){
            self.gameContainer.createBird($(obj).attr("x"), $(obj).attr("y"));
            self.gameContainer.bird.setMaxRotations(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("maxRotations"));
            self.gameContainer.bird.setEvolution(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("evolution"));
        });
    }


    // --------------- CREATE STATIC GAME INFO

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        this.stats.view.addEventListener(Statistics.LEVELS_CLICKED, showLevelsScreen);
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
            if(instructionsData.length > 0 && !self.gameData.didUserGetInstructionForLevel(self.stats.level)){
                console.log("[APP] show instructions");
                showInstructionsScreen(instructionsData);
            }
            else{
                console.log("[APP] start game");
                startGame();
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
            self.gameData.storeGamerInstructionGiven(self.stats.level);
            startGame();
        });
    }

    function startGame(){
        self.isPaused = false;
        SoundManager.togglePlayBackgroundMusic();
    }

    function showGameOverScreen(){
        SoundManager.playGameOver();
        self.screenManager.showScreen(ScreenManager.GAME_OVER);
        self.screenManager.view.on(GameOverScreen.RESTART_LEVEL, restartLevelHandler);
    }

    function showNextLevelScreen(){
        SoundManager.playSuccess();
        self.gameData.storeGamerLevelData(this.stats.level, this.stats.getStars()); // KEEP GAMER DATA STORED
        console.log("[stars] "+this.stats.getStars());
        self.screenManager.showNextLevelScreen();
        self.screenManager.view.on(NextLevelScreen.NEXT_LEVEL, nextLevelHandler);
    }

    function launchEgg(){
        console.log("[APP] game paused: " + self.isPaused);
        if(self.levelStarted || self.isPaused)
        {
            return;
        }
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


