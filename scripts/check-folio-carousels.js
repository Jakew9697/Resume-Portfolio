// Evaluate in the existing agent-browser session with `agent-browser eval`.
// Exercises rendered navigation and carousel buttons; does not call demo APIs.
(async () => {
  const checks = [];
  const waitFor = async (condition) => {
    const deadline = Date.now() + 7000;
    while (!condition()) {
      if (Date.now() > deadline) throw new Error("Carousel did not settle");
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  };
  const record = (name, passed, detail) =>
    checks.push({ name, passed, detail });
  const navigate = async (id) => {
    const mobileMenu = document.querySelector(".folio-mobile-menu");
    if (mobileMenu.getBoundingClientRect().width) {
      mobileMenu.click();
      await waitFor(() => document.querySelector(".folio-menu").open);
      document.querySelector(`.folio-menu a[href="#${id}"]`).click();
    } else document.querySelector(`.folio-header a[href="#${id}"]`).click();
    await waitFor(
      () =>
        !document.getElementById(id).hidden &&
        !document.querySelector(".folio-menu").open,
    );
  };
  const expected = { home: 2, about: 3, work: 6, contact: 2 };
  for (const [id, count] of Object.entries(expected)) {
    await navigate(id);
    const page = document.getElementById(id);
    const track = page.querySelector(".folio-carousel-track");
    const previous = page.querySelector(
      `button[aria-label="Previous ${id} slide"]`,
    );
    const next = page.querySelector(`button[aria-label="Next ${id} slide"]`);
    await waitFor(
      () =>
        Math.abs(
          track.scrollLeft -
            (Number(
              page
                .querySelector(".folio-slide-count")
                .textContent.split("/")[0],
            ) -
              1) *
              track.clientWidth,
        ) < 1,
    );
    // Return through the UI to the first slide, then visit every slide.
    for (let i = count; i > 0 && !previous.disabled; i--) {
      const before = Math.round(track.scrollLeft / track.clientWidth);
      previous.click();
      await waitFor(
        () =>
          Math.abs(
            track.scrollLeft - Math.max(0, before - 1) * track.clientWidth,
          ) < 1 &&
          page
            .querySelector(".folio-slide-count")
            .textContent.startsWith(
              String(Math.max(1, before)).padStart(2, "0"),
            ),
      );
    }
    record(
      `${id}: independent carousel`,
      page.querySelectorAll("article").length === count &&
        document.querySelectorAll(".folio-carousel:not([hidden])").length === 1,
      { count },
    );
    for (let i = 0; i < count; i++) {
      await waitFor(
        () =>
          Math.abs(track.scrollLeft - i * track.clientWidth) < 1 &&
          page
            .querySelector(".folio-slide-count")
            .textContent.startsWith(String(i + 1).padStart(2, "0")),
      );
      const slide = page.querySelectorAll("article")[i];
      const bounds = slide.getBoundingClientRect();
      const image = slide.querySelector("img");
      if (image) await waitFor(() => image.complete && image.naturalWidth > 0);
      const visibleSlides = [...page.querySelectorAll("article")].filter(
        (element) => !element.inert,
      );
      const isFullScreen =
        Math.abs(bounds.width - track.clientWidth) < 1 &&
        Math.abs(bounds.height - innerHeight) < 1;
      const style = getComputedStyle(slide);
      const cardFree =
        id !== "work" ||
        (style.borderRadius === "0px" &&
          style.boxShadow === "none" &&
          style.padding === "0px");
      const link = slide.querySelector(".folio-project-open");
      const correctLink =
        !link || link.getAttribute("href") === `/${slide.dataset.slide}/`;
      record(
        `${id}: ${slide.dataset.slide}`,
        isFullScreen &&
          cardFree &&
          correctLink &&
          visibleSlides.length === 1 &&
          visibleSlides[0] === slide &&
          previous.disabled === (i === 0) &&
          next.disabled === (i === count - 1),
        {
          width: bounds.width,
          height: bounds.height,
          cardFree,
          link: link?.getAttribute("href") ?? null,
        },
      );
      if (i < count - 1) next.click();
    }
  }
  for (const [id, count] of Object.entries(expected)) {
    await navigate(id);
    const track = document.querySelector(`#${id} .folio-carousel-track`);
    await waitFor(
      () => Math.abs(track.scrollLeft - (count - 1) * track.clientWidth) < 1,
    );
    record(
      `${id}: position retained after page change`,
      document
        .querySelector(`#${id} .folio-slide-count`)
        .textContent.startsWith(String(count).padStart(2, "0")),
    );
  }
  record(
    "No document overflow",
    document.documentElement.scrollWidth <= innerWidth &&
      document.documentElement.scrollHeight <= innerHeight,
  );
  return {
    url: location.href,
    viewport: [innerWidth, innerHeight],
    checkedAt: new Date().toISOString(),
    passed: checks.every((check) => check.passed),
    checks,
  };
})();
