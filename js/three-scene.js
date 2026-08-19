/* ==========================================================================
   RTS TRAVEL HUB - THREE.JS 3D SHOWROOM CONTROLLER
   360 Interactive Turntable & Automotive Physics (Zero Pricing)
   ========================================================================== */

class Showroom3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.currentCarType = 'innova';
    this.currentColor = 0xf5f5f5;
    this.headlightsOn = true;
    this.autoRotate = true;
    this.currentCarGroup = null;
    this.currentMaterials = null;
    this.turntablePlatform = null;

    this.init();
    this.setupLighting();
    this.buildStudioPlatform();
    this.loadCar('innova');
    this.bindEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060912);
    this.scene.fog = new THREE.FogExp2(0x060912, 0.045);

    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(4.6, 2.0, 5.0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.minDistance = 3.0;
      this.controls.maxDistance = 10.0;
      this.controls.target.set(0, 0.85, 0);
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.2;
    }
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xdbe6fe, 0.9);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(5, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    const fillCyan = new THREE.DirectionalLight(0x00e5ff, 1.3);
    fillCyan.position.set(-6, 4, -4);
    this.scene.add(fillCyan);

    const rimGold = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimGold.position.set(0, 7, -6);
    this.scene.add(rimGold);

    this.frontSpotL = new THREE.SpotLight(0xffffff, 2.2, 14, Math.PI / 5, 0.3);
    this.frontSpotL.position.set(1.5, 0.2, 4.5);
    const targetL = new THREE.Object3D();
    targetL.position.set(0, 0.8, 0);
    this.scene.add(targetL);
    this.frontSpotL.target = targetL;
    this.scene.add(this.frontSpotL);
  }

  buildStudioPlatform() {
    const platform = new THREE.Group();

    const discGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.1, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0c1222,
      metalness: 0.85,
      roughness: 0.2,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -0.05;
    disc.receiveShadow = true;
    platform.add(disc);

    const ringGeo = new THREE.TorusGeometry(3.68, 0.025, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.01;
    platform.add(ring);

    const outerRingGeo = new THREE.TorusGeometry(4.3, 0.018, 16, 64);
    outerRingGeo.rotateX(Math.PI / 2);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.y = -0.01;
    platform.add(outerRing);

    const floorGeo = new THREE.PlaneGeometry(35, 35);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x04060b,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    platform.add(floor);

    this.turntablePlatform = platform;
    this.scene.add(platform);
  }

  loadCar(carType) {
    if (this.currentCarGroup) {
      this.scene.remove(this.currentCarGroup);
    }

    this.currentCarType = carType;
    let carObj;

    switch (carType) {
      case 'innova':
        carObj = window.CarModelBuilder.buildInnovaCrysta(this.currentColor);
        this.updateSpecsUI('Toyota Innova Crysta', '6+1 / 7+1 Seater', '3 Large Bags', '2.4L Turbo Diesel', 'Executive SUV');
        break;
      case 'urbania':
        carObj = window.CarModelBuilder.buildForceUrbania(this.currentColor);
        this.updateSpecsUI('Force Urbania VIP', '10 to 17 Seater', '8+ Large Bags', '2.6L CRDe High-Roof', 'Luxury Commuter');
        break;
      case 'ertiga':
        carObj = window.CarModelBuilder.buildMarutiErtiga(this.currentColor);
        this.updateSpecsUI('Maruti Ertiga Commercial', '6+1 Seater', '2 Suitcases', '1.5L SmartHybrid', 'Corporate MPV');
        break;
      case 'sedan':
        carObj = window.CarModelBuilder.buildExecutiveSedan(this.currentColor);
        this.updateSpecsUI('Corporate Executive Sedan', '4+1 Seater', '2 Suitcases', '1.5L Turbo Diesel', 'Premium Saloon');
        break;
      default:
        carObj = window.CarModelBuilder.buildInnovaCrysta(this.currentColor);
    }

    this.currentCarGroup = carObj.group;
    this.currentMaterials = carObj.materials;
    this.scene.add(this.currentCarGroup);
  }

  updateSpecsUI(name, seats, luggage, engine, segment) {
    const nameEl = document.getElementById('spec-car-name');
    const seatsEl = document.getElementById('spec-car-seats');
    const luggageEl = document.getElementById('spec-car-luggage');
    const engineEl = document.getElementById('spec-car-engine');
    const segmentEl = document.getElementById('spec-car-segment');

    if (nameEl) nameEl.innerText = name;
    if (seatsEl) seatsEl.innerText = seats;
    if (luggageEl) luggageEl.innerText = luggage;
    if (engineEl) engineEl.innerText = engine;
    if (segmentEl) segmentEl.innerText = segment;
  }

  changePaintColor(hexColor) {
    this.currentColor = hexColor;
    if (this.currentMaterials && this.currentMaterials.paint) {
      this.currentMaterials.paint.color.setHex(hexColor);
    }
  }

  toggleHeadlights() {
    this.headlightsOn = !this.headlightsOn;
    const intensity = this.headlightsOn ? 2.5 : 0.05;
    if (this.currentMaterials && this.currentMaterials.headlightMain) {
      this.currentMaterials.headlightMain.emissiveIntensity = intensity;
    }
    if (this.currentMaterials && this.currentMaterials.headlightDRL) {
      this.currentMaterials.headlightDRL.emissiveIntensity = this.headlightsOn ? 2.2 : 0.05;
    }
  }

  setCameraPreset(preset) {
    if (!this.controls) return;
    let targetPos = { x: 4.6, y: 2.0, z: 5.0 };

    switch (preset) {
      case 'front':
        targetPos = { x: 0, y: 1.5, z: 5.8 };
        break;
      case 'side':
        targetPos = { x: 6.2, y: 1.3, z: 0 };
        break;
      case 'rear':
        targetPos = { x: 0, y: 1.6, z: -5.8 };
        break;
      case 'top':
        targetPos = { x: 0.1, y: 7.5, z: 0.1 };
        break;
      case 'interior':
        targetPos = { x: 1.6, y: 1.4, z: 1.6 };
        break;
    }

    this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    this.controls.update();
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
  }

  bindEvents() {
    const hideHint = () => {
      const hint = document.getElementById('drag-hint');
      if (hint) hint.classList.add('hidden');
    };

    this.canvas.addEventListener('mousedown', hideHint);
    this.canvas.addEventListener('touchstart', hideHint);

    const pills = document.querySelectorAll('.fleet-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        pills.forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const carType = e.currentTarget.getAttribute('data-car');
        this.loadCar(carType);

        const bookingSelect = document.getElementById('car-type-select');
        if (bookingSelect) bookingSelect.value = carType;
        const hCarSelect = document.getElementById('h-car-type');
        if (hCarSelect) hCarSelect.value = carType;

        if (window.bookingEngine) {
          window.bookingEngine.selectedCar = carType;
          window.bookingEngine.updateRouteSummary();
        }
      });
    });

    const dots = document.querySelectorAll('.color-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        dots.forEach((d) => d.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const colorHex = parseInt(dot.getAttribute('data-color'), 16);
        this.changePaintColor(colorHex);
      });
    });

    const camBtns = document.querySelectorAll('.cam-btn');
    camBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        if (view === 'headlights') {
          this.toggleHeadlights();
          e.currentTarget.classList.toggle('active');
        } else if (view === 'rotate') {
          this.toggleAutoRotate();
          e.currentTarget.classList.toggle('active');
        } else {
          this.setCameraPreset(view);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      const width = this.canvas.parentElement.clientWidth;
      const height = this.canvas.parentElement.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.turntablePlatform) {
      this.turntablePlatform.rotation.y += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.Showroom3D = Showroom3D;
