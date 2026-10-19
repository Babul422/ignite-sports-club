import * as THREE from 'three';

// Golden ratio & icosahedron normalization for mathematical truncated icosahedron
const PHI = (1 + Math.sqrt(5)) / 2;
const INV_LEN = 1 / Math.sqrt(1 + PHI * PHI);

// 12 normalized vertices of a regular icosahedron (centers of the 12 pentagons)
const ICOS_VERTICES = [
  [-1,  PHI, 0], [ 1,  PHI, 0], [-1, -PHI, 0], [ 1, -PHI, 0],
  [ 0, -1,  PHI], [ 0,  1,  PHI], [ 0, -1, -PHI], [ 0,  1, -PHI],
  [ PHI, 0, -1], [ PHI, 0,  1], [-PHI, 0, -1], [-PHI, 0,  1]
].map(([x, y, z]) => [x * INV_LEN, y * INV_LEN, z * INV_LEN]);

// 20 normalized face centers of the icosahedron (centers of the 20 hexagons)
const HEX_CENTERS: number[][] = [];
for (let i = 0; i < 12; i++) {
  for (let j = i + 1; j < 12; j++) {
    for (let k = j + 1; k < 12; k++) {
      const d1 = (ICOS_VERTICES[i][0] - ICOS_VERTICES[j][0]) ** 2 +
                 (ICOS_VERTICES[i][1] - ICOS_VERTICES[j][1]) ** 2 +
                 (ICOS_VERTICES[i][2] - ICOS_VERTICES[j][2]) ** 2;
      const d2 = (ICOS_VERTICES[j][0] - ICOS_VERTICES[k][0]) ** 2 +
                 (ICOS_VERTICES[j][1] - ICOS_VERTICES[k][1]) ** 2 +
                 (ICOS_VERTICES[j][2] - ICOS_VERTICES[k][2]) ** 2;
      const d3 = (ICOS_VERTICES[k][0] - ICOS_VERTICES[i][0]) ** 2 +
                 (ICOS_VERTICES[k][1] - ICOS_VERTICES[i][1]) ** 2 +
                 (ICOS_VERTICES[k][2] - ICOS_VERTICES[i][2]) ** 2;
      if (Math.abs(d1 - 1.0515) < 0.08 && Math.abs(d2 - 1.0515) < 0.08 && Math.abs(d3 - 1.0515) < 0.08) {
        const cx = (ICOS_VERTICES[i][0] + ICOS_VERTICES[j][0] + ICOS_VERTICES[k][0]) / 3;
        const cy = (ICOS_VERTICES[i][1] + ICOS_VERTICES[j][1] + ICOS_VERTICES[k][1]) / 3;
        const cz = (ICOS_VERTICES[i][2] + ICOS_VERTICES[j][2] + ICOS_VERTICES[k][2]) / 3;
        const len = Math.hypot(cx, cy, cz);
        HEX_CENTERS.push([cx / len, cy / len, cz / len]);
      }
    }
  }
}

// 1. PROCEDURAL IGNITE FOOTBALL TEXTURE
// Inspired directly by the IGNITE logo's cosmic blue & purple flaming crystalline soccer ball:
// Deep midnight/navy pentagons with vibrant electric-blue (#287BFF) and ice-blue (#62C7FF) seam glow,
// and metallic pearl-silver/ice-tinted hexagons with debossed stitching.
export function createFootballTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Pre-calculate trig tables for spherical equirectangular projection
  const cosTheta = new Float32Array(height);
  const sinTheta = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    const theta = (y / height) * Math.PI;
    cosTheta[y] = Math.cos(theta);
    sinTheta[y] = Math.sin(theta);
  }

  const cosPhi = new Float32Array(width);
  const sinPhi = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    const phi = (x / width) * Math.PI * 2;
    cosPhi[x] = Math.cos(phi);
    sinPhi[x] = Math.sin(phi);
  }

  const PENTAGON_THRESHOLD = 0.932;
  const PENTAGON_SEAM_OUTER = 0.912;
  const HEX_SEAM_THRESHOLD = 0.032;

  let idx = 0;
  for (let y = 0; y < height; y++) {
    const py = cosTheta[y];
    const sinT = sinTheta[y];

    for (let x = 0; x < width; x++) {
      const px = sinT * cosPhi[x];
      const pz = sinT * sinPhi[x];

      // Distance to closest pentagon center
      let maxPentDot = -1;
      for (let i = 0; i < 12; i++) {
        const dot = px * ICOS_VERTICES[i][0] + py * ICOS_VERTICES[i][1] + pz * ICOS_VERTICES[i][2];
        if (dot > maxPentDot) maxPentDot = dot;
      }

      let r = 240;
      let g = 244;
      let b = 252;

      if (maxPentDot >= PENTAGON_THRESHOLD) {
        // Deep cosmic navy/purple pentagon panel (matching logo core)
        const grad = (maxPentDot - PENTAGON_THRESHOLD) / (1 - PENTAGON_THRESHOLD);
        r = Math.floor(16 + grad * 12);
        g = Math.floor(22 + grad * 16);
        b = Math.floor(52 + grad * 34);
      } else if (maxPentDot >= PENTAGON_SEAM_OUTER) {
        // Electric Blue (#287BFF) / Ice Blue (#62C7FF) glowing seam trim
        const edgeT = (maxPentDot - PENTAGON_SEAM_OUTER) / (PENTAGON_THRESHOLD - PENTAGON_SEAM_OUTER);
        if (edgeT > 0.35 && edgeT < 0.85) {
          r = 40;
          g = 123;
          b = 255;
        } else {
          r = 20;
          g = 35;
          b = 75;
        }
      } else {
        // Hexagon panel: find two closest hexagon centers
        let hDot1 = -1;
        let hDot2 = -1;
        for (let j = 0; j < HEX_CENTERS.length; j++) {
          const dot = px * HEX_CENTERS[j][0] + py * HEX_CENTERS[j][1] + pz * HEX_CENTERS[j][2];
          if (dot > hDot1) {
            hDot2 = hDot1;
            hDot1 = dot;
          } else if (dot > hDot2) {
            hDot2 = dot;
          }
        }

        const seamDiff = hDot1 - hDot2;
        if (seamDiff < HEX_SEAM_THRESHOLD) {
          // Midnight navy seam groove between hexagons
          r = 24;
          g = 36;
          b = 68;
        } else {
          // Pearlescent icy-silver leather panel
          const bevel = Math.min(1, seamDiff * 14);
          r = Math.floor(225 + bevel * 25);
          g = Math.floor(232 + bevel * 22);
          b = Math.floor(248 + bevel * 7);
        }
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
      idx += 4;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Official IGNITE club logo insignia stamp
  ctx.save();
  ctx.fillStyle = '#287BFF';
  ctx.shadowColor = '#62C7FF';
  ctx.shadowBlur = 6;
  ctx.font = 'bold 24px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('IGNITE', width * 0.5, height * 0.48);
  ctx.fillStyle = '#8B5CF6';
  ctx.font = '700 12px "Outfit", sans-serif';
  ctx.fillText('EST. 2026 • MATCH BALL', width * 0.5, height * 0.53);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. PROCEDURAL BASKETBALL TEXTURE
export function createBasketballTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const cosTheta = new Float32Array(height);
  const sinTheta = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    const theta = (y / height) * Math.PI;
    cosTheta[y] = Math.cos(theta);
    sinTheta[y] = Math.sin(theta);
  }

  const cosPhi = new Float32Array(width);
  const sinPhi = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    const phi = (x / width) * Math.PI * 2;
    cosPhi[x] = Math.cos(phi);
    sinPhi[x] = Math.sin(phi);
  }

  let idx = 0;
  for (let y = 0; y < height; y++) {
    const py = cosTheta[y];
    const sinT = sinTheta[y];

    for (let x = 0; x < width; x++) {
      const px = sinT * cosPhi[x];
      const pz = sinT * sinPhi[x];

      const isEquator = Math.abs(py) < 0.026;
      const isMeridian = Math.abs(px) < 0.026;
      const ribDist1 = Math.abs(Math.hypot(pz - 0.58, py) - 0.84);
      const ribDist2 = Math.abs(Math.hypot(pz + 0.58, py) - 0.84);
      const isRib = ribDist1 < 0.028 || ribDist2 < 0.028;

      let r = 216;
      let g = 92;
      let b = 24;

      if (isEquator || isMeridian || isRib) {
        // Deep matte midnight rubber channel
        r = 14;
        g = 18;
        b = 32;
      } else {
        const pebbleNoise = Math.sin(x * 1.5) * Math.cos(y * 1.5);
        if (pebbleNoise > 0.4) {
          r = Math.min(245, r + 22);
          g = Math.min(125, g + 18);
        } else if (pebbleNoise < -0.4) {
          r = Math.max(160, r - 25);
          g = Math.max(65, g - 18);
        }
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
      idx += 4;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Debossed gold/ice-blue lettering
  ctx.save();
  ctx.fillStyle = '#62C7FF';
  ctx.shadowColor = '#287BFF';
  ctx.shadowBlur = 4;
  ctx.font = 'bold 22px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('IGNITE ELITE 500', width * 0.25, height * 0.42);
  ctx.font = '600 12px "Outfit", sans-serif';
  ctx.fillStyle = '#B7C0D8';
  ctx.fillText('EST. 2026 • HARDWOOD ARENA', width * 0.25, height * 0.48);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. PROCEDURAL CRICKET BALL SEAM & LEATHER TEXTURE
export function createCricketSeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6e0712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#260105';
  ctx.fillRect(0, 29, canvas.width, 6);

  ctx.strokeStyle = '#fbfbfa';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';

  for (let x = 0; x < canvas.width; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 6);
    ctx.lineTo(x + 4, 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 1, 16);
    ctx.lineTo(x + 5, 27);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 4, 37);
    ctx.lineTo(x, 48);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 5, 46);
    ctx.lineTo(x + 1, 58);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
