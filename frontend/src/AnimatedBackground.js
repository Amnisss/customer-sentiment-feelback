import React from "react";

function AnimatedBackground() {
  return (
    <div style={styles.background}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="animated-circle"
          style={{
            ...styles.circle,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}
      <style>
        {`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-150px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
        }
        .animated-circle {
          animation: float infinite ease-in-out;
        }
      `}
      </style>
    </div>
  );
}

const styles = {
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
  },
  circle: {
    position: "absolute",
    bottom: "-60px",
    width: "50px",
    height: "50px",
    backgroundColor: "#C2DCDB",
    borderRadius: "50%",
    opacity: 0.3,
  },
};

export default AnimatedBackground;
