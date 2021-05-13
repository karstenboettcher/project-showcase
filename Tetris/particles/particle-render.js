// Credit: Dean Mathias - USU CS 5410

// Renders the particles in a particle system
let particleRender = function (system, imageSrc) {
  "use strict";

  let image = new Image();
  let isReady = false; // Can't render until the texture is loaded

  //
  // Get the texture to use for the particle system loading and ready for rendering
  image.onload = function () {
    isReady = true;
  };
  image.src = imageSrc;

  // Render all particles
  function render() {
    if (isReady) {
      Object.getOwnPropertyNames(system.particles).forEach((value) => {
        let particle = system.particles[value];
        ctx.save();
        ctx.translate(particle.center.x, particle.center.y);
        ctx.rotate(particle.rotation);
        ctx.translate(-particle.center.x, -particle.center.y);
        ctx.drawImage(
          image,
          particle.center.x - particle.size.x / 2,
          particle.center.y - particle.size.y / 2,
          particle.size.x,
          particle.size.y
        );
        ctx.restore();
      });
    }
  }

  let api = {
    render: render,
  };

  return api;
};
