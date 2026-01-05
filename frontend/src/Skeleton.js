import React from 'react';

const Skeleton = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'text',
  animation = 'pulse'
}) => {
  const baseClasses = 'skeleton';

  const variantClasses = {
    text: 'skeleton-text',
    rectangular: 'skeleton-rectangular',
    circular: 'skeleton-circular',
    avatar: 'skeleton-avatar',
  };

  const animationClasses = {
    pulse: 'skeleton-pulse',
    wave: 'skeleton-wave',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.text,
    animationClasses[animation] || animationClasses.pulse,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ width, height }}
    />
  );
};

// Predefined skeleton components
export const SkeletonText = ({ lines = 1, width = '100%', ...props }) => (
  <div className="skeleton-text-block">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '60%' : width}
        height="1rem"
        variant="text"
        {...props}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ height = '200px', ...props }) => (
  <div className="skeleton-card">
    <Skeleton height="2rem" width="80%" className="skeleton-card-title" {...props} />
    <Skeleton height={height} variant="rectangular" className="skeleton-card-content" {...props} />
    <div className="skeleton-card-footer">
      <Skeleton width="40%" height="0.8rem" {...props} />
      <Skeleton width="30%" height="0.8rem" {...props} />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, ...props }) => (
  <div className="skeleton-table">
    {/* Header */}
    <div className="skeleton-table-header">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={i} height="1.2rem" width="100%" {...props} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <Skeleton
            key={colIndex}
            height="1rem"
            width="100%"
            {...props}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = '40px', ...props }) => (
  <Skeleton
    width={size}
    height={size}
    variant="circular"
    {...props}
  />
);

export const SkeletonButton = ({ width = '120px', ...props }) => (
  <Skeleton
    width={width}
    height="2.5rem"
    variant="rectangular"
    className="skeleton-button"
    {...props}
  />
);

export default Skeleton;