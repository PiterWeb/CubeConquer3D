declare global {
    /** Perlin noise helper functions */
    var noise: {
        /** Give a seed to the noise generator */
        seed: (seed: number) => void;
        /** 2D simplex noise */
        simplex2: (x: number, y: number) => number;
        /** 3D simplex noise */
        simplex3: (x: number, y: number, z: number) => number;
        /** 2D perlin noise */
        perlin2: (x: number, y: number) => number;
        /** 3D perlin noise */
        perlin3: (x: number, y: number, z: number) => number;
    };
}

export {};
