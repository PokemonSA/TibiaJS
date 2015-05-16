﻿
var config: Config;

window.onload = function () {

    var renderingSystem: RenderingSystem;
    var cameraSystem = new CameraSystem();
    var inputSystem = new InputSystem();
    var movemnetSystem = new MovementSystem();
    var collisionSystem = new ColliisonSystem();
    var networkSystem = new NetworkSystem();
    var characterAnimationSystem = new AnimationSystem();
    var world = new World();



    var queue = new createjs.LoadQueue(true);
    queue.loadFile({ src: "data.json", id: "config" });
    queue.loadFile({ src: "sprites.png", id: "sprites" });

    queue.on("fileload", function (data: any) {
        if (data.item.id === "config") { console.log("config loaded"); config = data.result; }
        if (data.item.id === "sprites") {
            var canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
            renderingSystem = new RenderingSystem(canvas, data.result);
        }
    });

    queue.on("complete", function () {
        var map = new GameObj();
        map.ID = 1541515125;
        map.AddComponent(new PositionComponent(0, 0, Rotation.Down));
        map.AddComponent(new RenderMapComponent(config.Data, config.MapWidth, config.MapHeight));
        world.Add(map);
        networkSystem.connect();

        setInterval(() => {
            var test = new GameObj();
            test.ID = Math.random() * 10000;
            test.AddComponent(new PositionComponent(50 + Math.random() * 30, 60+ Math.random() * 30, Rotation.Down));
            test.AddComponent(new SpriteComponent(config.Animations.Beam.Sprites[0]));
            test.AddComponent(new SimpleAnimationComponent(config.Animations.Beam.Sprites, false));
            world.Add(test); }, 10000);
        requestAnimationFrame(Loop);
    });

    queue.load();

    function Loop() {
        world.FPS = GetFPS();
        inputSystem.Process(world);
        
        //collisionSystem.Process(world);
        characterAnimationSystem.Process(world);
        movemnetSystem.Process(world);
        cameraSystem.Process(world);
      
        
        networkSystem.Process(world);
        //console.log(world.GetEventByType(Events.TxtSpawn).length);
        renderingSystem.Process(world);
        renderingSystem.RenderAll(cameraSystem.GetCamerasList());
       
        world.ClearEvets();
        requestAnimationFrame(Loop);
    }
}

