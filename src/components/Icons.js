import React, { useMemo } from 'react';
import Svg, { Path, Circle, G, Rect, LinearGradient, Stop, Defs } from 'react-native-svg';
import { StyleSheet } from 'react-native';

// Generate unique IDs for SVG gradients
// Using a counter instead of random to ensure consistent IDs across renders
let idCounter = 0;
const uniqueId = () => {
  // Only increment during component initialization, not during renders
  return `gradient_id_${idCounter++}`;
};

// Helper function to create icon with gradient
const createIconWithGradient = (IconComponent, gradientColors) => (props) => {
  const gradientId = uniqueId();
  // Use useMemo to ensure consistent rendering
  return useMemo(() => {
    return IconComponent(gradientId, props);
  }, [props.width, props.height, props.style]);
};

// Modern SVG icons for the app
export const Icons = {
  // Navigation and UI icons
  notification: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="1" stopColor="#f0f0f0" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  search: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#3949ab" stopOpacity="1" />
              <Stop offset="1" stopColor="#5c6bc0" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  close: (props) => {
    // Use useMemo to ensure consistent rendering
    return useMemo(() => {
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Path 
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" 
            fill="#666666" 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]);
  },
  
  // Feature icons with gradients
  budget: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="1" stopColor="#2E7D32" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  investment: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#1976D2" stopOpacity="1" />
              <Stop offset="1" stopColor="#0D47A1" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M3.5 18.49L9.5 12.48L13.5 16.48L22 6.92L20.59 5.51L13.5 13.48L9.5 9.48L2 16.99L3.5 18.49Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  security: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F44336" stopOpacity="1" />
              <Stop offset="1" stopColor="#B71C1C" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  learning: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#9C27B0" stopOpacity="1" />
              <Stop offset="1" stopColor="#6A1B9A" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  games: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FF9800" stopOpacity="1" />
              <Stop offset="1" stopColor="#E65100" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M15 7.5V2H9V7.5L12 10.5L15 7.5ZM7.5 9H2V15H7.5L10.5 12L7.5 9ZM9 16.5V22H15V16.5L12 13.5L9 16.5ZM16.5 9L13.5 12L16.5 15H22V9H16.5Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  calculator: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#607D8B" stopOpacity="1" />
              <Stop offset="1" stopColor="#37474F" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM13.03 7.06L14.09 6L15.5 7.41L16.91 6L17.97 7.06L16.56 8.47L17.97 9.88L16.91 10.94L15.5 9.54L14.09 10.94L13.03 9.88L14.44 8.47L13.03 7.06ZM6.25 7.72H11.5V9H6.25V7.72ZM14.5 16.25H16V17.5H14.5V16.25ZM8.5 16.25H10V17.5H8.5V16.25ZM6.25 16.25H7.75V17.5H6.25V16.25ZM9 11.25H6.25V12.5H9V15H10.25V12.5H13V11.25H10.25V8.75H9V11.25ZM14.5 12.5H16V13.75H14.5V12.5ZM14.5 14H16V15.25H14.5V14Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  tips: (props) => {
    // Use useMemo to ensure the gradient ID is stable across renders
    return useMemo(() => {
      const gradientId = uniqueId();
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFEB3B" stopOpacity="1" />
              <Stop offset="1" stopColor="#FBC02D" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2ZM14.85 13.1L14 13.7V16H10V13.7L9.15 13.1C7.8 12.16 7 10.63 7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 10.63 16.2 12.16 14.85 13.1Z" 
            fill={`url(#${gradientId})`} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style]); // Only re-render if these props change
  },
  
  // UI elements
  arrowDown: (props) => {
    // Use useMemo to ensure consistent rendering
    return useMemo(() => {
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Path 
            d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" 
            fill={props.color || "white"} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style, props.color]); // Include color in dependencies
  },
  
  arrowUp: (props) => {
    // Use useMemo to ensure consistent rendering
    return useMemo(() => {
      return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <Path 
            d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z" 
            fill={props.color || "white"} 
          />
        </Svg>
      );
    }, [props.width, props.height, props.style, props.color]); // Include color in dependencies
  },
};

export default Icons;