// Run through agent-browser eval on Home, About, Works, and project routes.
// Checks the real rendered flow without changing any demo data.
(async () => {
  const checks = [];
  const record = (name, passed, detail) =>
    checks.push({ name, passed, detail });
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const wait = async (condition) => {
    const deadline = Date.now() + 6000;
    while (!condition()) {
      if (Date.now() > deadline)
        throw new Error("Reference flow did not settle");
      await delay(40);
    }
  };
  await document.fonts.ready;
  const mobile = innerWidth < 768;
  const rail = document.querySelector(".folio-rail").getBoundingClientRect();
  record(
    "Reference navigation dimensions",
    mobile ? rail.height === 65 : rail.width === 64,
    rail.toJSON(),
  );
  record(
    "No document horizontal overflow",
    document.documentElement.scrollWidth <= innerWidth,
    { width: innerWidth, document: document.documentElement.scrollWidth },
  );
  record(
    "Reference fonts loaded",
    ["Folio Editorial", "Folio Montreal"].every((name) =>
      [...document.fonts].some(
        (font) => font.family.includes(name) && font.status === "loaded",
      ),
    ),
  );
  record(
    "Removed slide counters and top desktop navigation",
    !document.querySelector(".folio-carousel,.folio-slide-count,.folio-header"),
  );
  document.querySelector(".folio-menu-toggle").click();
  await wait(() => document.querySelector(".folio-menu").open);
  record(
    "Menu opens and locks background",
    document.body.style.overflow === "hidden",
  );
  record(
    "Separate page destinations",
    [...document.querySelectorAll(".folio-menu nav>a")]
      .map((a) => a.getAttribute("href"))
      .join("|") === "/|/about/|/works/|mailto:jake@syncgr.com",
  );
  document.querySelector(".folio-menu-close").click();
  await wait(() => !document.querySelector(".folio-menu").open);
  record(
    "Menu closes and releases background",
    document.body.style.overflow !== "hidden",
  );

  const track = document.querySelector(".folio-journey-track");
  if (track) {
    const sections = [...track.children];
    const pause = track.querySelector("[data-scroll-pause]");
    const x = () => new DOMMatrix(getComputedStyle(track).transform).m41;
    if (!mobile) {
      for (const section of sections) {
        const target =
          section.offsetLeft +
          (pause && section.offsetLeft > pause.offsetLeft ? innerHeight : 0);
        scrollTo({ top: target, behavior: "instant" });
        await wait(() => Math.abs(x() + section.offsetLeft) < 1);
        record(
          `Horizontal chapter: ${section.getAttribute("aria-label")}`,
          Math.abs(section.getBoundingClientRect().left) < 1 &&
            section.getBoundingClientRect().height === innerHeight,
        );
      }
      if (pause) {
        scrollTo({
          top: pause.offsetLeft + innerHeight * 0.5,
          behavior: "instant",
        });
        await wait(() => Math.abs(x() + pause.offsetLeft) < 1);
        await delay(500);
        record(
          "Work interlude holds while mosaic expands",
          Math.abs(Number(pause.style.getPropertyValue("--interlude")) - 0.5) <
            0.01,
        );
      }
    } else {
      record(
        "Mobile chapters stack vertically",
        getComputedStyle(track).display === "block" &&
          sections.every(
            (section, i) =>
              i === 0 || section.offsetTop > sections[i - 1].offsetTop,
          ),
      );
      if (location.pathname === "/about/") {
        const portrait = document.querySelector(".folio-about-portrait>img");
        record(
          "Mobile About text precedes portrait",
          portrait.getBoundingClientRect().top >
            document
              .querySelector(".folio-about-biography")
              .getBoundingClientRect().bottom,
        );
      }
    }
    scrollTo({ top: 0, behavior: "instant" });
    if (!mobile) await wait(() => Math.abs(x()) < 1);
  }

  let gallery = document.querySelector(".folio-works-viewport");
  if (gallery) {
    const items = [...document.querySelectorAll(".folio-work-item")];
    record(
      "Seven unframed projects",
      items.length === 7 &&
        items.every(
          (item) =>
            getComputedStyle(item).boxShadow === "none" &&
            getComputedStyle(item).borderRadius === "0px",
        ),
    );
    const previews = [...document.querySelectorAll(".folio-work-image img")];
    await Promise.all(previews.map((img) => {
      img.loading = "eager";
      return img.decode().catch(() => {});
    }));
    record(
      "Every preview preserves the complete screenshot",
      previews.every((img) => {
        const style = getComputedStyle(img);
        return img.naturalWidth > 0 && style.objectFit === "contain" &&
          Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight) < 0.02;
      }),
    );
    if (!mobile) {
      gallery.scrollLeft = 0;
      await delay(100);
      window.dispatchEvent(
        new WheelEvent("wheel", { deltaY: 450, cancelable: true }),
      );
      await wait(() => gallery.scrollLeft > 400);
      record("Wheel anywhere scrolls gallery", gallery.scrollLeft > 400);
      gallery.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      await wait(() => gallery.scrollLeft > 550);
      record("Keyboard gallery navigation", gallery.scrollLeft > 550);
    }
    const expectedSlugs = items.map(
      (item) => item.querySelector("a").getAttribute("href").split("/")[2],
    );
    for (const slug of expectedSlugs) {
      document
        .querySelector(`.folio-work-item>a[href="/works/${slug}/"]`)
        .click();
      await wait(() => !!document.querySelector(".folio-project-detail"));
      const detail = document.querySelector(".folio-project-detail");
      record(
        `${slug}: opens full-screen detail`,
        location.pathname === `/works/${slug}/` && !!detail,
      );
      record(
        `${slug}: native live-demo link`,
        [...detail.querySelectorAll("a")].some(
          (a) => a.getAttribute("href") === (slug === "move-v" ? "https://move-v.app/" : `/${slug}/`),
        ),
      );
      const images = [...detail.querySelectorAll(".folio-detail-gallery img")];
      await Promise.all(images.map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }));
      record(
        `${slug}: all full screenshots load without cropping`,
        images.length > 0 && images.every((img) =>
          img.naturalWidth > 0 && getComputedStyle(img).objectFit === "contain"),
      );
      const heading = detail.querySelector("h1");
      const range = document.createRange();
      range.selectNodeContents(heading);
      record(
        `${slug}: title fits`,
        range.getBoundingClientRect().right <=
          heading.getBoundingClientRect().right + 1,
      );
      document.querySelector(".folio-detail-back").click();
      await wait(() => !!document.querySelector(".folio-works-viewport"));
      record(
        `${slug}: back returns to gallery`,
        location.pathname === "/works/",
      );
    }
    document.querySelector(".folio-work-item>a").click();
    await wait(() => !!document.querySelector(".folio-detail-next"));
    document.querySelector(".folio-detail-next>a").click();
    await wait(() => location.pathname === "/works/helga/");
    record(
      "Next project navigation",
      document.querySelector(".folio-project-detail h1").textContent ===
        "Helga",
    );
    history.back();
    await wait(() => location.pathname === "/works/prospects/");
    record(
      "Browser Back updates project view",
      document.querySelector(".folio-project-detail h1").textContent ===
        "Prospects",
    );
    document.querySelector(".folio-detail-back").click();
    await wait(() => !!document.querySelector(".folio-works-viewport"));
  }
  record(
    "All loaded images valid",
    [...document.images]
      .filter((img) => img.complete)
      .every((img) => img.naturalWidth > 0),
  );
  return {
    url: location.href,
    viewport: [innerWidth, innerHeight],
    passed: checks.filter((check) => check.passed).length,
    total: checks.length,
    checks,
  };
})();
