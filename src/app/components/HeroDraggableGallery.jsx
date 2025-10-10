"use client";

import "./hero-gallery.css";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import SplitType from "split-type";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9,0,0.1,1");

/**
 * Props:
 *  images        string[]     // `/hero/01.jpg` etc (required-ish; can be empty)
 *  titles        string[]     // optional titles; will loop if shorter than images
 *  columns       number       // virtual columns (default 4)
 *  showControls  boolean      // optional tweakpane controls (default false)
 */
export default function HeroDraggableGallery({
  images = [],
  titles = [
    "Pleasure is a Place on Earth","Artist Residency: The Tank","Chromatic Abberations","2% Fashion Show",
    "Cardboard Furniture","Generative Stamps","Terra","Fractal Mirage","Nova Pulse",
    "Sonic Horizon","Dream Circuit","Lunar Mesh","Radiant Dusk","Pixel Drift",
    "Vortex Bloom","Shadow Static","Crimson Phase","Retro Cascade","Photon Fold","Zenith Flow"
  ],
  columns = 4,
  showControls = false,
}) {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);       // div that we translate (like a "canvas")
  const overlayRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SETTINGS (mirrors your reference)
    const settings = {
      baseWidth: 400,
      smallHeight: 330,
      largeHeight: 500,
      itemGap: 65,
      hoverScale: 1.05,
      expandedScale: 0.45,   // portion of viewport width for expanded
      dragEase: 0.075,
      momentumFactor: 220,
      bufferZone: 3,
      borderRadius: 8,
      vignetteSize: 0,
      overlayOpacity: 0.9,
      overlayEaseDuration: 0.8,
      zoomDuration: 0.6,
    };

    // STATE
    let isDragging = false;
    let startX = 0, startY = 0;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let dragVX = 0, dragVY = 0;
    let lastDragTime = 0;
    let mouseHasMoved = false;
    let lastUpdateTime = 0, lastX = 0, lastY = 0;
    let isExpanded = false, activeItem = null, activeItemId = null;
    let originalPosition = null, expandedItem = null;
    let titleSplit = null, overlayTween = null;
    const visibleIds = new Set();

    const itemSizes = [
      { width: settings.baseWidth, height: settings.smallHeight },
      { width: settings.baseWidth, height: settings.largeHeight },
    ];
    const cellWidth  = settings.baseWidth + settings.itemGap;
    const cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

    // UTIL
    const getItemId = (col, row) => `${col},${row}`;
    const getSizeFor = (row, col) => itemSizes[Math.abs((row * columns + col) % itemSizes.length)];
    const getPosFor  = (col, row) => ({ x: col * cellWidth, y: row * cellHeight });

    // STYLE VARS
    document.documentElement.style.setProperty("--dg-radius", `${settings.borderRadius}px`);
    document.documentElement.style.setProperty("--dg-hover-scale", settings.hoverScale);

    // TITLE helpers
    const setTitle = (txt) => {
      if (!titleRef.current) return;
      if (titleSplit) titleSplit.revert();
      titleRef.current.textContent = txt;
      titleSplit = new SplitType(titleRef.current, { types: "words" });
      gsap.set(titleSplit.words, { y: "100%", opacity: 0 });
    };
    const titleIn  = () => titleSplit && gsap.to(titleSplit.words, { y: "0%", opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" });
    const titleOut = () => titleSplit && gsap.to(titleSplit.words, { y: "-100%", opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" });

    // OVERLAY
    const overlayEl = overlayRef.current;
    const overlayIn = () => {
      overlayEl.classList.add("dg-active");
      if (overlayTween) overlayTween.kill();
      overlayTween = gsap.to(overlayEl, { opacity: settings.overlayOpacity, duration: settings.overlayEaseDuration, ease: "power2.inOut" });
    };
    const overlayOut = () => {
      if (overlayTween) overlayTween.kill();
      overlayTween = gsap.to(overlayEl, {
        opacity: 0, duration: settings.overlayEaseDuration, ease: "power2.inOut",
        onComplete: () => overlayEl.classList.remove("dg-active")
      });
    };

    // VISIBILITY / VIRTUAL GRID
    const canvasEl = canvasRef.current;
    const itemCount = titles.length;
    const makeItem = (col, row) => {
      const id = getItemId(col, row);
      if (visibleIds.has(id)) return;
      if (activeItemId === id && isExpanded) return;

      const size = getSizeFor(row, col);
      const pos  = getPosFor(col, row);
      const index = Math.abs((row * columns + col) % itemCount);
      const src = images.length ? images[index % images.length] : `/hero/${String((index % 9) + 1).padStart(2,"0")}.jpg`;

      const item = document.createElement("div");
      item.className = "dg-item";
      item.id = id;
      item.style.width  = `${size.width}px`;
      item.style.height = `${size.height}px`;
      item.style.left   = `${pos.x}px`;
      item.style.top    = `${pos.y}px`;
      item.dataset.col = col;
      item.dataset.row = row;
      item.dataset.w = String(size.width);
      item.dataset.h = String(size.height);

      const wrap = document.createElement("div");
      wrap.className = "dg-imgwrap";
      const img = document.createElement("img");
      img.src = src;
      img.alt = titles[index];
      wrap.appendChild(img);
      item.appendChild(wrap);

      const cap = document.createElement("div"); cap.className = "dg-cap";
      const name = document.createElement("div"); name.className = "dg-name"; name.textContent = titles[index];
      const num  = document.createElement("div"); num.className = "dg-num";  num.textContent = `#${String(index + 1).padStart(5,"0")}`;
      cap.appendChild(name); cap.appendChild(num);
      item.appendChild(cap);

      item.addEventListener("click", (e) => {
        if (mouseHasMoved || isDragging) return;
        handleExpand(item, index);
      });

      canvasEl.appendChild(item);
      visibleIds.add(id);
    };

    const updateVisible = () => {
      const buffer = settings.bufferZone;
      const vw = window.innerWidth  * (1 + buffer);
      const vh = window.innerHeight * (1 + buffer);
      const startCol = Math.floor((-currentX - vw / 2) / cellWidth);
      const endCol   = Math.ceil ((-currentX + vw * 1.5) / cellWidth);
      const startRow = Math.floor((-currentY - vh / 2) / cellHeight);
      const endRow   = Math.ceil ((-currentY + vh * 1.5) / cellHeight);

      const keep = new Set();
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const id = getItemId(c, r);
          keep.add(id);
          if (!visibleIds.has(id)) makeItem(c, r);
        }
      }
      // Remove offscreen
      visibleIds.forEach((id) => {
        if (!keep.has(id) || (activeItemId === id && isExpanded)) {
          const el = document.getElementById(id);
          if (el && el.parentNode === canvasEl) canvasEl.removeChild(el);
          visibleIds.delete(id);
        }
      });
    };

    // EXPAND / CLOSE
    const handleExpand = (item, idx) => {
      isExpanded = true;
      activeItem = item;
      activeItemId = item.id;
      containerRef.current.style.cursor = "auto";
      const w = parseInt(item.dataset.w, 10);
      const h = parseInt(item.dataset.h, 10);
      const rect = item.getBoundingClientRect();
      const imgSrc = item.querySelector("img").src;

      // Title
      setTitle(titles[idx]);
      gsap.delayedCall(0.45, titleIn);

      // Overlay
      overlayIn();

      // Fade others
      canvasEl.querySelectorAll(".dg-item").forEach((el) => {
        if (el !== item) gsap.to(el, { opacity: 0, duration: settings.overlayEaseDuration, ease: "power2.inOut" });
      });

      // Expanded element
      originalPosition = { rect, w, h };
      const exp = document.createElement("div");
      exp.className = "dg-expanded";
      exp.style.width = `${w}px`;
      exp.style.height = `${h}px`;
      const img = document.createElement("img");
      img.src = imgSrc;
      exp.appendChild(img);
      exp.addEventListener("click", closeExpanded);
      document.body.appendChild(exp);
      expandedItem = exp;

      const vw = window.innerWidth;
      const targetW = vw * settings.expandedScale;
      const ar = h / w;
      const targetH = targetW * ar;

      gsap.fromTo(exp,
        { x: rect.left + w/2 - vw/2, y: rect.top + h/2 - window.innerHeight/2, width: w, height: h },
        { x: 0, y: 0, width: targetW, height: targetH, duration: settings.zoomDuration, ease: "hop" }
      );
    };

    const closeExpanded = () => {
      if (!expandedItem || !originalPosition) return;
      titleOut();
      overlayOut();

      // Fade others back in
      canvasEl.querySelectorAll(".dg-item").forEach((el) => {
        if (el.id !== activeItemId) gsap.to(el, { opacity: 1, duration: settings.overlayEaseDuration, delay: 0.3, ease: "power2.inOut" });
      });

      const { rect, w, h } = originalPosition;
      gsap.to(expandedItem, {
        width: w, height: h,
        x: rect.left + w/2 - window.innerWidth/2,
        y: rect.top + h/2 - window.innerHeight/2,
        duration: settings.zoomDuration, ease: "hop",
        onComplete: () => {
          expandedItem?.parentNode?.removeChild(expandedItem);
          expandedItem = null;
          isExpanded = false;
          activeItem = null;
          activeItemId = null;
          originalPosition = null;
          containerRef.current.style.cursor = "grab";
          dragVX = 0; dragVY = 0;
          updateVisible();
        }
      });
    };

    overlayEl.addEventListener("click", () => { if (isExpanded) closeExpanded(); });

    // DRAGGING / MOMENTUM
    const onDown = (x, y) => {
      if (isExpanded) return;
      isDragging = true; mouseHasMoved = false;
      startX = x; startY = y;
      containerRef.current.style.cursor = "grabbing";
    };
    const onMove = (x, y) => {
      if (!isDragging || isExpanded) return;
      const dx = x - startX, dy = y - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) mouseHasMoved = true;
      const now = Date.now(); const dt = Math.max(10, now - lastDragTime); lastDragTime = now;
      dragVX = dx / dt; dragVY = dy / dt;
      targetX += dx; targetY += dy;
      startX = x; startY = y;
    };
    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      containerRef.current.style.cursor = "grab";
      // momentum
      if (Math.abs(dragVX) > 0.1 || Math.abs(dragVY) > 0.1) {
        targetX += dragVX * settings.momentumFactor;
        targetY += dragVY * settings.momentumFactor;
      }
    };

    const mousedown = (e) => onDown(e.clientX, e.clientY);
    const mousemove = (e) => onMove(e.clientX, e.clientY);
    const mouseup   = () => onUp();
    const touchstart = (e) => onDown(e.touches[0].clientX, e.touches[0].clientY);
    const touchmove  = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const touchend   = () => onUp();

    containerRef.current.addEventListener("mousedown", mousedown);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    containerRef.current.addEventListener("touchstart", touchstart, { passive: true });
    window.addEventListener("touchmove", touchmove, { passive: true });
    window.addEventListener("touchend", touchend);

    const animate = () => {
      // ease towards target
      currentX += (targetX - currentX) * settings.dragEase;
      currentY += (targetY - currentY) * settings.dragEase;
      canvasEl.style.transform = `translate(${currentX}px, ${currentY}px)`;

      const now = Date.now();
      const dist = Math.hypot(currentX - lastX, currentY - lastY);
      if (dist > 100 || now - lastUpdateTime > 120) {
        updateVisible();
        lastX = currentX; lastY = currentY; lastUpdateTime = now;
      }
      requestAnimationFrame(animate);
    };

    // INITIAL build
    updateVisible();
    animate();

    // Resize handling (also resizes expanded size)
    const onResize = () => {
      if (isExpanded && expandedItem && originalPosition) {
        const { w, h } = originalPosition;
        const vw = window.innerWidth;
        const targetW = vw * settings.expandedScale;
        const targetH = targetW * (h / w);
        gsap.to(expandedItem, { width: targetW, height: targetH, duration: 0.3, ease: "power2.out" });
      } else {
        updateVisible();
      }
    };
    window.addEventListener("resize", onResize);

    // Optional: tweakpane controls (lazy loaded)
    let pane;
    if (showControls) {
      import("tweakpane").then(({ Pane }) => {
        pane = new Pane({ title: "Gallery", expanded: false });
        pane.element.style.position = "fixed";
        pane.element.style.top = "10px";
        pane.element.style.right = "10px";
        pane.element.style.zIndex = "80";
        pane.addBinding(settings, "baseWidth", { min: 120, max: 600, step: 10 }).on("change", () => { /* would rebuild grid */ });
        pane.addBinding(settings, "itemGap",   { min:  0, max: 100, step:  5 }).on("change", () => {});
        pane.addBinding(settings, "expandedScale", { min: 0.2, max: 0.8, step: 0.05 });
        pane.addBinding(settings, "overlayOpacity", { min: 0, max: 1, step: 0.05 });
      });
    }

    // CLEANUP
    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("touchmove", touchmove);
      window.removeEventListener("touchend", touchend);
      containerRef.current?.removeEventListener("mousedown", mousedown);
      containerRef.current?.removeEventListener("touchstart", touchstart);
      window.removeEventListener("resize", onResize);
      if (pane) pane.dispose?.();
    };
  }, [images, titles, columns, showControls]);

  return (
    <div ref={rootRef} className="dg-root">
      <div ref={containerRef} className="dg-container">
        <div ref={canvasRef} className="dg-canvas" />
        <div className="dg-title"><p ref={titleRef}></p></div>
        <div ref={overlayRef} className="dg-overlay" />
      </div>
    </div>
  );
}
