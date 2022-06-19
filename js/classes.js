class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    cropCount = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.cropCount = cropCount;
    this.countFrames = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.countFrames * (this.image.width / this.cropCount),
      0,
      this.image.width / this.cropCount,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.cropCount) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.countFrames < this.cropCount - 1) {
        this.countFrames++;
      } else {
        this.countFrames = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    cropCount = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: 0,
      height: 0,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      cropCount,
      offset,
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      offset: attackBox.offset,
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      heigth: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.countFrames = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.isDead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();

    if (!this.isDead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.countFrames === this.sprites.death.cropCount - 1)
        this.isDead = true;
      return;
    }

    if (
      this.image === this.sprites.attack1.image &&
      this.countFrames < this.sprites.attack1.cropCount - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.countFrames < this.sprites.takeHit.cropCount - 1
    )
      return;

    switch (sprite) {
      case "idie":
        if (this.image !== this.sprites.idie.image) {
          this.image = this.sprites.idie.image;
          this.cropCount = this.sprites.idie.cropCount;
          this.countFrames = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.cropCount = this.sprites.run.cropCount;
          this.countFrames = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.cropCount = this.sprites.jump.cropCount;
          this.countFrames = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.cropCount = this.sprites.fall.cropCount;
          this.countFrames = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.cropCount = this.sprites.attack1.cropCount;
          this.countFrames = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.cropCount = this.sprites.takeHit.cropCount;
          this.countFrames = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.cropCount = this.sprites.death.cropCount;
          this.countFrames = 0;
        }
        break;
      default:
        break;
    }
  }
}
