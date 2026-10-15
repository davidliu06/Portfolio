export const electricalProjects = [
  {
    id: "can-bus-shield",
    name: "ESP32 CAN Bus Shield",
    image: "/images/electrical/can-shield.png",
    model: "/models/can-shield.glb",
    description: "I designed and tested a compact CAN Bus shield that connects an ESP32 DevKit to a physical CAN network. The board brings communication, power conversion, protection, and accessible connectors into one compact assembly.",
    details: "My work spans circuit design, component selection, PCB layout, mechanical integration, and hands-on circuit testing.",
    status: "Designed & tested",
    technologies: ["KiCad", "ESP32", "CAN Bus", "PCB Layout", "Power Electronics", "Circuit Testing"],
    choices: [
      { title: "CAN interface & termination", body: "The SN65HVD233 bridges the ESP32's logic signals to CAN H and CAN L. A selectable 120-ohm termination resistor accommodates the board's position on the bus instead of permanently loading every connection. The NUP2105L provides dedicated protection on the bus lines." },
      { title: "Switching power supply", body: "The TPS54331 buck stage uses a 6.8 uH inductor, B340A catch diode, and input/output capacitors. Switching conversion addresses the efficiency tradeoff of stepping a higher input voltage down to the logic rail. Placement balances short current loops, capacitor access, and separation from communication circuitry." },
      { title: "Compact mechanical integration", body: "The approximately 31.8 x 61.77 mm outline fits around the DevKit socket rows and OBD connector. Mounting holes, header pitch, connector orientation, and component height are electrical and mechanical constraints at the same time. Most shield components sit underneath, leaving the DevKit sockets on top." },
      { title: "Configuration & observability", body: "Jumpers, switches, LEDs, and accessible CAN/I2C connectors make the hardware configurable and easier to inspect. A 1 MOhm / 270 kOhm divider connects battery sensing to the ADC; divider ratio, input limits, and unpowered behavior matter as much as physical routing." },
      { title: "Layout tradeoffs", body: "The compact revision prioritizes footprint size and does not preserve a dedicated ESP32 antenna keepout, trading RF margin for packaging density. USB/external-power interaction and protection limits remain distinct considerations from basic functional testing; no automotive qualification is claimed." }
    ],
    skills: "Applied schematic capture, datasheet interpretation, component and footprint selection, routing, connector integration, and fabrication preparation. Strengthened the ability to reason across power, communication, mechanical fit, and practical debugging instead of treating each subsystem in isolation.",
    testing: "I performed hands-on circuit testing during development, focusing on functional behavior and debugging. Detailed measurements are not published here."
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
      { title: "Printed antenna & resonance", body: "The antenna is part of the PCB rather than a separate module. The schematic uses 13.56 MHz and the IC's 50 pF input capacitance as the starting point for an approximately 2.78 uH inductance target. This is a first-order calculation, not a measured resonance: geometry, parasitic capacitance, and nearby copper affect the finished antenna." },
      { title: "Indicator circuit", body: "The board includes an LED, a 220-ohm resistor, and a 220 nF capacitor alongside the NFC IC. The design balances a visible indicator with the energy available to a compact NFC circuit; load, voltage behavior, and coupling are connected considerations." },
      { title: "Electrical layout meets visual design", body: "Wave artwork and contact information share the board with its antenna and components. Copper, solder mask, and silkscreen have different manufacturing constraints, so the artwork must coexist with clearances, pads, routing, and readable text." },
      { title: "Fabrication & assembly", body: "The small NFC package makes footprint accuracy, pad access, and placement especially important. Board outline, mounting detail, layer alignment, and fabrication outputs connect the visual concept to a physical PCB that can be assembled and inspected." }
    ],
    skills: "Applied NFC circuit design, first-order resonance calculations, PCB antenna layout, fine-pitch placement, and fabrication-aware artwork. Strengthened the connection between electromagnetic behavior, manufacturability, visual communication, and hands-on circuit debugging.",
    testing: "I tested the circuit during development using hands-on functional checks. Specific read-distance, RF tuning, and compatibility measurements are not published here."
  }
] as const;
