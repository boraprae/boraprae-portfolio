"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import DeskScene from "./desk-scene";

export type WorldController = { setProgress: (progress: number, reduced: boolean) => void };
type Props = { controllerRef: React.RefObject<WorldController | null> };

const SAGE = 0x8d9c75; // workburn cozy-paper accent
const PAPER = 0xfcfbf6;
const INK = 0x433f35;
const PALE = 0xe7d6bd;
const LEAF = 0x687c58;
const smooth = (start: number, end: number, value: number) => {
  const x = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
};

export default function WorkspaceWorld({ controllerRef }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const playbackRef = useRef({ progress: 0, reduced: false });
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    } catch {
      // The illustrated fallback keeps the portfolio readable without WebGL.
      queueMicrotask(() => setFallback(true));
      return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAPER);
    const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setClearColor(PAPER);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "A three-dimensional studio with a woman coding at her laptop. Scroll to move around her desk.");
    renderer.domElement.setAttribute("role", "img");

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const ambient = new THREE.AmbientLight(0xffffff, 1.65);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(-5, 11, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: .1, far: 35 });
    sun.shadow.bias = -.001;
    sun.shadow.normalBias = .035;
    sun.shadow.radius = 2;
    scene.add(sun);

    function material(color: number) {
      const mat = new THREE.MeshToonMaterial({ color });
      materials.push(mat);
      return mat;
    }
    const cream = material(PAPER), sage = material(SAGE), pale = material(PALE), ink = material(INK), leafGreen = material(LEAF);
    const skin = material(0xe8b89e), terracotta = material(0xc17e61);
    const wood = material(0xd4b18a), forest = material(0x426653), peach = material(0xf3e3d7);
    const lineMaterial = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .2 });
    materials.push(lineMaterial);

    function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, position: number[] = [0, 0, 0], edges = false) {
      geometries.push(geometry);
      const object = new THREE.Mesh(geometry, mat);
      object.position.set(position[0], position[1], position[2]);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      if (edges) {
        const edgeGeometry = new THREE.EdgesGeometry(geometry, 28);
        geometries.push(edgeGeometry);
        object.add(new THREE.LineSegments(edgeGeometry, lineMaterial));
      }
      return object;
    }
    function box(w: number, h: number, d: number, mat: THREE.Material, parent: THREE.Object3D, p = [0, 0, 0], edges = true) {
      return mesh(new RoundedBoxGeometry(w, h, d, 1, Math.min(.035, w / 5, h / 5, d / 5)), mat, parent, p, edges);
    }
    function ball(x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: THREE.Material, parent: THREE.Object3D) {
      const object = mesh(new THREE.SphereGeometry(1, 24, 16), mat, parent, [x, y, z]);
      object.scale.set(sx, sy, sz);
      return object;
    }
    function rod(a: number[], b: number[], radius: number, mat: THREE.Material, parent: THREE.Object3D, endRadius = radius) {
      const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
      const direction = end.clone().sub(start);
      const object = mesh(new THREE.CylinderGeometry(endRadius, radius, direction.length(), 12), mat, parent);
      object.position.copy(start.add(end).multiplyScalar(.5));
      object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      return object;
    }
    function textTexture(lines: string[], dark = false) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024; canvas.height = 640;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = dark ? "#426653" : "#fcfbf6";
      ctx.fillRect(0, 0, 1024, 640);
      ctx.fillStyle = dark ? "#fcfbf6" : "#426653";
      ctx.font = "24px monospace";
      ctx.fillText("YAINEZU / STUDIO", 55, 63);
      ctx.globalAlpha = .4; ctx.fillRect(55, 90, 914, 2); ctx.globalAlpha = 1;
      lines.forEach((line, i) => {
        ctx.font = i === 0 ? "52px Georgia" : "26px monospace";
        ctx.fillStyle = i === 0 || !dark ? (dark ? "#fcfbf6" : "#426653") : "#e5ebdd";
        ctx.fillText(line, 55, 174 + i * 70);
      });
      if (lines.length === 3 && /^0[123]/.test(lines[0])) {
        ctx.strokeStyle = dark ? "#fcfbf6" : "#426653";
        ctx.lineWidth = 2;
        ctx.strokeRect(55, 380, 425, 190);
        ctx.strokeRect(510, 380, 458, 190);
        ctx.fillStyle = dark ? "#e5ebdd" : "#e7d6bd";
        ctx.fillRect(75, 400, 145, 145);
        ctx.fillRect(530, 400, 418, 22);
        ctx.fillStyle = dark ? "#fcfbf6" : "#426653";
        ctx.fillRect(245, 412, 180, 10);
        ctx.fillRect(245, 440, 130, 7);
        ctx.fillRect(245, 468, 155, 7);
        ctx.fillRect(245, 513, 100, 26);
        for (let bar = 0; bar < 7; bar++) {
          const height = 30 + (bar * 19) % 80;
          ctx.fillRect(540 + bar * 55, 547 - height, 27, height);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      materials.push(mat);
      return mat;
    }

    const room = new THREE.Group(); scene.add(room);
    const floor = box(28, .15, 24, cream, room, [0, -.1, 0], false);
    floor.castShadow = false;
    // Blue architectural planes and hard sunlight echo the reference's room.
    box(7.6, .018, 5.8, sage, room, [.25, .002, .7], false);
    box(6.7, 6.3, .13, cream, room, [-1.6, 3.05, -4.4]);
    box(2.5, 6.3, .15, sage, room, [3, 3.05, -4.4], false);
    // Open side of a cutaway studio: the orbit never passes through an opaque wall.
    // Window: visible from both sides, with slender frames and an abstract skyline.
    const windowGroup = new THREE.Group(); room.add(windowGroup);
    windowGroup.position.set(-4.86, 3.4, -1.2);
    box(.06, 3.8, 4.4, pale, windowGroup, [0, 0, 0]);
    for (const z of [-2.2, 0, 2.2]) box(.12, 3.94, .06, sage, windowGroup, [.06, 0, z]);
    for (const y of [-1.9, 0, 1.9]) box(.12, .055, 4.4, sage, windowGroup, [.06, y, 0]);
    for (let i = 0; i < 11; i++) {
      const h = .4 + ((i * 7) % 9) / 8;
      box(.02, h, .26, cream, windowGroup, [.045, -1.9 + h / 2, -1.9 + i * .37], false);
    }
    const artwork = new THREE.Group(); artwork.position.set(.9, 3.7, -4.28); room.add(artwork);
    box(1.15, 1.5, .07, sage, artwork);
    box(1.02, 1.37, .08, cream, artwork, [0, 0, .04]);
    const poster = mesh(new THREE.PlaneGeometry(.93, 1.2), textTexture(["make", "something", "meaningful."]), artwork, [0, 0, .09]);
    poster.castShadow = false; poster.receiveShadow = false;

    const desk = new THREE.Group(); scene.add(desk);
    const top = box(5.6, .16, 2.65, pale, desk, [0, 2.12, 0]);
    top.receiveShadow = true;
    box(5.5, .07, 2.55, wood, desk, [0, 2.01, 0], false);
    for (const x of [-2.45, 2.45]) for (const z of [-1.02, 1.02]) {
      rod([x, 2.03, z], [x * 1.07, .02, z * 1.13], .065, sage, desk);
    }
    rod([-2.55, .5, -.98], [2.55, .5, -.98], .035, sage, desk);

    const laptop = new THREE.Group(); laptop.position.set(-.5, 2.23, .14); laptop.rotation.y = -.08; desk.add(laptop);
    box(1.7, .075, 1.08, pale, laptop);
    // Keyboard keys are real geometry, so the close-up survives an orbit.
    for (let row = 0; row < 4; row++) for (let col = 0; col < 12; col++) {
      const key = box(.1, .014, .085, ink, laptop, [-.68 + col * .124, .047, -.28 + row * .115], false);
      key.castShadow = false; key.receiveShadow = false;
    }
    box(.45, .008, .22, cream, laptop, [0, .046, .35]);
    const lid = new THREE.Group(); lid.position.set(0, .04, -.51); lid.rotation.x = -.19; laptop.add(lid);
    box(1.7, 1.07, .065, forest, lid, [0, .53, 0]);
    const display = mesh(new THREE.PlaneGeometry(1.56, .93), textTexture(["Hello, world.", "const ideas = curiosity", "  .map(makeSomething)", "  .then(keepLearning);", "// one line at a time"], true), lid, [0, .54, .035]);
    display.castShadow = false; display.receiveShadow = false;
    ball(0, .54, -.037, .1, .1, .012, cream, lid);

    // Sketchbook pages lift into the career chapter before the interface assembles.
    const notebook = new THREE.Group(); notebook.position.set(1.5, 2.23, .35); notebook.rotation.y = -.24; desk.add(notebook);
    box(1.3, .05, .94, sage, notebook);
    box(1.25, .06, .9, cream, notebook, [0, .055, 0]);
    const page = mesh(new THREE.PlaneGeometry(1.18, .84), textTexture(["a little idea", "[ design ] -> [ build ]", "       -> [ refine ]"]), notebook, [0, .088, 0]);
    page.rotation.x = -Math.PI / 2; page.castShadow = false; page.receiveShadow = false;
    rod([.62, .1, -.26], [.62, .1, .35], .023, sage, notebook);
    const loose = box(1.1, .015, .8, pale, desk, [.9, 2.22, -.67]); loose.rotation.y = .24;

    // Ceramic coffee cup, handle, and a tiny spoon.
    const cup = new THREE.Group(); cup.position.set(-1.92, 2.22, .48); desk.add(cup);
    mesh(new THREE.CylinderGeometry(.22, .19, .4, 32), cream, cup, [0, .2, 0]);
    mesh(new THREE.CylinderGeometry(.18, .18, .008, 32), ink, cup, [0, .405, 0]);
    const handle = mesh(new THREE.TorusGeometry(.135, .035, 10, 24), cream, cup, [.24, .22, 0]);
    handle.scale.x = .8;
    mesh(new THREE.CylinderGeometry(.33, .33, .025, 32), cream, cup, [0, .012, 0]);

    // Desk lamp with two articulated arms.
    const lamp = new THREE.Group(); lamp.position.set(-2.25, 2.2, -.82); desk.add(lamp);
    mesh(new THREE.CylinderGeometry(.25, .29, .055, 32), sage, lamp, [0, .04, 0]);
    rod([0, .05, 0], [.08, 1, -.1], .035, sage, lamp);
    rod([.08, 1, -.1], [.7, 1.34, .03], .03, sage, lamp);
    ball(.08, 1, -.1, .07, .07, .07, ink, lamp);
    const shade = mesh(new THREE.ConeGeometry(.25, .32, 32, 1, true), sage, lamp, [.73, 1.2, .03]);
    shade.rotation.z = -.4;

    const plant = new THREE.Group(); plant.position.set(2.24, 2.22, -.76); desk.add(plant);
    mesh(new THREE.CylinderGeometry(.26, .19, .42, 12), terracotta, plant, [0, .21, 0], true);
    mesh(new THREE.CylinderGeometry(.225, .225, .01, 16), ink, plant, [0, .423, 0]);
    const leaves: THREE.Object3D[] = [];
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      const h = .65 + (i % 3) * .19;
      const tip = [Math.cos(angle) * .34, h, Math.sin(angle) * .34];
      rod([0, .41, 0], tip, .012, ink, plant);
      const leaf = ball(tip[0], tip[1], tip[2], .115, .28, .045, i % 2 ? leafGreen : sage, plant);
      leaf.rotation.set(.3, angle, -Math.cos(angle) * .6); leaves.push(leaf);
    }

    // Seated character, modeled in the same flat-color illustration language.
    const woman = new THREE.Group(); woman.position.set(-.52, 0, 1.8); scene.add(woman);
    const chair = new THREE.Group(); woman.add(chair);
    box(.91, .15, .87, forest, chair, [0, 1.19, .03]);
    const chairBack = box(.86, .94, .12, forest, chair, [0, 1.75, .43]); chairBack.rotation.x = -.09;
    rod([0, .25, .03], [0, 1.2, .03], .055, ink, chair);
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      const p = [Math.cos(a) * .56, .13, Math.sin(a) * .56];
      rod([0, .28, .03], p, .035, ink, chair);
      ball(p[0], .09, p[2], .07, .085, .07, ink, chair);
    }
    // Legs face the laptop, with natural bends at the knee and ankles.
    for (const x of [-.22, .22]) {
      rod([x, 1.29, 0], [x * 1.15, 1.06, -.66], .18, sage, woman, .155);
      ball(x * 1.15, 1.06, -.66, .155, .17, .16, sage, woman);
      rod([x * 1.15, 1.04, -.66], [x * 1.12, .21, -.79], .11, sage, woman, .14);
      ball(x * 1.12, .15, -.91, .145, .12, .29, cream, woman);
    }
    const torsoPoints = [[.31, 0], [.36, .12], [.33, .48], [.42, .85], [.32, 1.02], [.12, 1.13]].map(([x, y]) => new THREE.Vector2(x, y));
    const torso = mesh(new THREE.LatheGeometry(torsoPoints, 28), peach, woman, [0, 1.4, -.02]);
    torso.scale.z = .66; torso.rotation.x = -.11;
    rod([0, 2.33, -.11], [0, 2.59, -.14], .105, skin, woman);
    const head = new THREE.Group(); head.position.set(0, 2.8, -.16); head.rotation.x = -.14; woman.add(head);
    ball(0, .035, .035, .285, .34, .26, ink, head);
    ball(0, 0, -.065, .23, .28, .23, skin, head);
    // Side-swept fringe, low bun, ears, nose and two small eyes.
    ball(-.09, .22, -.09, .21, .12, .19, ink, head);
    ball(.18, .13, -.015, .1, .22, .21, ink, head);
    ball(0, -.055, .29, .2, .21, .18, ink, head);
    ball(-.238, -.005, -.01, .05, .072, .055, skin, head);
    ball(0, -.01, -.296, .038, .058, .043, skin, head);
    for (const x of [-.088, .088]) ball(x, .065, -.268, .017, .021, .012, ink, head);
    // Arms rest on the keyboard; only the wrists move a few millimeters while typing.
    const hands: THREE.Object3D[] = [];
    for (const side of [-1, 1]) {
      const shoulder = [side * .32, 2.38, -.08];
      const elbow = [side * .47, 2.29, -.55];
      rod(shoulder, elbow, .135, peach, woman, .11);
      ball(elbow[0], elbow[1], elbow[2], .115, .11, .115, peach, woman);
      rod(elbow, [side * .28, 2.27, -1.43], .068, skin, woman, .087);
      const hand = ball(side * .28, 2.27, -1.44, .09, .045, .13, skin, woman); hands.push(hand);
    }

    // A physical stack of interface layers grows from the notebook, like the model
    // assembling on the architect's desk in the reference video.
    const assembly = new THREE.Group(); assembly.position.set(.75, 2.36, -.12); scene.add(assembly);
    const panels: THREE.Group[] = [];
    const panelCopy = [
      ["01 / Interface", "thoughtful by design", "[ explore ]    [ create ]"],
      ["02 / Interaction", "small details, big feeling", "hover -> respond -> delight"],
      ["03 / Engineering", "a little logic underneath", "components + state + care"],
    ];
    panelCopy.forEach((copy, i) => {
      const panel = new THREE.Group(); assembly.add(panel); panels.push(panel);
      box(2.25, 1.42, .065, i === 1 ? sage : cream, panel);
      const face = mesh(new THREE.PlaneGeometry(2.15, 1.32), textTexture(copy, i === 1), panel, [0, 0, .036]);
      face.castShadow = false; face.receiveShadow = false;
      for (let j = 0; j < 3; j++) ball(-.94 + j * .1, .58, .043, .023, .023, .008, i === 1 ? cream : sage, panel);
    });
    const componentTiles: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const tile = new THREE.Group(); assembly.add(tile); componentTiles.push(tile);
      box(.6, .08, .6, i % 2 ? sage : leafGreen, tile);
      box(.35, .045, .08, cream, tile, [0, .06, -.1], false);
      box(.35, .045, .08, cream, tile, [0, .06, .07], false);
    }

    // A bookshelf gives the CV's learning chapter its own physical destination.
    const bookshelf = new THREE.Group(); bookshelf.position.set(2.7, 0, -3.95); room.add(bookshelf);
    box(2.65, 3.65, .14, wood, bookshelf, [0, 2.45, -.22]);
    for (const x of [-1.3, 1.3]) box(.09, 3.65, .6, wood, bookshelf, [x, 2.45, 0]);
    for (const y of [.65, 1.82, 3.03, 4.28]) box(2.68, .09, .65, wood, bookshelf, [0, y, .03]);
    const books: THREE.Group[] = [];
    for (let i = 0; i < 15; i++) {
      const book = new THREE.Group(); bookshelf.add(book); books.push(book);
      const row = Math.floor(i / 5), col = i % 5;
      book.position.set(-.98 + col * .36, .72 + row * 1.18, .01);
      const h = .72 + ((i * 13) % 5) * .055;
      const color = [sage, peach, forest, cream, terracotta][i % 5];
      box(.24, h, .43, color, book, [0, h / 2, 0]);
      box(.19, .012, .37, cream, book, [0, h + .005, 0], false);
      box(.14, .14, .013, cream, book, [0, h * .55, .223], false);
      box(.24, .035, .015, wood, book, [0, h * .73, .231], false);
    }
    const learningPage = new THREE.Group(); learningPage.position.set(2.65, 3.2, -2.9); room.add(learningPage);
    box(1.36, 1.72, .04, cream, learningPage);
    const learningFace = mesh(new THREE.PlaneGeometry(1.28, 1.62), textTexture(["Never stop", "asking questions.", "one page at a time."]), learningPage, [0, 0, .024]);
    learningFace.castShadow = false; learningFace.receiveShadow = false;
    const journalPages: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const sheet = new THREE.Group(); sheet.position.set(1.5, 2.35, .35); scene.add(sheet); journalPages.push(sheet);
      box(.88, 1.12, .018, i % 2 ? peach : cream, sheet);
      const print = mesh(new THREE.PlaneGeometry(.83, 1.07), textTexture([["THE JOURNEY", "roles & teams", "lessons & growth"], ["THE DETAILS", "thoughtful decisions", "small improvements"], ["WHAT'S NEXT", "keep learning", "keep making"]][i]), sheet, [0, 0, .011]);
      print.castShadow = false; print.receiveShadow = false;
    }

    // Long reading plateaus alternate with camera travel. These timestamps match
    // the eight chapters in data/portfolio.ts; scrolling backwards reverses all motion.
    const cameraKeys = [
      { p: 0, position: [8.9, 5.8, 11.8], target: [0, 1.8, 0], fov: 39, offset: .18 },
      { p: .07, position: [8.9, 5.8, 11.8], target: [0, 1.8, 0], fov: 39, offset: .18 },
      { p: .13, position: [5.4, 3.9, -.5], target: [-.3, 2.15, .9], fov: 40, offset: -.2 },
      { p: .19, position: [5.4, 3.9, -.5], target: [-.3, 2.15, .9], fov: 40, offset: -.2 },
      { p: .25, position: [1.5, 5.25, 5.7], target: [-.35, 2.3, -.05], fov: 38, offset: .18 },
      { p: .32, position: [1.5, 5.25, 5.7], target: [-.35, 2.3, -.05], fov: 38, offset: .18 },
      { p: .38, position: [5.3, 7.1, 4.2], target: [1.3, 2.2, .2], fov: 41, offset: -.21 },
      { p: .445, position: [5.3, 7.1, 4.2], target: [1.3, 2.2, .2], fov: 41, offset: -.21 },
      { p: .505, position: [-5.7, 5.4, 3.9], target: [.8, 3, -.12], fov: 39, offset: -.2 },
      { p: .58, position: [-5.7, 5.4, 3.9], target: [.8, 3, -.12], fov: 39, offset: -.2 },
      { p: .64, position: [4.8, 7.8, 5.4], target: [.8, 3.3, -.1], fov: 43, offset: .2 },
      { p: .712, position: [4.8, 7.8, 5.4], target: [.8, 3.3, -.1], fov: 43, offset: .2 },
      { p: .78, position: [6.4, 4.7, 4.4], target: [2.65, 3.15, -3.75], fov: 40, offset: -.21 },
      { p: .84, position: [6.4, 4.7, 4.4], target: [2.65, 3.15, -3.75], fov: 40, offset: -.21 },
      { p: .905, position: [-.7, 13.2, 1.2], target: [.25, 2.1, 0], fov: 42, offset: .19 },
      { p: .97, position: [-.7, 13.2, 1.2], target: [.25, 2.1, 0], fov: 42, offset: .19 },
      { p: 1, position: [-.7, 13.2, 1.2], target: [.25, 2.1, 0], fov: 42, offset: .19 },
    ];
    let width = 1, height = 1;
    let { progress, reduced } = playbackRef.current;
    let frame = 0, disposed = false;
    const position = new THREE.Vector3(), target = new THREE.Vector3();
    const startOffset = new THREE.Vector3(), endOffset = new THREE.Vector3();
    const orbitStart = new THREE.Spherical(), orbitEnd = new THREE.Spherical(), orbit = new THREE.Spherical();

    function render() {
      frame = 0;
      if (disposed) return;
      const p = reduced ? 0 : progress;
      let index = cameraKeys.findIndex((key, i) => i < cameraKeys.length - 1 && p <= cameraKeys[i + 1].p && p >= key.p);
      if (index === -1) index = cameraKeys.length - 2;
      const a = cameraKeys[index], b = cameraKeys[index + 1];
      const t = smooth(a.p, b.p, p);
      target.fromArray(a.target).lerp(endOffset.fromArray(b.target), t);
      startOffset.fromArray(a.position).sub(endOffset.fromArray(a.target));
      endOffset.fromArray(b.position).sub(position.fromArray(b.target));
      orbitStart.setFromVector3(startOffset); orbitEnd.setFromVector3(endOffset);
      // Interpolate an orbit, not a chord through the desk. This preserves the
      // subject's scale during large angle changes and prevents accidental fly-throughs.
      const angle = Math.atan2(Math.sin(orbitEnd.theta - orbitStart.theta), Math.cos(orbitEnd.theta - orbitStart.theta));
      orbit.set(
        THREE.MathUtils.lerp(orbitStart.radius, orbitEnd.radius, t),
        THREE.MathUtils.lerp(orbitStart.phi, orbitEnd.phi, t),
        orbitStart.theta + angle * t,
      );
      position.setFromSpherical(orbit).add(target);
      const mobile = width / height < .95;
      if (mobile) position.sub(target).multiplyScalar(1.7).add(target);
      camera.position.copy(position); camera.lookAt(target);
      camera.fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
      // Off-axis framing keeps the subject beside each caption, without moving
      // the physical workspace. Mobile leaves a clear band above the scene.
      const offset = mobile ? 0 : THREE.MathUtils.lerp(a.offset, b.offset, t);
      camera.setViewOffset(width, height, -width * offset, mobile ? -height * .19 : 0, width, height);
      camera.updateProjectionMatrix();

      // Assemble, separate, and flatten the same physical pieces along the camera path.
      const reveal = smooth(.475, .51, p);
      const explode = smooth(.6, .65, p);
      const flatten = smooth(.85, .91, p);
      assembly.visible = reveal > .001;
      panels.forEach((panel, i) => {
        panel.scale.setScalar(Math.max(.001, reveal));
        panel.position.set((i - 1) * .28 * explode, .45 + i * (.19 + .62 * explode), -.1 - i * .30 * explode);
        panel.rotation.set(-Math.PI / 2 * flatten, (i - 1) * .13 * explode, 0);
        panel.position.y = THREE.MathUtils.lerp(panel.position.y, .11 + i * .07, flatten);
        panel.position.x = THREE.MathUtils.lerp(panel.position.x, (i - 1) * 1.1, flatten);
        panel.scale.multiplyScalar(1 - flatten * .39);
      });
      componentTiles.forEach((tile, i) => {
        const angle = i * Math.PI * 2 / 5 + p * 2;
        tile.visible = explode > .01;
        tile.position.set(Math.cos(angle) * (1.5 + explode * .2), .25 + Math.sin(angle) * .3 + explode * .8 * (1 - flatten), Math.sin(angle) * 1.1);
        tile.rotation.y = p * 1.8 + i;
        tile.scale.setScalar(explode * .8);
      });
      const notebookReveal = smooth(.35, .39, p) * (1 - smooth(.448, .48, p));
      journalPages.forEach((sheet, i) => {
        sheet.visible = notebookReveal > .001;
        sheet.scale.setScalar(Math.max(.001, notebookReveal));
        sheet.position.set(1.5 + (i - 1) * .59 * notebookReveal, 2.35 + (.62 + i * .1) * notebookReveal, .35 - i * .14);
        sheet.rotation.set(-.7 * (1 - notebookReveal), .3 + (i - 1) * .18 * notebookReveal, (i - 1) * -.08);
      });
      const learningReveal = smooth(.755, .795, p) * (1 - smooth(.84, .89, p));
      learningPage.visible = learningReveal > .001;
      learningPage.scale.setScalar(Math.max(.001, learningReveal));
      learningPage.rotation.y = -.15 + learningReveal * .25;
      learningPage.position.z = -3.7 + learningReveal * 1.4;
      books.forEach((book, i) => { book.position.z = .01 + (i % 4 === 0 ? learningReveal * .22 : 0); });
      hands.forEach((hand, i) => { hand.position.y = 2.27 + Math.sin(p * 130 + i * Math.PI) * .015; });
      leaves.forEach((leaf, i) => { leaf.rotation.z = Math.sin(p * 8 + i) * .16; });
      renderer.render(scene, camera);
    }
    function requestRender() { if (!frame && !disposed) frame = requestAnimationFrame(render); }
    function resize() {
      width = element!.clientWidth; height = element!.clientHeight;
      renderer.setSize(width, height); camera.aspect = width / height;
      requestRender();
    }
    controllerRef.current = { setProgress(p, quiet) { progress = p; reduced = quiet; playbackRef.current = { progress: p, reduced: quiet }; requestRender(); } };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const onLost = (event: Event) => { event.preventDefault(); setFallback(true); };
    const onRestored = () => { setFallback(false); requestRender(); };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controllerRef.current = null;
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [controllerRef]);

  return <div className="world" ref={host}>{fallback && <div className="world-fallback"><DeskScene /><span>Illustrated view · 3D is unavailable in this browser</span></div>}</div>;
}
