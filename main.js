import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const DEBUG = false;

class Mago {
  constructor() {
    // Model
    this.instance = null;
    // Physics
    this.hitbox = null;
    // Animation
    this.mixer = null;
    this.animationActions = {};
    this.currentAction = null;
    this.previousAction = null;
    // State
    this.state = 'none';
    this.timer = 0;
    this.decisionTimer = 3;
    // Movement
    this.targetPosition = new THREE.Vector3(0, 0, 0);
    this.targetRotation = new THREE.Vector3(0, 0, 0);
  }

  start(id = 1){
    gltfModelLoader.load(`mago${id}.glb`, (gltf) => this.load(gltf, id), undefined, function (error) {
      console.error( error );
    });
  }

  load(gltf, id) {
    this.instance = gltf.scene;

    const hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2., 0.8), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
    hitbox.position.y = 1.;
    hitbox.material.visible = DEBUG;
    this.instance.add(hitbox);
    this.hitbox = hitbox;
    raycastables.push(hitbox);
    raycastablesMago[this.instance.uuid] = this;

    this.mixer = new THREE.AnimationMixer( gltf.scene );
    const loopOnceAnimations = ['Fall', 'Getup'];
    gltf.animations.forEach(clip => {
      const animation = this.mixer.clipAction(clip);
      if (loopOnceAnimations.includes(clip.name))
      {
        animation.setLoop(THREE.LoopOnce);
        animation.clampWhenFinished = true;
      }
      this.animationActions[clip.name] = animation;
    });

    this.setState('Idle');
    this.instance.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);
    this.instance.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
    this.timer = - Math.random() * 2;
    scene.add(this.instance);
  }

  update(deltaTime) {
    if (!this.instance) return; // not loaded yet

    if (this.timer > 0.5) {
      this.raycastObjects();
    }

    switch(this.state)
    {
      case 'Idle':
        if (this.timer > this.decisionTimer) {
          if (Math.random() < 0.8) {
            this.setState('Walk');
            this.chooseTargetPosition();
            this.decisionTimer = Math.random() * 2 + 2;
          } else {
            this.setState('Run');
            this.chooseTargetPosition();
            this.decisionTimer = Math.random() * 2 + 2;
          }
        }
        break;
      case 'Walk':
        this.move(1.5, deltaTime);
        break;
      case 'Run':
        this.move(3., deltaTime);
        break;
      case 'Fall':
        if (this.timer > this.currentAction.getClip().duration) {
          this.setState('Getup');
        }
        break;
      case 'Getup':
        if (this.timer > this.currentAction.getClip().duration) {
          this.setState('Idle');
          this.decisionTimer = Math.random() * 3 + 2;
        }
        break;
    }

    this.timer += deltaTime;
    this.mixer?.update(deltaTime);
  }

  move(speed, deltaTime) {
    this.instance.translateZ(deltaTime * speed);

    this.targetRotation = Math.atan2(this.targetPosition.x - this.instance.position.x, this.targetPosition.z - this.instance.position.z);
    if (this.targetRotation - this.instance.rotation.y > Math.PI) {
      this.targetRotation -= Math.PI * 2;
    }
    this.instance.rotation.y += (this.targetRotation - this.instance.rotation.y) * 5. * deltaTime;
    if (this.timer > this.decisionTimer || this.instance.position.distanceTo(this.targetPosition) < .1) {
      this.setState('Idle');
      this.decisionTimer = Math.random() * 2 + 5;
    }
  }

  setState(newState) {
    if (this.state === newState) return;

    if (this.animationActions[newState] !== undefined) {
      if (this.currentAction) {
        this.previousAction = this.currentAction;
        this.previousAction.fadeOut(0.25);
      }
      this.currentAction = this.animationActions[newState];
      this.currentAction.reset();
      this.currentAction.fadeIn(0.25);
      this.currentAction.play();
    }
    this.state = newState;
    if (this.state === 'Fall') {
      this.timer = -Math.random();
      const fallDust = new FallDustParticles();
      fallDust.position.copy(this.instance.position);
      fallDust.position.x += Math.sin(this.instance.rotation.y);
      fallDust.position.z += Math.cos(this.instance.rotation.y);
      fallDust.biasAngle = this.instance.rotation.y;
      fallDust.start();
      fallDustParticles.push(fallDust);
    }
    else {
      this.timer = 0;
    }
  }

  chooseTargetPosition() {
    let target;
    do {
      target = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize().multiplyScalar(4 + Math.random() * 2);
    } while (this.instance.position.distanceTo(target) < 2);
    this.targetPosition.copy(target);
    
    if (DEBUG) {
      const targetdebug = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      targetdebug.position.copy(this.targetPosition);
      scene.add(targetdebug);
    }
  }

  raycastObjects() {
    if (!this.instance) return;
    const ray_origin = new THREE.Vector3(this.instance.position.x, 1., this.instance.position.z);
    const ray_direction = new THREE.Vector3(Math.sin(this.instance.rotation.y), 0, Math.cos(this.instance.rotation.y));

    raycaster.set(ray_origin, ray_direction);
    if (DEBUG) {
      debugRay.position.copy(ray_origin);
      debugRay.setDirection(ray_direction);
    }
    
    const intersections = raycaster.intersectObjects(raycastables);
    if (intersections.length > 0) {
      const Magohit = raycastablesMago[intersections[0].object.parent.uuid];
      if (this.state === 'Run' && Magohit && Magohit.state === 'Run') {
        Magohit.setState('Fall');
      } else if (this.state !== 'Fall' && this.state !== 'Getup') {
        this.setState('Idle');
      }
    }
  }

  destroy() {
    scene.remove(this.instance);
  }
}

class DustParticles {
  constructor() {
    this.count = 150;
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({ map: new THREE.TextureLoader().load('particle.png'), size: 0.1, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    this.points = null;
  }

  start() {
    const positions = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = Math.random() * 15 - 7.5;
      positions[i * 3 + 1] = Math.random() * 15 - 7.5;
      positions[i * 3 + 2] = Math.random() * 15 - 7.5;
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  update(deltaTime) {
    if (!this.points) return;
    this.points.rotation.z += deltaTime * 0.1;
  }
}

class TorchLight {
  constructor() {
    this.instance = null;
    this.color = 0x33aaff;
    this.position = new THREE.Vector3(0, 0, 0);
    this.seed = Math.random();
  }

  start() {
    this.instance = new THREE.PointLight( this.color, 35, 100 );
    this.instance.position.copy(this.position);
    scene.add( this.instance );
  }

  update(deltaTime) {
    if (!this.instance) return;
    this.instance.intensity = 35 +( Math.sin(this.seed + clock.elapsedTime * 1.7) * Math.sin(clock.elapsedTime * (7.3 + this.seed))) * 10;
  }
}

class TorchParticles {
  constructor() {
    this.count = 50;
    this.position = new THREE.Vector3(0, 2, 0);
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x33aaff) },
        map: { value: new THREE.TextureLoader().load('particle.png') }
      },
      vertexShader: `
        attribute float lifetime;
        attribute float size;
        attribute float life;
        varying float vLife;
        void main() {
          vLife = life / lifetime;
          vec4 mvPosition = modelViewMatrix * vec4(position + vec3(0.0, life * life * .25, 0.0), 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (1.0 - (2. * vLife - 1.)*(2. * vLife - 1.))/gl_Position.w * 10.0;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D map;
        varying float vLife;
        void main() {
          vec4 texColor = texture(map, gl_PointCoord);
          gl_FragColor = vec4(color, vLife) * texColor;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.points = null;
    this.lifetime = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
    this.size = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
    this.life = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
  }

  start() {
    const positions = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = this.position.x + Math.random() * 0.5 - 0.25;
      positions[i * 3 + 1] = this.position.y + Math.random() * 0.1;
      positions[i * 3 + 2] = this.position.z + Math.random() * 0.5 - 0.25;
      this.lifetime.setX(i, .2 + Math.random() * 3);
      this.size.setX(i, 80 + Math.random() * 20);
      this.life.setX(i, Math.random() * 3);
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('lifetime', this.lifetime);
    this.geometry.setAttribute('size', this.size);
    this.geometry.setAttribute('life', this.life);
    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  update(deltaTime) {
    if (!this.points) return;
    const life = this.geometry.attributes.life.array;
    for (let i = 0; i < this.count; i++) {
      life[i] += deltaTime;
      if (life[i] > this.lifetime.getX(i)) {
        life[i] = 0;
      }
    }
    this.geometry.attributes.life.needsUpdate = true;
  }
}

class FallDustParticles {
  constructor() {
    this.count = 7;
    this.position = new THREE.Vector3(0, 0, 0);
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x99ccff) },
        map: { value: new THREE.TextureLoader().load('smoke.png') }
      },
      vertexShader: `
        attribute vec2 velocity;
        attribute float lifetime;
        attribute float size;
        attribute float life;
        varying float vLife;

        void main() {
          vLife = min(life / lifetime, 1.0);
          float velocityFactor = -1.2/(life+.4)+3.;
          vec4 mvPosition = modelViewMatrix * vec4(position + vec3(velocity.x * velocityFactor, life * life * .1, velocity.y * velocityFactor), 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (2.-2./(vLife+1.))/gl_Position.w * 10.0;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D map;
        varying float vLife;
        void main() {
          vec4 texColor = texture(map, gl_PointCoord);
          gl_FragColor = vec4(color, .5-pow(vLife-.2, 3.)) * texColor;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.points = null;
    this.lifetime = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
    this.size = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
    this.life = new THREE.Float32BufferAttribute(new Float32Array(this.count), 1);
    this.particleSystemLifetime = 2.5;
    this.startDelay = .55;
    this.biasAngle = 0;
    this.timer = 0;
  }

  start() {
    const positions = new Float32Array(this.count * 3);
    const velocities = new Float32Array(this.count * 2);
    for (let i = 0; i < this.count; i++) {
      const angle = this.biasAngle + ((i<this.count/2)?-Math.PI/3:Math.PI/3) + Math.random() * Math.PI / 4 - Math.PI / 8;
      positions[i * 3] = Math.sin(angle) * (Math.random() * .3 + .1) + this.position.x;
      positions[i * 3 + 1] = this.position.y + Math.random() * .1;
      positions[i * 3 + 2] = Math.cos(angle) * (Math.random() * .3 + .1) + this.position.z;
      velocities[i * 2] = positions[i*3] - this.position.x;
      velocities[i * 2 + 1] = positions[i*3+2] - this.position.z
      this.lifetime.setX(i, 1.5 + Math.random() * .5);
      this.size.setX(i, 80 + Math.random() * 20);
      this.life.setX(i, -this.startDelay -Math.random() * .2);
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 2));
    this.geometry.setAttribute('lifetime', this.lifetime);
    this.geometry.setAttribute('size', this.size);
    this.geometry.setAttribute('life', this.life);
    this.points = new THREE.Points(this.geometry, this.material);
    this.timer = this.startDelay + this.particleSystemLifetime;
    scene.add(this.points);
  }

  update(deltaTime) {
    if (!this.points) return;
    this.timer -= deltaTime;
    const life = this.geometry.attributes.life.array;
    if (this.timer < 0) {
      scene.remove(this.points);
      this.points = null;
      return;
    }
    for (let i = 0; i < this.count; i++) {
      life[i] += deltaTime;
    }
    this.geometry.attributes.life.needsUpdate = true;
  }
}

const crystalMaterial = new THREE.ShaderMaterial({
  uniforms: {},
  vertexShader: `
    varying vec4 vNormal;
    void main() {
      vNormal = transpose(inverse(modelViewMatrix)) * vec4(normal, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec4 vNormal;
    void main() {
      // gl_FragColor = vec4(vec4(.0, 1., 1., 1.) * (vNormal * 0.5 + 0.5));
      // gl_FragColor = vec4(vNormal);
      gl_FragColor = vec4(vec3(0.0, 0.6, 1.15) + sin(vNormal.xyz * 9.) * .3, 0.8);
    }
  `,
  transparent: true
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#scene").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.add(new THREE.Vector3(3, 4, 8));

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enableZoom = false
controls.enableDamping = true;
controls.enablePan = false;
controls.target.set(0, 1, 0);
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 8;
controls.update();

const raycaster = new THREE.Raycaster()
raycaster.far = 1.5;
const raycastables = [];
const raycastablesMago = {};
const mouse = new THREE.Vector2()

const debugRay = new THREE.ArrowHelper();
if (DEBUG) {
  scene.add(debugRay);
  debugRay.setLength(1.5);
}

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth/2, window.innerHeight/2), .1, 0.4, 1.));
composer.addPass(new OutputPass());

const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add(ambientLight);

const torchLights = [];
const torchParticles = [];
for (let i = 0; i < 4; i++) {
  const torchLight = new TorchLight();
  const torchParticle = new TorchParticles();
  const position = new THREE.Vector3(i%2 * 10 - 5, 2.5, Math.floor(i/2) * 10 - 5);
  torchLight.position.copy(position);
  torchParticle.position.copy(position);
  torchLight.start();
  torchParticle.start();
  torchLights.push(torchLight);
  torchParticles.push(torchParticle);
}

const clock = new THREE.Clock();

const gltfModelLoader = new GLTFLoader();
const magoArray = [];
for (let i = 0; i < 3; i++) {
  const mago = new Mago();
  magoArray.push(mago);
  mago.start(i + 1);
}

gltfModelLoader.load('gnd.glb' , function ( gltf ) {
  gltf.scene.traverse( function ( child ) {
    if ( child.name.match(/Crystal/) ) {
      child.material = crystalMaterial;
    }
  });
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

const dustParticles = new DustParticles();
dustParticles.start();

const fallDustParticles = [];

function animate() {
	requestAnimationFrame( animate );
  const delta = Math.min(clock.getDelta(), 0.2);
  controls.update();
  torchLights.forEach(torchLight => torchLight.update(delta));
  torchParticles.forEach(torchParticles => torchParticles.update(delta));
  magoArray.forEach(mago => mago.update(delta));
  dustParticles.update(delta);
  fallDustParticles.forEach(fallDustParticles => fallDustParticles.update(delta));
  // renderer.render( scene, camera );
  composer.render();
}
resize();
animate();

function raycastFromMouse(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.far = 15;
  const intersections = raycaster.intersectObjects(raycastables);
  raycaster.far = 1.5;
  return intersections;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  const cameraAngle = Math.atan2(camera.position.z, camera.position.x);
  const aspectRatioFactor = Math.min(Math.max(1, height / width), 1.5);
  const cameraDistance = 8.54 * aspectRatioFactor;
  controls.maxPolarAngle = Math.PI / (2.2 * aspectRatioFactor);
  camera.position.set(Math.cos(cameraAngle) * cameraDistance, camera.position.y, Math.sin(cameraAngle) * cameraDistance);
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

window.onresize = function() { resize(); }

let mouseDownObject = null;
window.onload = function() {
  document.querySelectorAll('.aos-fade-in').forEach((element) => {
    observer.observe(element);
  });
  
  document.querySelector("#scene").addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    const intersections = raycastFromMouse(event);
    if (intersections.length > 0) {
      mouseDownObject = intersections[0].object.parent.uuid;
    }
  });

  document.querySelector("#scene").addEventListener('mouseup', (event) => {
    if (event.button !== 0) return;
    const intersections = raycastFromMouse(event);
    if (intersections.length > 0 && intersections[0].object.parent.uuid === mouseDownObject) {
      const Magohit = raycastablesMago[intersections[0].object.parent.uuid];
      if (Magohit) {
        Magohit.setState('Fall');
      }
    }
  });
}

// Yes, everything is in one file, so what? -.^.- -.^.- -.^.-