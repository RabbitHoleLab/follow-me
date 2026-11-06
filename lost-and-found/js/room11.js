
(() => {
  window.roomInteractions = window.roomInteractions || {};

  window.roomInteractions[11] = {
    mount(container) {
      container.innerHTML = `
        <section style="
          text-align:center;
          padding:12px 4px;
          color:#ffd4ef;
          font-family:monospace;
        ">
          <div style="font-size:36px;margin-bottom:12px;">
            🌸 🐇 💖 ✌️ 🌈
          </div>

          <h2 style="
            color:#ff77c8;
            font-size:20px;
            margin:0 0 14px;
          ">
            ROOM 11 — THE PINK ROOM
          </h2>

          <p style="color:#a8e6bf;">
            SYSTEM NOTICE: UNEXPECTED HAPPINESS DETECTED.
          </p>

          <p>
            A QUESTION?<br>
            THINK LOVE!!!<br>
            LOVE IS EVERYWHERE!!!
          </p>

          <p style="font-size:12px;color:#e7a4d5;">
            WARNING: EXTREME POSITIVITY AHEAD.
          </p>

          <a
            href="/follow-me/lost-and-found/pink-room/"
            style="
              display:inline-block;
              margin-top:12px;
              padding:12px 18px;
              background:#ff5ab5;
              color:#290020;
              border:2px solid #ffe37a;
              border-radius:24px;
              font-weight:bold;
              text-decoration:none;
            "
          >
            💖 ENTER THE LOVE ZONE 💖
          </a>
        </section>
      `;
    }
  };
})();
