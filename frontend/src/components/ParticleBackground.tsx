import { useEffect, useRef } from "react";
import p5 from "p5";

export const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let repelRadius = 0;
    let cubeSize = 0;
    let angle = 0;
    const points: {
      index: number;
      pos: p5.Vector; // Current 2D position on screen
      val: p5.Vector; // Velocity
      home3D: p5.Vector; // The fixed 3D position inside the cube
    }[] = [];

    // Dense particle count for the cube volume
    const particleCount = 1024;
    const attraction = 0.04; // Stronger pull to keep the cube shape crisp
    const damping = 0.4; // More friction
    const repelStrength = 2; // Much subtler repulsion (was 10)

    const sketch = (p: p5) => {
      p.setup = () => {
        // Responsive setup
        const isMobile = p.windowWidth < 768;
        p.createCanvas(p.windowWidth, p.windowHeight).parent(
          containerRef.current!
        );

        if (isMobile) {
          cubeSize = p.windowHeight * 0.25; // Scale with height
          repelRadius = 80;
        } else {
          cubeSize = p.windowHeight * 0.35; // Large enough to fill vertical space
          repelRadius = 200;
        }

        p.pixelDensity(1);
        // Dark subtle particles for light background
        p.stroke(0, 0, 0, 80);
        p.strokeWeight(2.5);

        // Initialize points
        for (let i = 0; i < particleCount; i++) {
          // Generate points inside a cube volume centered at 0,0,0
          // Assume cube spans from -cubeSize to +cubeSize
          const x = p.random(-cubeSize, cubeSize);
          const y = p.random(-cubeSize, cubeSize);
          const z = p.random(-cubeSize, cubeSize);

          // Project initial position immediately so they don't fly in from center
          // We assume initial angle is 0
          // Initial rotation (angle=0):
          // Rotate Y (cos0=1, sin0=0) -> x1=x, z1=z, y1=y
          // Rotate X (cos0=1, sin0=0) -> y2=y, x2=x
          // So initially 2D pos is just (x, y)

          points.push({
            index: i,
            pos: p.createVector(x, y), // Start at correct position
            val: p.createVector(0, 0),
            home3D: p.createVector(x, y, z),
          });
        }
      };

      p.draw = () => {
        p.clear(); // Transparent background

        // Translate to RIGHT edge (width) and Vertically Centered
        // This makes it "half on, half off" the screen
        const centerX = p.width;
        const centerY = p.height * 0.5;
        p.translate(centerX, centerY);

        // Adjust mouse coords relative to our new center
        const mouse = p.createVector(p.mouseX - centerX, p.mouseY - centerY);

        // Rotation Matrix logic (manual 3D projection)
        // We rotate on a "vertex" which basically means shifting X and Y rotation
        // Rotating around diagonal axis (1, 1, 0) gives a nice tumble
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const cosB = Math.cos(angle * 0.6); // Different speed for second axis
        const sinB = Math.sin(angle * 0.6);

        for (const pt of points) {
          // 1. Rotate the persistent 3D home position
          // Rotate Y
          const x1 = pt.home3D.x * cosA - pt.home3D.z * sinA;
          const z1 = pt.home3D.z * cosA + pt.home3D.x * sinA;
          const y1 = pt.home3D.y;

          // Rotate X
          const y2 = y1 * cosB - z1 * sinB;
          // let z2 = z1 * cosB + y1 * sinB; // Unused for 2D projection
          const x2 = x1;

          // 2. Project 3D to 2D (Isometric-ish / Orthographic Projection)
          // Since we are just drawing a flat cloud, we can just drop Z or use it for depth scale (optional)
          // Simple orthographic: just use x2, y2 as target
          const home2D = p.createVector(x2, y2);

          // --- Physics ---

          // Spring force to home
          const toHome = p5.Vector.sub(home2D, pt.pos);
          const spring = toHome.mult(attraction);
          pt.val.add(spring);

          // Mouse repulsion
          const awayFromMouse = p5.Vector.sub(pt.pos, mouse);
          const distSq = awayFromMouse.magSq();

          if (distSq > 0.1 && distSq < repelRadius * repelRadius) {
            const distance = Math.sqrt(distSq);
            awayFromMouse.normalize();

            // Stronger repulsion at center
            const repel = repelStrength * (1 - distance / repelRadius);
            awayFromMouse.mult(repel);
            pt.val.add(awayFromMouse);
          }

          // Physics update
          pt.val.mult(damping);
          pt.pos.add(pt.val);

          // Draw point
          p.point(pt.pos.x, pt.pos.y);
        }

        // Constant rotation - slowed down
        angle += 0.001;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch);

    return () => {
      myP5.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, // Behind content
        opacity: 0.8,
        pointerEvents: "auto", // Allow mouse interaction
        overflow: "hidden",
      }}
    />
  );
};
