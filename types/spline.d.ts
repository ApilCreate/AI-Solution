declare module '@splinetool/react-spline' {
  import { ComponentType } from 'react';
  
  export interface SplineProps {
    scene: string;
    onLoad?: () => void;
    onError?: (error: any) => void;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  const Spline: ComponentType<SplineProps>;
  export default Spline;
}
