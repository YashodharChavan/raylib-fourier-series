const r = require("raylib");
const g = require("./geometry");

function initializeReadingLine(world) {
    return {
        start: {
            x: world.windowWidth / 2.5,
            y: 50,
        },
        end: {
            x: world.windowWidth / 2.5,
            y: world.windowHeight - 50,
        },
    };
}

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
        circleCount: 3,
    };

    world.readingLine = initializeReadingLine(world);

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

function drawFourierCircles(world) {
    let originX = world.origin.x;
    let originY = world.origin.y;
    let radius = world.radius;

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < world.circleCount; i++) {
        radius = Math.ceil(radius / (2 * i + 1));
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

function visualizeFourierSeries(world) {
    const centerX = world.readingLine.start.x;
    const centerY = world.readingPoint.y;

    r.DrawCircle(centerX, centerY, 5, r.RED);
    r.DrawLineEx(world.readingLine.start, world.readingLine.end, 1, r.WHITE);

    for (let x = centerX; x < world.windowWidth; x += 0.125) {
        // This part of calculating phaseOffset and angle was done in trial and error after getting a small hint from chatGPT. Earlier I was trying to draw sine wave without involvement of phase shift. In every increment of theta, the phase of sine wave changes. I have understood this part. 
        const phaseOffset = x - centerX;

        const angle = world.theta - phaseOffset;
        const radians = g.toRadians(angle);

        const originY = world.origin.y;
        const radius = world.radius;

        const Y =
        originY - radius * fourierEquation(radians, world.circleCount);

        r.DrawCircle(x, Y, 1, r.WHITE);
    }
}

function joinPoints(world) {
    const startX = world.readingPoint.x;
    const endX = world.readingLine.start.x;
    const commonY = world.readingPoint.y;

    r.DrawLine(startX, commonY, endX, commonY, r.WHITE)
}

function draw(world) {
    r.BeginDrawing();
    r.ClearBackground(r.BLACK);

    drawCircle(world.origin, world.radius);
    drawFourierCircles(world);
    visualizeFourierSeries(world);
    joinPoints(world);

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
