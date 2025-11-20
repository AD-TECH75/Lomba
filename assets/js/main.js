// ====================================================================
// FUNGSI UTAMA SMOOTH SCROLL KUSTOM (SINE EASING)
// Digunakan untuk navigasi menu dan tombol 'Scroll to Top'
// ====================================================================
function smoothScroll(targetElement, duration) {
	const targetPosition =
		targetElement.offsetTop === undefined ? 0 : targetElement.offsetTop;

	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;

	function ease(t, b, c, d) {
		return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
	}

	function animation(currentTime) {
		if (startTime === null) startTime = currentTime;

		const timeElapsed = currentTime - startTime;

		if (timeElapsed < duration) {
			const run = ease(timeElapsed, startPosition, distance, duration);
			window.scrollTo(0, run);
			requestAnimationFrame(animation);
		} else {
			window.scrollTo(0, targetPosition);
		}
	}

	requestAnimationFrame(animation);
}

// ====================================================================
// FUNGSI INTERAKTIVITAS PETA (Tooltips & Redirection)
// ====================================================================
function setupMapInteractivity() {
	const mapContainer = document.getElementById("map-container");
	const tooltip = document.getElementById("tooltip");
	const imageContainer = document.getElementById("tooltip-image-container");
	const textContainer = document.getElementById("tooltip-text-container");

	if (!tooltip || !imageContainer || !textContainer || !mapContainer) {
		console.error(
			"Kesalahan Tooltip: Salah satu elemen peta/tooltip tidak ditemukan."
		);
		return;
	}

	const mapGroups = mapContainer.querySelectorAll("g[data-name]");

	const formatToSafeUrl = (name) => {
		return name.toLowerCase().replace(/\s+/g, "-");
	};

	mapGroups.forEach((groupElement) => {
		const regionName = groupElement.getAttribute("data-name");
		const imageUrl = groupElement.getAttribute("data-image");
		const typeName = groupElement.getAttribute("data-type");

		// ------------------------ 1. LOGIKA KLIK REGION ------------------------
		if (regionName) {
			const safeName = formatToSafeUrl(regionName);
			const targetUrl = `data/daerah/${typeName}/${safeName}.html`;

			groupElement.addEventListener("click", (event) => {
				event.stopPropagation();
				window.location.href = targetUrl;
			});

			groupElement.style.cursor = "pointer";
		}

		// ------------------------ 2. LOGIKA NAV DROPDOWN (ASLI) ------------------------
		document
			.querySelectorAll('.district-nav a[href^="#"]')
			.forEach((anchor) => {
				anchor.addEventListener("click", function (e) {
					if (this.classList.contains("nav-dropdown-toggle")) {
						e.preventDefault();

						const parentLi = this.closest(".dropdown-item");

						allDropdownItems().forEach((item) => {
							if (item !== parentLi) item.classList.remove("active");
						});

						parentLi.classList.toggle("active");

						if (parentLi.classList.contains("active")) {
							initialScrollY = window.scrollY;
						} else {
							initialScrollY = null;
						}
					} else {
						e.preventDefault();

						const targetId = this.getAttribute("href");
						const targetElement = document.querySelector(targetId);

						if (targetElement) {
							smoothScroll(targetElement, SCROLL_DURATION_NAV);
						}
					}
				});
			});

		// ------------------------ 3. LOGIKA TOOLTIP ------------------------
		groupElement.addEventListener("mouseenter", () => {
			textContainer.innerHTML = regionName
				? regionName.toUpperCase()
				: "NAMA DAERAH";

			if (imageUrl) {
				imageContainer.style.backgroundImage = `url('${imageUrl}')`;
				imageContainer.style.backgroundColor = "transparent";
			} else {
				imageContainer.style.backgroundImage = "none";
				imageContainer.style.backgroundColor = "#6c757d";
			}

			tooltip.style.opacity = 1;
			groupElement.classList.add("hovered");
		});

		groupElement.addEventListener("mousemove", (event) => {
			tooltip.style.left = event.pageX + 15 + "px";
			tooltip.style.top = event.pageY - 15 + "px";
		});

		groupElement.addEventListener("mouseleave", () => {
			tooltip.style.opacity = 0;
			groupElement.classList.remove("hovered");
		});
	});
}

// ====================================================================
// EVENT: DOCUMENT READY (PEMANGGIL AWAL SETUP NAV BARU & MAP)
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
	setupDistrictNavigationRedirection();
});

// ====================================================================
// LOGIKA UTAMA DROPDOWN + SMOOTH SCROLL + TOMBOL SCROLL TOP
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
	setupMapInteractivity();

	// CONFIG
	const SCROLL_THRESHOLD_DROPDOWN = 250;
	const SCROLL_VISIBILITY_THRESHOLD = 300;
	const SCROLL_DURATION_TOP = 600;
	const SCROLL_DURATION_NAV = 500;

	let initialScrollY = null;

	// SELECTORS
	const allDropdownItems = () =>
		document.querySelectorAll(".district-nav .dropdown-item");

	const activeDropdowns = () =>
		document.querySelectorAll(".district-nav .dropdown-item.active");

	const scrollToTopBtn = document.getElementById("scrollToTopBtn");

	// ------------------------ A. KLIK DROPDOWN NAV ------------------------
	document.querySelectorAll('.district-nav a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			if (this.classList.contains("nav-dropdown-toggle")) {
				e.preventDefault();

				const parentLi = this.closest(".dropdown-item");

				allDropdownItems().forEach((item) => {
					if (item !== parentLi) item.classList.remove("active");
				});

				parentLi.classList.toggle("active");

				if (parentLi.classList.contains("active")) {
					initialScrollY = window.scrollY;
				} else {
					initialScrollY = null;
				}
			} else {
				e.preventDefault();

				const targetId = this.getAttribute("href");
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					smoothScroll(targetElement, SCROLL_DURATION_NAV);
				}
			}
		});
	});

	// ------------------------ B. TOMBOL SCROLL KE ATAS ------------------------
	if (scrollToTopBtn) {
		scrollToTopBtn.addEventListener("click", () => {
			smoothScroll(document.body, SCROLL_DURATION_TOP);
			closeAllDropdowns();
		});
	}

	// ------------------------ C. EVENT KLIK DI LUAR DROPDOWN ------------------------
	document.addEventListener("click", (event) => {
		if (!event.target.closest(".dropdown-item")) {
			closeAllDropdowns();
		}
	});

	// ------------------------ D. EVENT SCROLL ------------------------
	window.addEventListener("scroll", () => {
		if (activeDropdowns().length > 0 && initialScrollY !== null) {
			const currentScrollY = window.scrollY;
			const scrollDistance = Math.abs(currentScrollY - initialScrollY);

			if (scrollDistance > SCROLL_THRESHOLD_DROPDOWN) {
				closeAllDropdowns();
			}
		}

		if (scrollToTopBtn) {
			if (window.pageYOffset > SCROLL_VISIBILITY_THRESHOLD) {
				scrollToTopBtn.classList.add("show");
			} else {
				scrollToTopBtn.classList.remove("show");
			}
		}
	});

	// ------------------------ FUNGSI BANTU ------------------------
	function closeAllDropdowns() {
		activeDropdowns().forEach((item) => item.classList.remove("active"));
		initialScrollY = null;
	}
});

// ====================================================================
// NAVIGATION REDIRECTION LIKE SVG
// ====================================================================
function setupNavLikeSVG() {
	const formatToSafeUrl = (name) => {
		return name.toLowerCase().replace(/\s+/g, "-");
	};

	const navItems = document.querySelectorAll(".district-nav a[data-name]");

	navItems.forEach((item) => {
		const regionName = item.getAttribute("data-name");
		const regionType = item.getAttribute("data-type");

		if (!regionName || !regionType) return;

		const safeName = formatToSafeUrl(regionName);
		const targetUrl = `data/daerah/${regionType}/${regionType}-${safeName}.html`;

		item.addEventListener("click", (e) => {
			e.preventDefault();
			window.location.href = targetUrl;
		});
	});
}

setupNavLikeSVG();
