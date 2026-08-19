/* ==========================================================================
   RTS TRAVEL HUB - HIGH-FIDELITY 3D AUTOMOTIVE MODELS (Three.js)
   Models: Toyota Innova Crysta, Force Urbania VIP, Maruti Ertiga, Executive Sedan
   ========================================================================== */

const CarModelBuilder = {
  createCarMaterials(paintColor = 0xf5f5f5) {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: paintColor,
        metalness: 0.9,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 1.0,
      }),
      paintRoof: new THREE.MeshPhysicalMaterial({
        color: 0x0a0f1d,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x050c18,
        metalness: 0.95,
        roughness: 0.02,
        transmission: 0.88,
        transparent: true,
        opacity: 0.8,
        ior: 1.52,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.05,
      }),
      blackTrim: new THREE.MeshStandardMaterial({
        color: 0x111318,
        metalness: 0.4,
        roughness: 0.7,
      }),
      rubberTire: new THREE.MeshStandardMaterial({
        color: 0x14161a,
        roughness: 0.85,
        metalness: 0.15,
      }),
      alloyRim: new THREE.MeshStandardMaterial({
        color: 0xe0e6ed,
        metalness: 0.95,
        roughness: 0.15,
      }),
      brakeDisc: new THREE.MeshStandardMaterial({
        color: 0x8892a0,
        metalness: 0.9,
        roughness: 0.3,
      }),
      brakeCaliper: new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Gold Brembo/Executive Caliper
        metalness: 0.8,
        roughness: 0.2,
      }),
      headlightDRL: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00f2fe,
        emissiveIntensity: 2.2,
      }),
      headlightMain: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.5,
      }),
      taillightLED: new THREE.MeshStandardMaterial({
        color: 0xff1e1e,
        emissive: 0xff0808,
        emissiveIntensity: 1.8,
      }),
      interiorLeather: new THREE.MeshStandardMaterial({
        color: 0xc29864, // Executive Tan Diamond Quilted Leather
        roughness: 0.65,
        metalness: 0.1,
      }),
      yellowPlate: new THREE.MeshStandardMaterial({
        color: 0xf1c40f,
        roughness: 0.4,
        metalness: 0.1,
      }),
    };
  },

  createDeluxeWheel(mat, radius = 0.42, width = 0.28) {
    const wheelGroup = new THREE.Group();

    // Tire outer
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, mat.rubberTire);
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim outer ring
    const rimGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width + 0.02, 24);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, mat.alloyRim);
    wheelGroup.add(rim);

    // Brake Disc & Gold Caliper
    const discGeo = new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width * 0.5, 16);
    discGeo.rotateZ(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, mat.brakeDisc);
    wheelGroup.add(disc);

    const calGeo = new THREE.BoxGeometry(0.08, radius * 0.35, 0.12);
    const caliper = new THREE.Mesh(calGeo, mat.brakeCaliper);
    caliper.position.set(0, radius * 0.3, 0);
    wheelGroup.add(caliper);

    // Dual-Tone Luxury Spokes (10-Spoke Design)
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI * 2) / 10;
      const spokeGeo = new THREE.BoxGeometry(0.028, radius * 0.68, width + 0.03);
      const spoke = new THREE.Mesh(spokeGeo, i % 2 === 0 ? mat.alloyRim : mat.blackTrim);
      spoke.rotation.x = angle;
      wheelGroup.add(spoke);
    }

    // Center Hub with Gold Logo
    const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, width + 0.04, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, mat.chrome);
    wheelGroup.add(hub);

    return wheelGroup;
  },

  // 1. TOYOTA INNOVA CRYSTA (Ultra High-Fidelity)
  buildInnovaCrysta(paintColor = 0xf5f5f5) {
    const group = new THREE.Group();
    group.name = 'Toyota Innova Crysta';
    const mat = this.createCarMaterials(paintColor);

    // Lower Main Chassis with sculpted side contours
    const bodyGeo = new THREE.BoxGeometry(2.02, 0.82, 4.45);
    const body = new THREE.Mesh(bodyGeo, mat.paint);
    body.position.y = 0.76;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Aerodynamic Sloped Hood
    const hoodGeo = new THREE.BoxGeometry(1.94, 0.42, 1.3);
    const hood = new THREE.Mesh(hoodGeo, mat.paint);
    hood.position.set(0, 0.96, 1.62);
    hood.rotation.x = 0.13;
    hood.castShadow = true;
    group.add(hood);

    // Front Bumper Lower Lip with Chrome Skid Plate
    const lipGeo = new THREE.BoxGeometry(1.96, 0.26, 0.35);
    const lip = new THREE.Mesh(lipGeo, mat.blackTrim);
    lip.position.set(0, 0.42, 2.22);
    group.add(lip);

    const skidGeo = new THREE.BoxGeometry(1.1, 0.08, 0.36);
    const skid = new THREE.Mesh(skidGeo, mat.chrome);
    skid.position.set(0, 0.32, 2.24);
    group.add(skid);

    // Greenhouse / Cabin Pillars
    const cabinGeo = new THREE.BoxGeometry(1.84, 0.88, 2.72);
    const cabin = new THREE.Mesh(cabinGeo, mat.paintRoof);
    cabin.position.set(0, 1.48, -0.22);
    cabin.castShadow = true;
    group.add(cabin);

    // Sleek Roof
    const roofGeo = new THREE.BoxGeometry(1.8, 0.08, 2.76);
    const roof = new THREE.Mesh(roofGeo, mat.paint);
    roof.position.set(0, 1.93, -0.22);
    roof.castShadow = true;
    group.add(roof);

    // Chrome Roof Rails
    const railGeo = new THREE.CylinderGeometry(0.022, 0.022, 2.45, 12);
    railGeo.rotateX(Math.PI / 2);
    const railL = new THREE.Mesh(railGeo, mat.chrome);
    railL.position.set(0.86, 1.99, -0.22);
    const railR = railL.clone();
    railR.position.x = -0.86;
    group.add(railL, railR);

    // Windshield (Front Glass)
    const wsGeo = new THREE.PlaneGeometry(1.74, 0.98);
    const ws = new THREE.Mesh(wsGeo, mat.glass);
    ws.position.set(0, 1.48, 1.15);
    ws.rotation.x = -Math.PI / 3.9;
    group.add(ws);

    // Rear Windshield
    const rwsGeo = new THREE.PlaneGeometry(1.74, 0.88);
    const rws = new THREE.Mesh(rwsGeo, mat.glass);
    rws.position.set(0, 1.48, -1.58);
    rws.rotation.x = Math.PI / 4.1;
    rws.rotation.y = Math.PI;
    group.add(rws);

    // Panoramic Tinted Side Windows with Chrome Weatherstrip
    const sgGeo = new THREE.PlaneGeometry(2.55, 0.74);
    const sgL = new THREE.Mesh(sgGeo, mat.glass);
    sgL.position.set(0.93, 1.48, -0.22);
    sgL.rotation.y = Math.PI / 2;
    const sgR = new THREE.Mesh(sgGeo, mat.glass);
    sgR.position.set(-0.93, 1.48, -0.22);
    sgR.rotation.y = -Math.PI / 2;
    group.add(sgL, sgR);

    // Chrome Side Beltline
    const beltGeo = new THREE.BoxGeometry(0.04, 0.03, 2.65);
    const beltL = new THREE.Mesh(beltGeo, mat.chrome);
    beltL.position.set(0.95, 1.1, -0.22);
    const beltR = beltL.clone();
    beltR.position.x = -0.95;
    group.add(beltL, beltR);

    // Front Hexagonal Innova Chrome Grille
    const grilleGeo = new THREE.BoxGeometry(1.24, 0.46, 0.12);
    const grille = new THREE.Mesh(grilleGeo, mat.chrome);
    grille.position.set(0, 0.76, 2.26);
    group.add(grille);

    // Toyota Chrome Logo Emblem
    const logoGeo = new THREE.TorusGeometry(0.12, 0.02, 12, 24);
    const logo = new THREE.Mesh(logoGeo, mat.chrome);
    logo.position.set(0, 0.85, 2.33);
    group.add(logo);

    // Crystal LED Projector Headlights
    const hlGeo = new THREE.BoxGeometry(0.38, 0.22, 0.26);
    const hlL = new THREE.Mesh(hlGeo, mat.headlightMain);
    hlL.position.set(0.76, 0.84, 2.22);
    const hlR = hlL.clone();
    hlR.position.x = -0.76;
    group.add(hlL, hlR);

    // Cyber Cyan DRL Eyebrow Strips
    const drlGeo = new THREE.BoxGeometry(0.38, 0.04, 0.28);
    const drlL = new THREE.Mesh(drlGeo, mat.headlightDRL);
    drlL.position.set(0.76, 0.96, 2.23);
    const drlR = drlL.clone();
    drlR.position.x = -0.76;
    group.add(drlL, drlR);

    // L-Shaped LED Taillights
    const tlGeo = new THREE.BoxGeometry(0.36, 0.38, 0.16);
    const tlL = new THREE.Mesh(tlGeo, mat.taillightLED);
    tlL.position.set(0.82, 0.94, -2.22);
    const tlR = tlL.clone();
    tlR.position.x = -0.82;
    group.add(tlL, tlR);

    // Yellow Commercial Registration Number Plates (HR-26 DLF Hub)
    const npGeo = new THREE.BoxGeometry(0.5, 0.15, 0.04);
    const npF = new THREE.Mesh(npGeo, mat.yellowPlate);
    npF.position.set(0, 0.44, 2.28);
    const npR = npF.clone();
    npR.position.set(0, 0.48, -2.25);
    group.add(npF, npR);

    // Side Mirrors with LED Turn Signals
    const mirrorGeo = new THREE.BoxGeometry(0.18, 0.12, 0.24);
    const mirL = new THREE.Mesh(mirrorGeo, mat.paint);
    mirL.position.set(1.04, 1.28, 0.98);
    const mirR = mirL.clone();
    mirR.position.x = -1.04;
    group.add(mirL, mirR);

    // 4 Deluxe Alloy Wheels
    const wFL = this.createDeluxeWheel(mat, 0.42, 0.26);
    wFL.position.set(0.96, 0.42, 1.42);
    const wFR = this.createDeluxeWheel(mat, 0.42, 0.26);
    wFR.position.set(-0.96, 0.42, 1.42);
    const wRL = this.createDeluxeWheel(mat, 0.42, 0.26);
    wRL.position.set(0.96, 0.42, -1.38);
    const wRR = this.createDeluxeWheel(mat, 0.42, 0.26);
    wRR.position.set(-0.96, 0.42, -1.38);
    group.add(wFL, wFR, wRL, wRR);

    // Luxury Captain Recliner Seats Interior (Viewable through tinted glass)
    const seatGeo = new THREE.BoxGeometry(0.5, 0.68, 0.5);
    const seat1 = new THREE.Mesh(seatGeo, mat.interiorLeather);
    seat1.position.set(0.44, 1.18, 0.22);
    const seat2 = seat1.clone();
    seat2.position.x = -0.44;
    const seat3 = seat1.clone();
    seat3.position.set(0.44, 1.18, -0.62);
    const seat4 = seat1.clone();
    seat4.position.set(-0.44, 1.18, -0.62);
    group.add(seat1, seat2, seat3, seat4);

    return { group, materials: mat };
  },

  // 2. FORCE URBANIA (VIP High-Roof Luxury Van)
  buildForceUrbania(paintColor = 0xdcdcdc) {
    const group = new THREE.Group();
    group.name = 'Force Urbania VIP Van';
    const mat = this.createCarMaterials(paintColor);

    // Large Van Body (High Roof)
    const bodyGeo = new THREE.BoxGeometry(2.18, 1.6, 5.25);
    const body = new THREE.Mesh(bodyGeo, mat.paint);
    body.position.y = 1.3;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Sloped Front Fascia
    const noseGeo = new THREE.BoxGeometry(2.1, 0.98, 1.15);
    const nose = new THREE.Mesh(noseGeo, mat.paint);
    nose.position.set(0, 0.98, 2.55);
    nose.rotation.x = 0.18;
    group.add(nose);

    // High Roof Top with AC Pod
    const roofTopGeo = new THREE.BoxGeometry(2.08, 0.28, 4.9);
    const roofTop = new THREE.Mesh(roofTopGeo, mat.paintRoof);
    roofTop.position.set(0, 2.18, 0.1);
    group.add(roofTop);

    // Large Panoramic Side Privacy Glass
    const sgGeo = new THREE.PlaneGeometry(3.8, 0.82);
    const sgL = new THREE.Mesh(sgGeo, mat.glass);
    sgL.position.set(1.1, 1.5, -0.1);
    sgL.rotation.y = Math.PI / 2;
    const sgR = new THREE.Mesh(sgGeo, mat.glass);
    sgR.position.set(-1.1, 1.5, -0.1);
    sgR.rotation.y = -Math.PI / 2;
    group.add(sgL, sgR);

    // Modern DRL Signature Headlamps
    const hlGeo = new THREE.BoxGeometry(0.48, 0.28, 0.22);
    const hlL = new THREE.Mesh(hlGeo, mat.headlightDRL);
    hlL.position.set(0.85, 0.98, 3.05);
    const hlR = hlL.clone();
    hlR.position.x = -0.85;
    group.add(hlL, hlR);

    // Chrome Urbania Radiator Grille
    const grGeo = new THREE.BoxGeometry(1.35, 0.58, 0.16);
    const gr = new THREE.Mesh(grGeo, mat.chrome);
    gr.position.set(0, 0.88, 3.1);
    group.add(gr);

    // Chrome Side Step Board
    const stepGeo = new THREE.BoxGeometry(0.14, 0.08, 3.5);
    const stepL = new THREE.Mesh(stepGeo, mat.chrome);
    stepL.position.set(1.14, 0.36, 0);
    const stepR = stepL.clone();
    stepR.position.x = -1.14;
    group.add(stepL, stepR);

    // Heavy Duty Wheels
    const wFL = this.createDeluxeWheel(mat, 0.48, 0.32);
    wFL.position.set(1.06, 0.48, 1.85);
    const wFR = this.createDeluxeWheel(mat, 0.48, 0.32);
    wFR.position.set(-1.06, 0.48, 1.85);
    const wRL = this.createDeluxeWheel(mat, 0.48, 0.32);
    wRL.position.set(1.06, 0.48, -1.75);
    const wRR = this.createDeluxeWheel(mat, 0.48, 0.32);
    wRR.position.set(-1.06, 0.48, -1.75);
    group.add(wFL, wFR, wRL, wRR);

    return { group, materials: mat };
  },

  // 3. MARUTI ERTIGA (Commercial Executive MPV)
  buildMarutiErtiga(paintColor = 0xffffff) {
    const group = new THREE.Group();
    group.name = 'Maruti Ertiga Commercial';
    const mat = this.createCarMaterials(paintColor);

    const bodyGeo = new THREE.BoxGeometry(1.9, 0.8, 4.15);
    const body = new THREE.Mesh(bodyGeo, mat.paint);
    body.position.y = 0.74;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const hoodGeo = new THREE.BoxGeometry(1.82, 0.42, 1.18);
    const hood = new THREE.Mesh(hoodGeo, mat.paint);
    hood.position.set(0, 0.92, 1.52);
    hood.rotation.x = 0.14;
    group.add(hood);

    const cabinGeo = new THREE.BoxGeometry(1.74, 0.8, 2.55);
    const cabin = new THREE.Mesh(cabinGeo, mat.paintRoof);
    cabin.position.set(0, 1.38, -0.2);
    group.add(cabin);

    const roofGeo = new THREE.BoxGeometry(1.7, 0.08, 2.6);
    const roof = new THREE.Mesh(roofGeo, mat.paint);
    roof.position.set(0, 1.78, -0.2);
    group.add(roof);

    // Headlights & Grille
    const hlGeo = new THREE.BoxGeometry(0.35, 0.22, 0.24);
    const hlL = new THREE.Mesh(hlGeo, mat.headlightMain);
    hlL.position.set(0.72, 0.8, 2.05);
    const hlR = hlL.clone();
    hlR.position.x = -0.72;
    group.add(hlL, hlR);

    const grilleGeo = new THREE.BoxGeometry(1.15, 0.38, 0.09);
    const grille = new THREE.Mesh(grilleGeo, mat.chrome);
    grille.position.set(0, 0.72, 2.1);
    group.add(grille);

    // Wheels
    const wFL = this.createDeluxeWheel(mat, 0.4, 0.25);
    wFL.position.set(0.92, 0.4, 1.35);
    const wFR = this.createDeluxeWheel(mat, 0.4, 0.25);
    wFR.position.set(-0.92, 0.4, 1.35);
    const wRL = this.createDeluxeWheel(mat, 0.4, 0.25);
    wRL.position.set(0.92, 0.4, -1.3);
    const wRR = this.createDeluxeWheel(mat, 0.4, 0.25);
    wRR.position.set(-0.92, 0.4, -1.3);
    group.add(wFL, wFR, wRL, wRR);

    return { group, materials: mat };
  },

  // 4. CORPORATE EXECUTIVE SEDAN
  buildExecutiveSedan(paintColor = 0x111319) {
    const group = new THREE.Group();
    group.name = 'Corporate Executive Sedan';
    const mat = this.createCarMaterials(paintColor);

    const bodyGeo = new THREE.BoxGeometry(1.86, 0.64, 4.35);
    const body = new THREE.Mesh(bodyGeo, mat.paint);
    body.position.y = 0.64;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const hoodGeo = new THREE.BoxGeometry(1.8, 0.32, 1.35);
    const hood = new THREE.Mesh(hoodGeo, mat.paint);
    hood.position.set(0, 0.8, 1.55);
    hood.rotation.x = 0.1;
    group.add(hood);

    const cabinGeo = new THREE.BoxGeometry(1.7, 0.7, 2.25);
    const cabin = new THREE.Mesh(cabinGeo, mat.paintRoof);
    cabin.position.set(0, 1.2, 0.05);
    group.add(cabin);

    const roofGeo = new THREE.BoxGeometry(1.64, 0.06, 1.85);
    const roof = new THREE.Mesh(roofGeo, mat.paint);
    roof.position.set(0, 1.55, 0.05);
    group.add(roof);

    // Front Chrome Grille & Projector Headlights
    const grGeo = new THREE.BoxGeometry(1.18, 0.34, 0.09);
    const gr = new THREE.Mesh(grGeo, mat.chrome);
    gr.position.set(0, 0.64, 2.2);
    group.add(gr);

    const hlGeo = new THREE.BoxGeometry(0.38, 0.18, 0.22);
    const hlL = new THREE.Mesh(hlGeo, mat.headlightDRL);
    hlL.position.set(0.7, 0.7, 2.15);
    const hlR = hlL.clone();
    hlR.position.x = -0.7;
    group.add(hlL, hlR);

    // Low Profile Sport Wheels
    const wFL = this.createDeluxeWheel(mat, 0.38, 0.26);
    wFL.position.set(0.9, 0.38, 1.4);
    const wFR = this.createDeluxeWheel(mat, 0.38, 0.26);
    wFR.position.set(-0.9, 0.38, 1.4);
    const wRL = this.createDeluxeWheel(mat, 0.38, 0.26);
    wRL.position.set(0.9, 0.38, -1.4);
    const wRR = this.createDeluxeWheel(mat, 0.38, 0.26);
    wRR.position.set(-0.9, 0.38, -1.4);
    group.add(wFL, wFR, wRL, wRR);

    return { group, materials: mat };
  },
};

window.CarModelBuilder = CarModelBuilder;
