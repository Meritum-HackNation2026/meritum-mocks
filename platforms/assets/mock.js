// Shared by the five platform mocks: theme switch (?theme=dark or the toggle) and an
// infinite-scroll stub that re-appends the seed posts, so an extension's MutationObserver path runs.
// Each page sets window.MOCK = { list, item, onTheme(dark), onClone(node, round) } before loading this.
(() => {
	const cfg = window.MOCK || {},
		root = document.documentElement,
		q = new URLSearchParams(location.search);
	let dark = q.get("theme") === "dark";
	const apply = () => {
		root.dataset.mockTheme = dark ? "dark" : "light";
		cfg.onTheme?.(dark);
		document.querySelectorAll("[data-mock-theme-toggle]").forEach((b) => {
			b.textContent = dark ? "Motyw: ciemny" : "Motyw: jasny";
		});
	};
	apply();
	document.addEventListener("click", (e) => {
		if (!e.target.closest("[data-mock-theme-toggle]")) return;
		dark = !dark;
		apply();
		q.set("theme", dark ? "dark" : "light");
		history.replaceState(null, "", "?" + q);
	});

	const list = cfg.list && document.querySelector(cfg.list);
	if (!list) return;
	const seed = [...list.querySelectorAll(cfg.item)];
	const sentinel = document.createElement("div");
	sentinel.setAttribute("data-mock-sentinel", "");
	sentinel.setAttribute("aria-hidden", "true");
	sentinel.style.cssText = "height:1px";
	list.append(sentinel);
	let round = 1;
	const suffix = (node, k) => {
		for (const e of [node, ...node.querySelectorAll("[id]")])
			if (e.id) e.id += "-" + k;
		for (const e of [node, ...node.querySelectorAll("[aria-labelledby]")]) {
			const v = e.getAttribute("aria-labelledby");
			if (v)
				e.setAttribute(
					"aria-labelledby",
					v
						.split(/\s+/)
						.map((x) => x + "-" + k)
						.join(" "),
				);
		}
	};
	// shortcut: stops after 8 rounds (32 posts), enough for a stage demo.
	new IntersectionObserver(
		([e]) => {
			if (!e.isIntersecting || round >= 8) return;
			round++;
			for (const n of seed) {
				const c = n.cloneNode(true);
				suffix(c, round);
				cfg.onClone?.(c, round);
				sentinel.before(c);
			}
		},
		{ rootMargin: "900px 0px" },
	).observe(sentinel);
})();
