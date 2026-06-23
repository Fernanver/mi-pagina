import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeCard.css';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(noise(i), noise(i + vec2(1,0)), u.x),
      mix(noise(i + vec2(0,1)), noise(i + vec2(1,1)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      val += amp * smoothNoise(p);
      p   *= 2.1;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.10;
    vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) + t * 0.8));
    vec2 r = vec2(
      fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
      fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.3)
    );
    float f = fbm(uv + 4.0 * r + t * 0.2);
    float veins = sin((uv.x + uv.y * 0.4 + f * 2.2) * 6.28 * 1.5) * 0.5 + 0.5;
    veins = pow(veins, 1.8);

    // #403634 => (0.251, 0.212, 0.204)
    vec3 dark   = vec3(0.10, 0.08, 0.07);
    vec3 mid    = vec3(0.251, 0.212, 0.204);
    vec3 light  = vec3(0.40, 0.33, 0.31);
    vec3 bright = vec3(0.58, 0.48, 0.45);

    vec3 col = mix(dark, mid, f);
    col = mix(col, light,  smoothstep(0.3, 0.65, veins));
    col = mix(col, bright, smoothstep(0.72, 1.0, veins) * 0.7);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 0.82);
  }
`;

const vertexCoin = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const fragmentCoin = `
  uniform float uFlip;
  varying vec2 vUv;

  float heartgram(vec2 uv) {
    float x = uv.x;
    float y = 0.5;
    if      (x < 0.05) y = 0.5;
    else if (x < 0.15) y = 0.5 + 0.04 * sin((x - 0.05) / 0.10 * 3.14159);
    else if (x < 0.25) y = 0.5;
    else if (x < 0.30) y = 0.5  - 0.06 * ((x - 0.25) / 0.05);
    else if (x < 0.38) y = 0.44 + 0.52 * ((x - 0.30) / 0.08);
    else if (x < 0.46) y = 0.96 - 0.58 * ((x - 0.38) / 0.08);
    else if (x < 0.50) y = 0.38 + 0.14 * ((x - 0.46) / 0.04);
    else if (x < 0.60) y = 0.52;
    else if (x < 0.80) y = 0.52 + 0.12 * sin((x - 0.60) / 0.20 * 3.14159);
    else                y = 0.5;
    float dist = abs(uv.y - y);
    return smoothstep(0.018, 0.006, dist);
  }

  void main() {
    vec2 uv = vUv;
    float cosA = cos(uFlip);
    float scaleX = abs(cosA);
    if (scaleX < 0.01) { gl_FragColor = vec4(0.0); return; }

    vec2 cuv = (uv - 0.5);
    cuv.x /= max(scaleX, 0.01);
    cuv += 0.5;

    vec2 c = cuv - 0.5;
    float r = length(c);
    float circle = smoothstep(0.50, 0.47, r);
    if (circle < 0.01) { gl_FragColor = vec4(0.0); return; }

    float rim = smoothstep(0.47, 0.44, r);
    vec3 coinBg = mix(vec3(0.55, 0.55, 0.58), vec3(0.82, 0.82, 0.86), rim);
    float isBack = step(0.0, cosA);
    coinBg = mix(vec3(0.40, 0.40, 0.44), coinBg, isBack);

    float ecg = 0.0;
    if (isBack > 0.5) {
      vec2 euv = vec2((cuv.x - 0.08) / 0.84, (cuv.y - 0.3) / 0.40);
      if (euv.x > 0.0 && euv.x < 1.0 && euv.y > 0.0 && euv.y < 1.0) {
        ecg = heartgram(euv);
      }
    }

    vec3 col = mix(coinBg, vec3(0.85, 0.15, 0.20), ecg);

    float edge = smoothstep(0.50, 0.485, r) - smoothstep(0.485, 0.47, r);
    col = mix(col, vec3(0.25, 0.25, 0.28), edge * 0.6);

    float glint = smoothstep(0.12, 0.0, length(c - vec2(-0.12, -0.14)));
    col = mix(col, vec3(1.0), glint * 0.25 * isBack);

    gl_FragColor = vec4(col, circle * 0.97);
  }
`;

function ThreeCard() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const bgMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(w, h) },
      },
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat));

    const coinMat = new THREE.ShaderMaterial({
      vertexShader: vertexCoin,
      fragmentShader: fragmentCoin,
      uniforms: { uFlip: { value: 0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const aspect = w / h;
    const coinSize = 0.55;
    const coinMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(coinSize, coinSize * aspect),
      coinMat
    );
    coinMesh.position.z = 0.001;
    scene.add(coinMesh);

    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      bgMat.uniforms.uTime.value = t;
      coinMat.uniforms.uFlip.value = t * 1.8;
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      renderer.setSize(nw, nh);
      bgMat.uniforms.uResolution.value.set(nw, nh);
      const newAspect = nw / nh;
      coinMesh.geometry.dispose();
      coinMesh.geometry = new THREE.PlaneGeometry(coinSize, coinSize * newAspect);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="three-card">
      <div className="three-card__canvas" ref={mountRef} />
    </div>
  );
}

export default ThreeCard;