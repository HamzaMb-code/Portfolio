"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive WebGL fluid simulation, screen-blended over the page.
 * Trimmed Navier–Stokes solver (splat / advection / curl / vorticity / pressure) —
 * the same technique behind PavelDoGreat's WebGL-Fluid-Simulation (MIT).
 * Skipped on touch devices and prefers-reduced-motion.
 */

const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 768;
const IDLE_TIMEOUT = 350;
const DENSITY_DISSIPATION = 3.2;
const VELOCITY_DISSIPATION = 2;
const PRESSURE_ITERATIONS = 18;
const CURL_STRENGTH = 24;
const SPLAT_RADIUS = 0.28;
const SPLAT_FORCE = 5200;

const BASE_VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

function frag(src: string) {
  return `precision highp float; precision mediump sampler2D;\n${src}`;
}

const COPY_SHADER = frag(`
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  void main () { gl_FragColor = texture2D(uTexture, vUv); }
`);

const CLEAR_SHADER = frag(`
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
`);

const SPLAT_SHADER = frag(`
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`);

const ADVECTION_SHADER = frag(`
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    gl_FragColor = dissipation * result;
  }
`);

const DIVERGENCE_SHADER = frag(`
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`);

const CURL_SHADER = frag(`
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`);

const VORTICITY_SHADER = frag(`
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`);

const PRESSURE_SHADER = frag(`
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`);

const GRADIENT_SUBTRACT_SHADER = frag(`
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`);

const DISPLAY_SHADER = frag(`
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`);

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return program;
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  const uniforms: Record<string, WebGLUniformLocation> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)!;
    uniforms[info.name] = gl.getUniformLocation(program, info.name)!;
  }
  return uniforms;
}

class GLProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
  constructor(gl: WebGLRenderingContext, vs: WebGLShader, fsSrc: string) {
    const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
    this.program = createProgram(gl, vs, fs);
    this.uniforms = getUniforms(gl, this.program);
  }
}

function hsvToRgb(h: number, s: number, v: number) {
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return { r, g, b };
}

export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;
    if (reduced || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }) ||
      canvas.getContext("webgl", {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
      })) as WebGL2RenderingContext | WebGLRenderingContext | null;
    if (!gl) return;

    const isWebGL2 = "drawBuffers" in gl;
    let halfFloat: OES_texture_half_float | null = null;
    let supportLinearFiltering = false;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = (gl as WebGLRenderingContext).getExtension(
        "OES_texture_half_float"
      );
      supportLinearFiltering = !!(gl as WebGLRenderingContext).getExtension(
        "OES_texture_half_float_linear"
      );
    }
    gl.clearColor(0, 0, 0, 1);

    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloat
        ? halfFloat.HALF_FLOAT_OES
        : gl.UNSIGNED_BYTE;

    const internalFormat = isWebGL2
      ? (gl as WebGL2RenderingContext).RGBA16F
      : gl.RGBA;
    const internalFormatR = isWebGL2
      ? (gl as WebGL2RenderingContext).R16F
      : gl.RGBA;
    const formatR = isWebGL2 ? (gl as WebGL2RenderingContext).RED : gl.RGBA;

    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    const baseVS = compile(gl, gl.VERTEX_SHADER, BASE_VERT);
    const clearProgram = new GLProgram(gl, baseVS, CLEAR_SHADER);
    const splatProgram = new GLProgram(gl, baseVS, SPLAT_SHADER);
    const advectionProgram = new GLProgram(gl, baseVS, ADVECTION_SHADER);
    const divergenceProgram = new GLProgram(gl, baseVS, DIVERGENCE_SHADER);
    const curlProgram = new GLProgram(gl, baseVS, CURL_SHADER);
    const vorticityProgram = new GLProgram(gl, baseVS, VORTICITY_SHADER);
    const pressureProgram = new GLProgram(gl, baseVS, PRESSURE_SHADER);
    const gradientSubtractProgram = new GLProgram(
      gl,
      baseVS,
      GRADIENT_SUBTRACT_SHADER
    );
    const displayProgram = new GLProgram(gl, baseVS, DISPLAY_SHADER);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const elem = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: FBO | null) {
      if (target == null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function createFBO(w: number, h: number, texType: number, fmt: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filtering);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filtering);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        fmt === formatR ? internalFormatR : internalFormat,
        w,
        h,
        0,
        fmt,
        texType,
        null
      );
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        texture,
        0
      );
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      texType: number,
      fmt: number
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, texType, fmt);
      let fbo2 = createFBO(w, h, texType, fmt);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(v) {
          fbo1 = v;
        },
        get write() {
          return fbo2;
        },
        set write(v) {
          fbo2 = v;
        },
        swap() {
          const tmp = fbo1;
          fbo1 = fbo2;
          fbo2 = tmp;
        },
      };
    }

    function getResolution(resolution: number) {
      const aspect = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      const aspectInv = aspect < 1 ? 1 / aspect : aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectInv);
      return gl!.drawingBufferWidth > gl!.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    let velocity: DoubleFBO;
    let dye: DoubleFBO;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressure: DoubleFBO;

    function initFBOs() {
      const simRes = getResolution(SIM_RESOLUTION);
      const dyeRes = getResolution(DYE_RESOLUTION);
      velocity = createDoubleFBO(
        simRes.width,
        simRes.height,
        halfFloatTexType,
        gl!.RGBA
      );
      dye = createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        halfFloatTexType,
        gl!.RGBA
      );
      divergence = createFBO(simRes.width, simRes.height, halfFloatTexType, formatR);
      curlFBO = createFBO(simRes.width, simRes.height, halfFloatTexType, formatR);
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        halfFloatTexType,
        formatR
      );
    }

    function resizeCanvas() {
      const w = Math.floor(canvas!.clientWidth * Math.min(devicePixelRatio, 1.5));
      const h = Math.floor(canvas!.clientHeight * Math.min(devicePixelRatio, 1.5));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        return true;
      }
      return false;
    }

    resizeCanvas();
    initFBOs();

    type Pointer = {
      down: boolean;
      x: number;
      y: number;
      dx: number;
      dy: number;
      color: [number, number, number];
    };
    const pointer: Pointer = {
      down: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      color: [0.3, 0.1, 0.05],
    };
    let lastPointerMove = 0;

    function randomColor(): [number, number, number] {
      const hue = 0.025 + Math.random() * 0.035; // narrow orange-red band, no yellow/green drift
      const c = hsvToRgb(hue, 0.85, 1);
      return [c.r * 0.13, c.g * 0.13, c.b * 0.13];
    }

    function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
      gl!.useProgram(splatProgram.program);
      gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas!.width / canvas!.height
      );
      gl!.uniform2f(splatProgram.uniforms.point, x, y);
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl!.uniform1f(splatProgram.uniforms.radius, SPLAT_RADIUS / 100);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    }

    function splatAtPointer(p: Pointer) {
      const dx = p.dx * SPLAT_FORCE;
      const dy = p.dy * SPLAT_FORCE;
      splat(p.x, p.y, dx, dy, p.color);
    }

    let lastTime = performance.now();
    let rafId = 0;

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      gl!.useProgram(curlProgram.program);
      gl!.uniform2f(
        curlProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl!.useProgram(vorticityProgram.program);
      gl!.uniform2f(
        vorticityProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl, CURL_STRENGTH);
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(divergenceProgram.program);
      gl!.uniform2f(
        divergenceProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      gl!.useProgram(clearProgram.program);
      gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value, 0.8);
      blit(pressure.write);
      pressure.swap();

      gl!.useProgram(pressureProgram.program);
      gl!.uniform2f(
        pressureProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gl!.useProgram(gradientSubtractProgram.program);
      gl!.uniform2f(
        gradientSubtractProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(advectionProgram.program);
      gl!.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl!.uniform1f(advectionProgram.uniforms.dt, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION / 20 + 0.98);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION / 20 + 0.97);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);
      gl!.useProgram(displayProgram.program);
      gl!.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    function update() {
      rafId = 0;
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 1 / 30);
      lastTime = now;

      if (resizeCanvas()) initFBOs();

      if (pointer.down) {
        splatAtPointer(pointer);
        pointer.dx *= 0.94;
        pointer.dy *= 0.94;
      }

      step(dt);
      render();

      if (pointer.down && now - lastPointerMove < IDLE_TIMEOUT) {
        rafId = requestAnimationFrame(update);
      } else {
        pointer.down = false;
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        return;
      }

      lastTime = performance.now();
      if (
        pointer.down &&
        lastTime - lastPointerMove < IDLE_TIMEOUT &&
        !rafId
      ) {
        rafId = requestAnimationFrame(update);
      }
    }

    function toSimCoords(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    }

    function onPointerMove(e: PointerEvent) {
      const { x, y } = toSimCoords(e.clientX, e.clientY);
      const dx = (x - pointer.x) * 8;
      const dy = (y - pointer.y) * 8;
      pointer.x = x;
      pointer.y = y;
      pointer.dx = dx;
      pointer.dy = dy;
      pointer.down = true;
      pointer.color = randomColor();
      lastPointerMove = performance.now();
      if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(update);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="site-fluid" aria-hidden="true" />;
}
