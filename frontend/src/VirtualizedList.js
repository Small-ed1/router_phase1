import React, { useState, useEffect, useRef, useCallback } from 'react';

const VirtualizedList = ({
  items,
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeightState, setContainerHeightState] = useState(containerHeight);
  const scrollElementRef = useRef(null);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeightState) / itemHeight) + overscan
  );

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);

  useEffect(() => {
    const updateHeight = () => {
      if (scrollElementRef.current) {
        setContainerHeightState(scrollElementRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={`virtualized-list ${className}`}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hook for measuring item heights dynamically
export const useDynamicVirtualization = (items, estimatedItemHeight = 60) => {
  const [measuredHeights, setMeasuredHeights] = useState(new Map());
  const [totalHeight, setTotalHeight] = useState(items.length * estimatedItemHeight);

  const measureItem = useCallback((index, height) => {
    setMeasuredHeights(prev => {
      const newHeights = new Map(prev);
      const heightChanged = newHeights.get(index) !== height;

      if (heightChanged) {
        newHeights.set(index, height);
        // Recalculate total height
        let newTotal = 0;
        for (let i = 0; i < items.length; i++) {
          newTotal += newHeights.get(i) || estimatedItemHeight;
        }
        setTotalHeight(newTotal);
      }

      return newHeights;
    });
  }, [items.length, estimatedItemHeight]);

  const getItemHeight = useCallback((index) => {
    return measuredHeights.get(index) || estimatedItemHeight;
  }, [measuredHeights, estimatedItemHeight]);

  const getOffsetForIndex = useCallback((index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);

  const getIndexForOffset = useCallback((offset) => {
    let currentOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const itemHeight = getItemHeight(i);
      if (currentOffset + itemHeight > offset) {
        return i;
      }
      currentOffset += itemHeight;
    }
    return items.length - 1;
  }, [items.length, getItemHeight]);

  return {
    totalHeight,
    measureItem,
    getItemHeight,
    getOffsetForIndex,
    getIndexForOffset,
  };
};

export default VirtualizedList;