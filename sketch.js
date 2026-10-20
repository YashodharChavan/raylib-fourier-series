const r = require("raylib");
const g = require("./geometry");

function setup() {
    const world = {
        windowWidth: 1000,
        windowHeight: 400,
        origin: {},
        radius: 100,
        theta: 0,
        readingPoint: {},
        readingLine: {
            start: {},
            end: {},
        },
        totalCircles: 2,
    };

    world.readingLine.start = { x: world.windowWidth / 2.5, y: 50 };
    world.readingLine.end = {
        x: world.windowWidth / 2.5,
        y: world.windowHeight - 50,
    };

    world.origin.x = world.windowWidth / 5;
    world.origin.y = world.windowHeight / 2;

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "FOURIER SERIES");
    r.SetTargetFPS(60);

    return world;
}

function isRunning() {
    return !r.WindowShouldClose();
}

function fourierEquation(X, n) {
    let sineValue = 0;

    for (let i = 0; i < n; i++) {
        sineValue += Math.sin(Math.PI + (2 * i + 1) * X) / (2 * i + 1);
    }

    return sineValue;
}

function drawCircle(origin, radius) {
    r.DrawRing(origin, radius - 0.5, radius + 0.5, 0, 360, 80, r.WHITE);
}

function drawReadingPoint(world) {
    let originX = world.origin.x;
    let originY = world.origin.y;
    let radius = world.radius;

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < world.totalCircles; i++) {
        radius /= 2 * i + 1;
        posX = g.getXOnCircle(originX, radius, (2 * i + 1) * world.theta);
        posY = g.getYOnCircle(originY, radius, (2 * i + 1) * world.theta);

        drawCircle({ x: originX, y: originY }, radius);

        originX = posX;
        originY = posY;
    }

    world.readingPoint = {
        x: posX,
        y: posY,
    };

    r.DrawCircleV(world.readingPoint, 5, r.RED);
}

function drawPointOnReadingLine(world) {
    const centerX = world.readingLine.start.x;
    const centerY = world.readingPoint.y;

    r.DrawCircle(centerX, centerY, 5, r.RED);

    for (let x = centerX; x < world.windowWidth; x += 0.5) {
        const distance = x - centerX;
        const angle = world.theta - distance;
        const originY = world.origin.y;
        const radius = world.radius;

        const Y =
            world.origin.y -
            world.radius *
                fourierEquation((angle * Math.PI) / 180, world.totalCircles);

        // const Y =
        //     originY - radius * Math.sin(Math.PI + (angle * Math.PI) / 180)
        // fourierEquation(
        //     Math.PI + (angle * Math.PI) / 180,
        //     world.totalCircles,
        // );

        r.DrawCircle(x, Y, 1, r.WHITE);
    }
}

function drawReadingLine(world) {
    r.DrawLineEx(world.readingLine.start, world.readingLine.end, 1, r.WHITE);
}

function draw(world) {
    r.BeginDrawing();
    r.ClearBackground(r.BLACK);

    drawCircle(world.origin, world.radius);
    drawReadingPoint(world);
    drawReadingLine(world);
    drawPointOnReadingLine(world);

    r.EndDrawing();
}

function update(world) {
    world.theta += 1;
}

function tearDown() {
    r.CloseWindow();
}

module.exports = {
    setup,
    isRunning,
    draw,
    update,
    tearDown,
};
