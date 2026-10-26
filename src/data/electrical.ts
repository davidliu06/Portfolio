const pcbProjects = [
  {
    id: "pocket-rhythm",
    name: "PocketRhythm Lite Drum Machine",
    image: "/images/electrical/pocket-rhythm.png",
    model: "/models/pocket-rhythm.glb",
    description: "I designed a compact drum-machine hardware platform around an ESP32-S3: eight tactile buttons, four status LEDs, two knobs, a TFT display socket, and an I2S speaker-amplifier interface on a 100 x 100 mm, two-layer PCB.",
    details: "The 3D view shows the carrier PCB and available component models, not a fully assembled instrument. Hardware-test firmware is included; drum sequencing and first-article testing are the next development steps.",
    status: "Prototype design / hardware testing pending",
    technologies: ["KiCad", "ESP32-S3", "I2S Audio", "Embedded C++", "Two-Layer PCB", "Design for Assembly"],
    choices: [
      { title: "Modular processing & audio", body: "An ESP32-S3-DevKitC-1-N8R8 plugs into two 22-position socket rows. A MAX98357 I2S amplifier module provides the speaker interface. Using socketed modules keeps the carrier focused on controls, interconnects, and mechanical integration while making assembly and replacement more accessible." },
      { title: "Playable control layout", body: "Eight buttons form two columns of four with 25 mm horizontal and 12 mm vertical spacing. Two potentiometers sit above the keys, while four LEDs provide grouped feedback. This arrangement leaves the controls available for step entry, instrument triggers, or shift functions as the sequencer firmware develops." },
      { title: "Display fit & voltage selection", body: "The ST7735S display socket uses 3.3 V logic, with a jumper selecting its 3.3 V or 5 V supply. A resistor limits the backlight feed. Four oval mounting slots allow roughly +/-1 mm adjustment, but the purchased display's exact pinout and mechanical fit still require confirmation on the physical module." },
      { title: "Two-layer routing & assembly", body: "The 100 x 100 mm carrier uses two copper layers, a bottom ground pour, traces at least 0.3 mm wide, and wider power routing. Its 33 through-hole components are intended for hand assembly. Connector orientation, module clearance, mounting holes, and separate plated/non-plated drill outputs connect electrical layout to fabrication and practical assembly." },
      { title: "Bring-up before sequencing", body: "The included firmware exercises buttons, knobs, LEDs, the display, and a quiet audio test tone. It starts with audio muted. Separating hardware bring-up from the future sequencer helps isolate pin-mapping, assembly, display, and audio-interface problems before adding musical behavior." }
    ],
    skills: "Applied schematic capture, GPIO allocation, module pinout verification, I2S integration, through-hole footprint design, two-layer routing, mechanical packaging, and fabrication preparation. The project connects control ergonomics and assembly constraints with embedded hardware-test firmware and a staged bring-up plan.",
    testing: "Saved validation reports record zero reported DRC/ERC violations, zero unconnected items, and no connectivity mismatches across 136 physical pad instances. The hardware-test firmware was compiled for ESP32-S3. These are design-time checks, not proof of working hardware: first power-up, display fit, audio performance, and physical control testing remain pending."
  },
  {
    id: "pcb-business-card",
    name: "NFC PCB Business Card",
    image: "/images/electrical/business-card.png",
    model: "/models/business-card.glb",
    description: "I designed and tested a functional PCB business card that combines NFC circuitry with a personalized copper-and-silkscreen design. It is both a contact-sharing device and a compact example of my electrical engineering work.",
    details: "The board combines an NT3H2111 NFC IC, a printed antenna, an LED circuit, and wave-inspired artwork. The 3D model is exported from my changedsomestuff board revision.",
    status: "Designed & tested",
    technologies: ["KiCad", "NFC", "Antenna Layout", "PCB Design", "Circuit Testing", "Design for Manufacture"],
    choices: [
      { title: "NFC architecture", body: "The NT3H2111 provides a passive NFC interface, allowing a nearby reader to interact with the card without a battery-powered microcontroller. Its small package keeps the electronics compact while leaving room for the antenna and visual design." },
      { title: "Hexagonal antenna & resonance", body: "The hexagonal antenna is printed into the PCB rather than added as a separate module. Its six-sided turns integrate the coil into the card footprint; loop area, trace width, and turn spacing influence coupling, resistance, and inductance. The schematic uses 13.56 MHz and the IC's 50 pF input capacitance as the starting point for an approximately 2.78 uH inductance target. This is a first-order calculation, not a measured resonance: parasitic capacitance and nearby copper affect the finished antenna." },
      { title: "Indicator circuit", body: "The board includes an LED, a 220-ohm resistor, and a 220 nF capacitor alongside the NFC IC. The design balances a visible indicator with the energy available to a compact NFC circuit; load, voltage behavior, and coupling are connected considerations." },
      { title: "Electrical layout meets visual design", body: "Wave artwork and contact information share the board with its antenna and components. Copper, solder mask, and silkscreen have different manufacturing constraints, so the artwork must coexist with clearances, pads, routing, and readable text." },
      { title: "Fabrication & assembly", body: "The small NFC package makes footprint accuracy, pad access, and placement especially important. Board outline, mounting detail, layer alignment, and fabrication outputs connect the visual concept to a physical PCB that can be assembled and inspected." }
    ],
    skills: "Applied NFC circuit design, first-order resonance calculations, PCB antenna layout, fine-pitch placement, and fabrication-aware artwork. Strengthened the connection between electromagnetic behavior, manufacturability, visual communication, and hands-on circuit debugging.",
    testing: "I tested the circuit during development using hands-on functional checks. Specific read-distance, RF tuning, and compatibility measurements are not published here."
  }
] as const;

export const electricalProjects = [pcbProjects[1], pcbProjects[0]] as const;
