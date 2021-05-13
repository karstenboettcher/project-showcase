class ParticleSystem {
  constructor() {
    this.particles = {};
    this.nextName = 1;
  }

  land(arr) {
    let arrStr = JSON.stringify(arr);
    for (let i = 0; i < arr.length; i++) {
      if (!arrStr.includes(JSON.stringify([arr[i][0] - 1, arr[i][1]]))) {
        this.createLandParticles(arr[i][0], arr[i][1], "l");
      }
      if (!arrStr.includes(JSON.stringify([arr[i][0] + 1, arr[i][1]]))) {
        this.createLandParticles(arr[i][0], arr[i][1], "r");
      }
      if (!arrStr.includes(JSON.stringify([arr[i][0], arr[i][1] - 1]))) {
        this.createLandParticles(arr[i][0], arr[i][1], "u");
      }
      if (!arrStr.includes(JSON.stringify([arr[i][0], arr[i][1] + 1]))) {
        this.createLandParticles(arr[i][0], arr[i][1], "d");
      }
    }
  }

  createLandParticles(x, y, dir) {
    switch (dir) {
      case "l":
        for (let particle = 0; particle < 5; particle++) {
          this.particles[this.nextName++] = this.landParticle(
            x * cellSize + (canvas.width / 4),
            (Math.random() * (y + 1 - y) + y) * cellSize,
            { x: -1, y: 0 }
          );
        }
        break;
      case "r":
        for (let particle = 0; particle < 5; particle++) {
          this.particles[this.nextName++] = this.landParticle(
            (x + 1) * cellSize + (canvas.width / 4),
            (Math.random() * (y + 1 - y) + y) * cellSize,
            { x: 1, y: 0 }
          );
        }
        break;
      case "u":
        for (let particle = 0; particle < 5; particle++) {
          this.particles[this.nextName++] = this.landParticle(
            (Math.random() * (x + 1 - x) + x) * cellSize + (canvas.width / 4),
            y * cellSize,
            { x: 0, y: -1 }
          );
        }
        break;
      case "d":
        for (let particle = 0; particle < 5; particle++) {
          this.particles[this.nextName++] = this.landParticle(
            (Math.random() * (x + 1 - x) + x) * cellSize + (canvas.width / 4),
            (y + 1) * cellSize,
            { x: 0, y: 1 }
          );
        }
        break;
    }
  }

  clear(arr, width) {
    let location = arr[arr.length - 1];
    let amt = [];
    let count = 1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1] - 1) {
        count++;
      } else {
        amt.push(count);
        count = 1;
      }
    }

    amt.reverse();
    for (let i = 0; i < amt.length; i++) {
      for (let particle = 0; particle < amt[i] * 150; particle++) {
        this.particles[this.nextName++] = this.clearParticle(
          Math.floor(Math.random() * (width * cellSize) + (canvas.width / 4)),
          (location + 1 - i) * cellSize,
          { x: 0, y: -1 }
        );
      }
    }
  }

  update(elapsedTime) {
    elapsedTime = elapsedTime / 1000;
    let removeMe = [];
    Object.getOwnPropertyNames(this.particles).forEach((value) => {
      let particle = this.particles[value];
      particle.alive += elapsedTime;
      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;
      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });

    for (let particle = 0; particle < removeMe.length; particle++) {
      delete this.particles[removeMe[particle]];
    }
    removeMe.length = 0;
  }

  landParticle(x, y, dir) {
    let p = {
      center: { x: x, y: y },
      size: { x: 10, y: 10 },
      direction: dir,
      speed: Random.nextGaussian(12, 5),
      lifetime: Random.nextGaussian(0.5, 0.5),
      alive: 0,
    };

    return p;
  }

  clearParticle(x, y, dir) {
    let p = {
      center: { x: x, y: y },
      size: { x: 10, y: 10 },
      direction: dir,
      speed: Random.nextGaussian(15, 5),
      lifetime: Random.nextGaussian(0.5, 0.5),
      alive: 0,
    };

    return p;
  }
}
