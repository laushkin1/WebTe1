const SEMESTER_START = "2026-09-14";
const SEMESTER_END = "2026-12-11";

function initializeNavigation() {
    const navigation = document.querySelector(".site-nav");
    const button = document.querySelector(".menu-toggle");
    if (!button || !navigation) return;

    button.hidden = false;
    document.documentElement.classList.add("has-menu-script");

    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
    });

    navigation.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        button.setAttribute("aria-expanded", "false");
        button.focus();
    });
}

function initializePrintButton() {
	const button = document.querySelector("#print-cv");
	if (!button) return;

	button.addEventListener("click", () => {
		window.print();
	});
}

function initializeSchedule() {
	const table = document.querySelector("#schedule-table");
	if (!table) return;

	const cells = table.querySelectorAll("td[data-type]");
	const scroll = document.querySelector(".schedule-scroll");
	const status = document.querySelector("#schedule-status");
	const clock = document.querySelector("#schedule-clock");
	const filters = document.querySelector(".schedule-filters");
	const progress = document.querySelector("#semester-progress");
	const semesterPercentage = document.querySelector("#semester-percentage");
	const note = document.querySelector("#schedule-note");
	const empty = document.querySelector("#schedule-empty");
	const semesterStatus = document.querySelector("#semester-status");
	const dayLength = 24 * 60 * 60 * 1000;
	const semesterDates = document.querySelector("#semester-dates");
	const semesterStart = Date.parse(SEMESTER_START + "T00:00:00Z");
	const semesterEnd = Date.parse(SEMESTER_END + "T00:00:00Z") + dayLength;

	if (filters) {
		filters.hidden = false;

		filters.addEventListener("click", (event) => {
			const button = event.target.closest("button[data-filter]");
			if (!button) return;

			let visibleCount = 0;

			for (const cell of cells) {
				const visible = button.dataset.filter === "all" ||
					cell.dataset.type === button.dataset.filter;

				cell.dataset.filtered = String(!visible);
				if (visible) visibleCount++;
			}

			for (const filter of filters.querySelectorAll("button")) {
				filter.setAttribute("aria-pressed", String(filter === button));
			}

			scroll.hidden = visibleCount === 0;
			if (empty){
				empty.hidden = visibleCount > 0;
				note.hidden = !(visibleCount > 0);
			}
		});
	}

	function getTimeMinutes(time) {
		const parts = time.split(":");
		return Number(parts[0]) * 60 + Number(parts[1]);
	}

	function getbratislavaTimeParts(date) {
		const formatter = new Intl.DateTimeFormat("en-GB", {
			timeZone: "Europe/Bratislava",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		});

		const values = {};

		for (const part of formatter.formatToParts(date)) {
			if (part.type !== "literal") {
				values[part.type] = Number(part.value);
			}
		}

		return {
			date: Date.UTC(values.year, values.month - 1, values.day),
			minutes: values.hour * 60 + values.minute
		};
	}

	function updateSchedule() {
		const date = new Date();
		const bratislavaTimeParts = getbratislavaTimeParts(date);
		const dateTime = bratislavaTimeParts.date + bratislavaTimeParts.minutes * 60 * 1000;
		const currentDayWeek = new Date(bratislavaTimeParts.date).getUTCDay(); 
		const searchDate = Math.max(bratislavaTimeParts.date, semesterStart);
		const searchDay = new Date(searchDate).getUTCDay();
		let currentCell = null;
		let nextCell = null;
		let nextTime = Infinity;

		for (const cell of cells) {
			delete cell.dataset.current;

			const day = Number(cell.dataset.day);
			const start = getTimeMinutes(cell.dataset.start);
			const end = getTimeMinutes(cell.dataset.end);

			if (semesterStart <= dateTime && dateTime < semesterEnd &&
				currentDayWeek === day && 
				start <= bratislavaTimeParts.minutes && bratislavaTimeParts.minutes < end) {
				currentCell = cell;
				cell.dataset.current = "true";
			}		

			const daysUntilLesson = (day - searchDay + 7) % 7;
			let lessonTime = searchDate + daysUntilLesson * dayLength + start * 60 * 1000;

			if (lessonTime <= dateTime) lessonTime += 7 * dayLength;

			if (lessonTime < semesterEnd && lessonTime < nextTime) {
				nextTime = lessonTime;
				nextCell = cell;
			}
		}

		if (clock) {
			const parts = getbratislavaTimeParts(date);

			const dateText = new Date(parts.date).toLocaleDateString("sk-SK", {
				timeZone: "UTC"
			}).replace(/\.\s+/g, ".");

			const hours = String(Math.floor(parts.minutes / 60)).padStart(2, "0");
			const minutes = String(parts.minutes % 60).padStart(2, "0");

			clock.textContent = `Aktuálny čas v Bratislave: ${dateText}, ${hours}:${minutes}`;
		}

		if (status) {
			if (currentCell) {
				const title = currentCell.querySelector("strong").textContent.trim();
				status.textContent = `Teraz mám: ${title} (${currentCell.dataset.start}-${currentCell.dataset.end}).`;
			} else if (nextCell) {
				const title = nextCell.querySelector("strong").textContent.trim();
				const nextDate = new Date(nextTime).toLocaleDateString("sk-SK", {
					timeZone: "UTC",
					weekday: "long",
					day: "numeric",
					month: "numeric"
				}).replace(/\.\s+/g, ".");

				status.textContent = `Teraz nemám výučbu. Najbližšia hodina: ${title}, ${nextDate} o ${nextCell.dataset.start}.`;
			} else {
				status.textContent = "V tomto semestri už nemám žiadne hodiny.";
			}
		}

		if (semesterDates) {
			const startParts = SEMESTER_START.split("-");
			const endParts = SEMESTER_END.split("-");
			let semesterName = "semestra";

			if (startParts[1] === "09") {
				semesterName = "zimného semestra";
			} else if (startParts[1] === "02") {
				semesterName = "letného semestra";
			}

			const startDate = startParts[2] + "." + startParts[1] + "." + startParts[0];
			const endDate = endParts[2] + "." + endParts[1] + "." + endParts[0];

			semesterDates.textContent = "Výučbová časť " + semesterName + ": " + startDate + " - " + endDate;
		}

		const semesterLength = semesterEnd - semesterStart;
		const elapsed = dateTime - semesterStart;
		const percent = Math.round(Math.max(0, Math.min(100, elapsed / semesterLength * 100)));

		if (progress) {
			progress.value = percent;
			progress.textContent = percent + " %";
		}

		if (semesterPercentage) {
			semesterPercentage.textContent = percent + " %";
		}

		if (semesterStatus) {
			if (dateTime < semesterStart) {
				semesterStatus.textContent = "Výučba sa ešte nezačala.";
			} else if (dateTime >= semesterEnd) {
				semesterStatus.textContent = "Výučbová časť semestra sa už skončila.";
			} else {
				const week = Math.floor((bratislavaTimeParts.date - semesterStart) / (7 * dayLength)) + 1;
				semesterStatus.textContent = `Som v ${week}. týždni výučby.`;
			}
		}
	}

	updateSchedule();
	setInterval(updateSchedule, 60000);
}

function initializeWorkspace() {
	const workspace = document.querySelector(".workspace");
	if (!workspace) return;

	const points = [
		{
			title: "Monitor",
			text: "Na veľkom monitore sa komfortne písať kód a pracovať s počítačom",
			x: 45,
			y: 45,
		},
		{
			title: "Hydratácia",
			text: "Vždy mám po ruke pohár pitnej vody, vodná bilancia je dôležitá",
			x: 95,
			y: 65,
		},
		{
			title: "Aleg",
			text: "Na stole mám aligátora, volá sa Aleg. Raz, keď som si objednal balík z Číny, Aleg prišiel ku mne spolu s ním a odvtedy u mňa býva",
			x: 37,
			y: 79,
		},
		{
			title: "Lovec",
			text: "Moja obľúbená hra je Bloodborne, toto je figúrka z tej hry - Lovec. (Oleg prišiel v inej zásielke)",
			x: 59,
			y: 75,
		},
		{
			title: "Myš",
			text: "Na stole mám myš aj trackpad. Niekedy je pohodlnejšie jedno, inokedy druhé",
			x: 70,
			y: 75,
		},
        {
			title: "Trackpad",
			text: "Na stole mám trackpad aj myš. Niekedy je pohodlnejšie jedno, inokedy druhé",
			x: 69,
			y: 84,
		},
        {
			title: "PS4",
			text: "Niekedy hrám na PlayStation 4, keď mám voľný čas. Ale od začiatku WebTe1 na to nemám čas",
			x: 88,
			y: 65,
		},
        {
			title: "Ventilátor",
			text: "V lete, keď bolo horúco, bol veľmi užitočný. Teraz ho treba odtiaľ odstrániť",
			x: 16,
			y: 69,
		},
        {
			title: "Reproduktor",
			text: "Vlastne ho skoro nepoužívam. Slúži skôr ako dekorácia.",
			x: 47,
			y: 75,
		},
        {
			title: "Krém na ruky",
			text: "Dúfam, že je ešte stále v záruke.",
			x: 30,
			y: 75,
		}
	];

	points.forEach((point, index) => {
		const number = index + 1;
		const id = "workspace-point-" + number;
		const hotspot = document.createElement("div");
        hotspot.classList.add("hotspot");

        hotspot.style.setProperty("--x", `${point.x}%`);
        hotspot.style.setProperty("--y", `${point.y}%`);

        if (point.x > 70) {
            hotspot.classList.add("hotspot__left");
        }
        if (point.x < 20) {
            hotspot.classList.add("hotspot__right");
        }

        const button = document.createElement("button");
        button.classList.add("hotspot__dot");
        button.type = "button";
        button.id = id;
        button.textContent = String(number);
        button.setAttribute("aria-label", point.title);

        const panel = document.createElement("div");
        panel.classList.add("hotspot__panel");

        const heading = document.createElement("h2");
        heading.textContent = point.title;

        const description = document.createElement("p");
        description.textContent = point.text;

        panel.append(heading, description);
        hotspot.append(button, panel);
		workspace.append(hotspot);
	});
}

function initializeMap() {
	const mapElement = document.querySelector("#map");
	if (!mapElement) return;

	const form = document.querySelector("#map-controls");
	const status = document.querySelector("#map-status");

	if (!window.L) {
		status.textContent = "Mapu sa mi nepodarilo načítať. Skontrolujte internetové pripojenie a obnovte stránku.";
		return;
	}

	const destinations = {
		school: { name: "FEI STU", lat: 48.151965, lng: 17.072995 },
		home: { name: "Domov - fiktívna poloha", lat: 48.1605, lng: 17.0515 }
	};

	const storageKey = "laushkin-map-points";
	let points = [];
	let storageMessage = "";
	let line = null;
	const markers = [];
	const destinationMarkers = {};

	try {
		const savedPoints = JSON.parse(localStorage.getItem(storageKey) || "[]");

		if (!Array.isArray(savedPoints) || !savedPoints.every((point) =>
			point && typeof point.name === "string" && point.name.trim()
			&& point.name.length <= 80
			&& Number.isFinite(point.lat) && Math.abs(point.lat) <= 90
			&& Number.isFinite(point.lng) && Math.abs(point.lng) <= 180
		)) {
			throw new Error("Invalid saved map points");
		}

		points = savedPoints;
	} catch {
		storageMessage = "Uložené body sa mi nepodarilo načítať. Môžete pridať nové body.";
	}

	const map = L.map(mapElement).setView([48.151965, 17.072995], 14);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	function createPopup(text) {
		const paragraph = document.createElement("p");
		paragraph.textContent = text;
	    paragraph.style.whiteSpace = "pre-line";
		return paragraph;
	}

	for (const key of Object.keys(destinations)) {
		const destination = destinations[key];
		destinationMarkers[key] = L.marker([destination.lat, destination.lng], {
			title: destination.name,
			alt: destination.name
		}).addTo(map).bindPopup(createPopup(`${destination.name}\n${destination.lat.toFixed(5)}°, ${destination.lng.toFixed(5)}°`));
	}

	function getMapDistance(start, end) {
		const radians = Math.PI / 180;
		const latitudeDifference = (end.lat - start.lat) * radians;
		const longitudeDifference = (end.lng - start.lng) * radians;

		const value = Math.sin(latitudeDifference / 2) ** 2
			+ Math.cos(start.lat * radians) * Math.cos(end.lat * radians)
			* Math.sin(longitudeDifference / 2) ** 2;

		return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, value)));
	}

	function showDistance() {

		const point = points[Number(form.elements.point.value)];
		const destination = destinations[form.elements.destination.value];
		const distance = getMapDistance(point, destination).toFixed(2);

		status.textContent =`${point.name} → ${destination.name}:\n${distance} km vzdušnou čiarou. ${storageMessage}`;
		status.style.whiteSpace = "pre-line";

		if (line) map.removeLayer(line);

		line = L.polyline([
			[point.lat, point.lng],
			[destination.lat, destination.lng]
		], {
			color: getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim(), 
			weight: 4, 
			dashArray: "8, 6"
		}).addTo(map);

		markers.forEach((marker, index) => {
			const markerPoint = points[index];
			marker.bindPopup(createPopup(`${markerPoint.name}\n${markerPoint.lat.toFixed(5)}°, ${markerPoint.lng.toFixed(5)}°`));
		});

		for (const key of Object.keys(destinations)) {
			const markerDestination = destinations[key];
			destinationMarkers[key].bindPopup(createPopup(`${markerDestination.name}\n${markerDestination.lat.toFixed(5)}°, ${markerDestination.lng.toFixed(5)}°`));
		}

		markers[Number(form.elements.point.value)].bindPopup(
			createPopup(`${destination.name} → ${point.name}:\n${distance} km vzdušnou čiarou.`)
		);

		destinationMarkers[form.elements.destination.value].bindPopup(
			createPopup(`${point.name} → ${destination.name}:\n${distance} km vzdušnou čiarou.`)

		);


		map.fitBounds(line.getBounds(), { padding: [30, 30], maxZoom: 15 });
		destinationMarkers[form.elements.destination.value].openPopup();
	}

	function showPoint(point) {
		const marker = L.marker([point.lat, point.lng], {
			title: point.name,
			alt: point.name
		}).addTo(map).bindPopup(createPopup(`${point.name}\n${point.lat.toFixed(5)}°, ${point.lng.toFixed(5)}°`));

		markers.push(marker);
		form.elements.point.add(new Option(point.name, markers.length - 1));
	}

	if (points.length) {
		form.elements.point.replaceChildren();
		points.forEach(showPoint);
		form.elements.point.disabled = false;
		form.querySelector("button").disabled = false;
	}

	function addPoint(coordinates) {
		const location = coordinates.wrap();

		const temporaryMarker = L.marker([location.lat, location.lng], {
			title: "Nové miesto",
			alt: "Nové miesto"
		}).addTo(map);

		const popupForm = document.createElement("form");
		popupForm.className = "map-point-form";

		popupForm.innerHTML = `
			<h3>Nové miesto</h3>
			<p>${location.lat.toFixed(5)}°, ${location.lng.toFixed(5)}°</p>

			<label>
				Ako nazvem toto miesto?
				<input type="text" name="name" placeholder="Napr. knižnica" maxlength="80" required>
			</label>

			<button type="submit">Uložiť miesto</button>
			<button type="button">Zrušiť</button>
		`;

		const input = popupForm.querySelector("input");

		input.addEventListener("input", () => {
			input.setCustomValidity("");
		});

		popupForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const name = input.value.trim();

			if (!name || name.length > 80) {
				input.setCustomValidity("Zadajte názov bodu s 1 až 80 znakmi.");
				input.reportValidity();
				return;
			}

			temporaryMarker.closePopup();

			if (!points.length) form.elements.point.replaceChildren();

			const point = { name, lat: location.lat, lng: location.lng };
			points.push(point);
			showPoint(point);

			form.elements.point.disabled = false;
			form.elements.point.value = String(points.length - 1);
			form.querySelector("button").disabled = false;

			try {
				localStorage.setItem(storageKey, JSON.stringify(points));
				storageMessage = "";
			} catch {
				storageMessage = "Body sa mi nepodarilo uložiť. Po obnovení stránky sa nové body stratia.";
			}

			showDistance();
		});

		popupForm.querySelector('button[type="button"]').addEventListener("click", () => {
			temporaryMarker.closePopup();
		});

		popupForm.addEventListener("keydown", (event) => {
			if (event.key !== "Escape") return;

			event.preventDefault();
			event.stopPropagation();
			temporaryMarker.closePopup();
		});

		temporaryMarker.bindPopup(popupForm, {
			minWidth: 200,
			maxWidth: 260
		});

		temporaryMarker.on("popupopen", () => {
			input.focus({ preventScroll: true });
		});

		temporaryMarker.on("popupclose", () => {
			temporaryMarker.unbindPopup();
			map.removeLayer(temporaryMarker);
			mapElement.focus({ preventScroll: true });
		});

		temporaryMarker.openPopup();
	}

	map.on("click", (event) => addPoint(event.latlng));

	mapElement.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" || event.target !== mapElement) return;
		event.preventDefault();
		addPoint(map.getCenter());
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		showDistance();
	});

}

initializeNavigation();
initializePrintButton();
initializeSchedule();
initializeWorkspace();
initializeMap();
