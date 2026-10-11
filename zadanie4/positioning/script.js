const HOTSPOTS = [
    {
        x: 85,
        y: 80,
        title: "Mobilný telefón",
        text: "Mobilný telefón, ktorý používa sused, iPhone 13 Pro Black"
    },
    {
        x: 79,
        y: 55,
        title: "Windows 11",
        text: "Najhorší operačný systém, radšej by bol Linux"
    },
    {
        x: 51,
        y: 33,
        title: "Zamyslený pohľad",
        text: "Sused si zrejme premýšľa, ako by mohol odstrániť Windows a nainštalovať Linux"
    }    
];

function createHotspots() {
  const container = document.querySelector(".hotspot-image");

  HOTSPOTS.forEach((point) => {
    const hotspot = document.createElement("div");
    hotspot.classList.add("hotspot");

    hotspot.style.setProperty("--x", `${point.x}%`);
    hotspot.style.setProperty("--y", `${point.y}%`);

    if (point.x > 70) {
      hotspot.classList.add("hotspot--left");
    }

    const button = document.createElement("button");
    button.classList.add("hotspot__dot");
    button.type = "button";
    button.setAttribute("aria-label", point.title);

    const panel = document.createElement("div");
    panel.classList.add("hotspot__panel");

    const heading = document.createElement("h2");
    heading.textContent = point.title;

    const description = document.createElement("p");
    description.textContent = point.text;

    panel.append(heading, description);
    hotspot.append(button, panel);
    container.append(hotspot);
  });
}

createHotspots();