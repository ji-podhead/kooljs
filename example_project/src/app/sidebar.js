import { animated, useSpring } from '@react-spring/web'
import { useState, useEffect, useMemo } from 'react';

const Taskbar = ({ mainProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(mainProps)
  console.log(Object.keys(mainProps))
  const size= mainProps.screenSize
const sidebarWidth=mainProps.mainProps.screenSize.sidebarWidth
const taskbarHeight = mainProps.mainProps.screenSize.taskbarHeight

console.log(sidebarWidth)
  const taskbarAnimation = useSpring({
    from: { x: -sidebarWidth },
    to: { x: 0 },
    config: { tension: 200, friction: 20 },
    reset: true,
    reverse: !isHovered,
  });

  const underlineAnimation = useSpring({
    from: { opacity: 0, y: -taskbarHeight },
    to: { opacity: 1, y: 0 },
    config: { tension: 200, friction: 20 },
    reset: true,
    reverse: !isHovered,
  });

  const backgroundColorAnimation = useSpring({
    from: { backgroundColor: '#ccc' },
    to: { backgroundColor: '#fff' },
    config: { tension: 200, friction: 20 },
    reset: true,
    reverse: !isHovered,
  });

  const textColorAnimation = useSpring({
    from: { color: 'rgba(0, 0, 0, 0)' },
    to: { color: 'rgba(0, 0, 0, 1)' },
    config: { tension: 200, friction: 20 },
    reset: true,
    reverse: !isHovered,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <animated.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: sidebarWidth,
        height: taskbarHeight,
        backgroundColor: backgroundColorAnimation.backgroundColor,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <animated.div
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#ccc',
          position: 'absolute',
          bottom: 0,
          left: 0,
          transform: underlineAnimation.y,
          opacity: underlineAnimation.opacity,
        }}
      />
      <animated.div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: textColorAnimation.color,
        }}
      >
        Taskbar
      </animated.div>
      <animated.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: taskbarAnimation.x,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Unterpunkt 1</div>
          <div>Unterpunkt 2</div>
          <div>Unterpunkt 3</div>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Taskbar;