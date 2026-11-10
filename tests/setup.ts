// Mock HTMLCanvasElement.getContext for jsdom unit testing environment
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = ((type: string) => {
    if (type === '2d') {
      return {
        fillStyle: '',
        fillRect: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        putImageData: () => {},
        createImageData: () => ({ data: new Uint8ClampedArray(4) }),
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        strokeRect: () => {},
        strokeText: () => {},
        arc: () => {},
        measureText: () => ({ width: 0 })
      };
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
