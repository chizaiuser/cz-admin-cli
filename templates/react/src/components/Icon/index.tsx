import React from 'react';

interface AppIconProps {
  name: string; // 图标名（不带扩展名）
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  onClick?: (event: any) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, color, onClick  }) => {
  // 动态引入 SVG
  return (
    <i
      className={['iconfont', `icon-${name}`].join(' ')}
      style={{
        fontSize: size + 'px',
        color: color,
      }}
      onClick={onClick}
    ></i>
  );
};

export default AppIcon; 