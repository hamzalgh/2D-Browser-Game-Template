export enum DeviceOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait'
}

export interface ViewportDimensions {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: DeviceOrientation;
  aspectRatio: number;
  isMobile: boolean;
}
