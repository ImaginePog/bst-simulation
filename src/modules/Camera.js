import EventHandler from "./EventHandler";
import Settings from "./Settings";
import { clamp } from "./utils";

// Handles the translation of the context according to the given settings
class Camera {
  constructor(worldBounds, canvas) {
    // Target the center of the canvas
    this.targetX = canvas.width / 2;
    this.targetY = canvas.height / 2;

    // To track if camera has moved
    this.lastTargetX = this.targetX;
    this.lastTargetY = this.targetY;
    this.hasMoved = false;

    // Flag to track if the camera should be used
    this.on = false;

    this.updateSettings(worldBounds, canvas);
    this.calibrate();
  }

  // Updates the camera settings based on the given world and canvas
  updateSettings(worldBounds, canvas) {
    this.worldBounds = worldBounds;
    this.canvas = canvas;
    this.on =
      this.worldBounds.minX < -Settings.constants.WORLD_PADDING ||
      this.worldBounds.maxX >
        this.canvas.width + Settings.constants.WORLD_PADDING ||
      this.worldBounds.minY < -Settings.constants.WORLD_PADDING ||
      this.worldBounds.maxY >
        this.canvas.width + Settings.constants.WORLD_PADDING;
    this.speedX = (1 / 100) * worldBounds.maxX;
    this.speedY = (1 / 100) * worldBounds.maxY;
  }

  // Calibrates the canvas according to the target position
  calibrate() {
    this.x = clamp(
      this.targetX - this.canvas.width / 2,
      this.worldBounds.minX,
      this.worldBounds.maxX - this.canvas.width
    );
    this.y = clamp(
      this.targetY - this.canvas.height / 2,
      this.worldBounds.minY,
      this.worldBounds.maxY - this.canvas.height
    );
  }

  // Moves the target for the camera by 1 % of the world's width and height
  // Limits the target position based on the world and the canvas
  update() {
    if (EventHandler.isKeyPressed("ArrowRight")) {
      this.targetX += this.speedX;
    }

    if (EventHandler.isKeyPressed("ArrowLeft")) {
      this.targetX -= this.speedX;
    }

    if (EventHandler.isKeyPressed("ArrowUp")) {
      this.targetY -= this.speedY;
    }

    if (EventHandler.isKeyPressed("ArrowDown")) {
      this.targetY += this.speedY;
    }

    if (this.targetX - this.canvas.width / 2 < this.worldBounds.minX) {
      this.targetX = this.worldBounds.minX + this.canvas.width / 2;
    } else if (this.targetX + this.canvas.width / 2 > this.worldBounds.maxX) {
      this.targetX = this.worldBounds.maxX - this.canvas.width / 2;
    }

    if (this.targetY - this.canvas.height / 2 < 0) {
      this.targetY = this.canvas.height / 2;
    } else if (this.targetY + this.canvas.height / 2 > this.worldBounds.maxY) {
      this.targetY = this.worldBounds.maxY - this.canvas.height / 2;
    }

    this.hasMoved =
      this.targetX != this.lastTargetX || this.targetY != this.lastTargetY;
    this.lastTargetX = this.targetX;
    this.lastTargetY = this.targetY;

    this.calibrate();
  }

  // Translates the context to the calibrated position
  move(ctx) {
    ctx.translate(-this.x, -this.y);
  }

  // Resets the transformation matrix of the context
  reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  center() {
    this.targetX = this.canvas.width / 2;
    this.targetY = this.canvas.height / 2;
  }
}

export default Camera;
