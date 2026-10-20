function square(x) {
    return x * x;
}

function cartesianDistance(x1, y1, x2, y2) {
    return (square(x2 - x1) + square(y2 - y1)) ** 0.5;
}

function getCenterOffset(parentDimension, childDimension) {
    return (parentDimension - childDimension) / 2;
}

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
    return (radians * 180) / Math.PI;
}

function getXOnCircle(originX, radius, theta) {
    return originX + radius * Math.cos(toRadians(theta));
}

function getYOnCircle(originY, radius, theta) {
    return originY + radius * Math.sin(toRadians(theta));
}

module.exports = {
    cartesianDistance,
    getCenterOffset,
    getXOnCircle,
    getYOnCircle,
    toRadians,
    toDegrees,
};