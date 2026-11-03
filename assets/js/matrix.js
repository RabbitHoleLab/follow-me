/* ==========================================
       MATRIX RAIN
    ========================================== */

    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");

    const fontSize = 16;

    /* ==========================================
       MATRIX COLOR EFFECT
    ========================================== */

    let matrixColor = "#57d98b";

    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ";

    let drops = [];
    let width, height;

    /* ==========================================
       RESIZE CANVAS
    ========================================== */

    function resize() {

      const dpr = Math.min(devicePixelRatio || 1, 2);

      width = innerWidth;
      height = innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drops = Array.from(
        { length: Math.ceil(width / fontSize) },
        () => Math.random() * -60
      );

      ctx.fillStyle = "#020907";
      ctx.fillRect(0, 0, width, height);

    }

    /* ==========================================
       DRAW MATRIX RAIN
    ========================================== */

    function draw() {

      ctx.fillStyle = "rgba(2,9,7,.12)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + "px monospace";
      ctx.fillStyle = matrixColor;

      drops.forEach((drop, i) => {

        const char =
          chars[Math.floor(Math.random() * chars.length)];

        ctx.fillText(
          char,
          i * fontSize,
          drop * fontSize
        );

        drops[i] =
          drop * fontSize > height && Math.random() > .98
            ? 0
            : drop + .48;

      });

    }

    /* ==========================================
       INITIALIZE MATRIX
    ========================================== */

    addEventListener("resize", resize);

    resize();

    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(draw, 55);
    } else {
      draw();
    }
