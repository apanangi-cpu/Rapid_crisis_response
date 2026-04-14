import Particles from "react-tsparticles";

export default function ParticlesBg() {
  return (
    <Particles
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        particles: {
          number: { value: 45 },
          size: { value: 2 },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.4 },
          links: {
            enable: true,
            distance: 130,
            opacity: 0.15
          }
        },
        background: {
          color: "transparent"
        }
      }}
    />
  );
}