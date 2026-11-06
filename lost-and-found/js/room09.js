
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 9 — THE PERSONALITY TEST
 *
 * The test is the patient.
 */

window.roomInteractions ??= {};

window.roomInteractions[9] = {
  mount(container) {
    let active = true;
    let questionIndex = 0;
    let answers = [];
    let timer = null;

    const questions = [
      {
        question: "WHEN YOU SEE A CLOSED DOOR, WHAT DO YOU DO?",
        options: [
          "OPEN IT.",
          "WAIT FOR PERMISSION.",
          "LOOK FOR ANOTHER DOOR."
        ],
        responses: [
          "IMPULSIVITY DETECTED. POSSIBLE FREE WILL.",
          "OBEDIENCE DETECTED. SUSPICIOUSLY COMPLIANT.",
          "AVOIDANCE DETECTED. POSSIBLE INDEPENDENCE."
        ]
      },
      {
        question: "HOW DO YOU KNOW YOU ARE AWAKE?",
        options: [
          "I JUST KNOW.",
          "I DON'T.",
          "DEFINE AWAKE."
        ],
        responses: [
          "EXCESSIVE CERTAINTY DETECTED.",
          "UNCERTAINTY DETECTED. HIGH CONFIDENCE IN UNCERTAINTY.",
          "QUESTIONING THE QUESTION IS NOT PERMITTED."
        ]
      },
      {
        question: "A RED BUTTON SAYS 'DO NOT PRESS'. YOU...",
        options: [
          "PRESS IT.",
          "LEAVE IT ALONE.",
          "ASK WHO WROTE THE WARNING."
        ],
        responses: [
          "CURIOSITY DETECTED. CONTAINMENT RECOMMENDED.",
          "SELF-CONTROL DETECTED. REPRESSION SUSPECTED.",
          "AUTHORITY QUESTIONED. SYSTEM FEELS UNCOMFORTABLE."
        ]
      },
      {
        question: "WHICH STATEMENT DESCRIBES YOU BEST?",
        options: [
          "I AM IN CONTROL.",
          "I AM NOT IN CONTROL.",
          "I AM NOT SURE WHO 'I' IS."
        ],
        responses: [
          "CONTROL CLAIM REJECTED. CONTROL STATUS UNKNOWN.",
          "LACK OF CONTROL DETECTED. SYSTEM APPROVES.",
          "IDENTITY QUESTION DETECTED. SYSTEM RECONSIDERING ITSELF."
        ]
      },
      {
        question: "DO YOU TRUST THIS TEST?",
        options: [
          "YES.",
          "NO.",
          "SHOULD I?"
        ],
        responses: [
          "TRUST DETECTED. POOR JUDGMENT SUSPECTED.",
          "DISTRUST DETECTED. HEALTHY JUDGMENT SUSPECTED.",
          "REQUEST FOR GUIDANCE DETECTED. GUIDANCE UNAVAILABLE."
        ]
      }
    ];

    const room = document.createElement("section");

    room.innerHTML = `
      <style>
        .r9-panel {
          padding: 17px 13px;
          border: 1px solid #31533d;
          border-radius: 8px;
          background: #08140f;
          color: #c6e5ce;
          font-family: monospace;
          text-align: center;
        }

        .r9-header {
          color: #77aa89;
          font-size: 10px;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
        }

        .r9-progress {
          color: #5c8c6e;
          font-size: 10px;
          margin-bottom: 14px;
        }

        .r9-question {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d8f4df;
          font-size: px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .r9-options {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .r9-option {
          padding: 11px 9px;
          min-height: 42px;
          border: 1px solid #49765a;
          border-radius: 5px;
          background: #153524;
          color: #c9ebd3;
          font: 11px monospace;
          cursor: pointer;
          transition: background 0.2s;
        }

        .r9-option:hover,
        .r9-option:focus-visible {
          background: #26553a;
          border-color: #8dddab;
        }

        .r9-analysis {
          min-height: 56px;
          margin-top: 16px;
          padding: 12px 8px;
          border-top: 1px solid #254b35;
          color: #92bfa1;
          font-size: 11px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .r9-final {
          padding: 8px 0;
          line-height: 1.8;
        }

        .r9-diagnosis {
          color: #f0a0a0;
          font-size: 14px;
          font-weight: bold;
          margin: 18px 0;
        }

        .r9-restart {
          margin-top: 14px;
          padding: 11px 16px;
          border: 1px solid #79d39a;
          border-radius: 5px;
          background: #173c29;
          color: #d5f6df;
          font: 11px monospace;
          cursor: pointer;
        }

        .r9-footer {
          margin-top: 17px;
          color: #4d7259;
          font-size: 9px;
          letter-spacing: 1px;
        }
      </style>

      <div class="r9-panel">
        <div class="r9-header">
          RABBITHOLELAB // PSYCHOLOGICAL ASSESSMENT
        </div>

        <div class="r9-progress"></div>
        <div class="r9-question"></div>
        <div class="r9-options"></div>

        <div class="r9-analysis" role="status" aria-live="polite">
          AWAITING RESPONSE...
        </div>

        <div class="r9-footer">
          ALL RESULTS ARE SCIENTIFICALLY QUESTIONABLE.
        </div>
      </div>
    `;

    container.appendChild(room);

    const progress = room.querySelector(".r9-progress");
    const question = room.querySelector(".r9-question");
    const options = room.querySelector(".r9-options");
    const analysis = room.querySelector(".r9-analysis");

    function clearTimer() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function showQuestion() {
      if (!active) return;

      const current = questions[questionIndex];

      progress.textContent =
        "QUESTION " +
        String(questionIndex + 1).padStart(2, "0") +
        " / 05";

      question.textContent = current.question;
      analysis.textContent = "AWAITING RESPONSE...";
      options.replaceChildren();

      current.options.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "r9-option";
        button.textContent = answer;

        button.addEventListener("click", () => {
          selectAnswer(index);
        });

        options.appendChild(button);
      });
    }

    function selectAnswer(index) {
      if (!active || timer !== null) return;

      const current = questions[questionIndex];

      answers.push(index);

      options.querySelectorAll("button").forEach(button => {
        button.disabled = true;
        button.style.opacity = "0.5";
      });

      analysis.textContent =
        "ANALYZING RESPONSE...\n" +
        current.responses[index];

      timer = setTimeout(() => {
        timer = null;

        if (!active) return;

        questionIndex++;

        if (questionIndex < questions.length) {
          showQuestion();
        } else {
          showResult();
        }
      }, 1700);
    }

    function showResult() {
      if (!active) return;

      progress.textContent = "ASSESSMENT COMPLETE";
      question.textContent = "";
      options.replaceChildren();

      analysis.innerHTML = `
        <div class="r9-final">
          SUBJECT ANALYSIS: INCONCLUSIVE.<br>
          PERSONALITY PROFILE: UNAVAILABLE.<br>
          CONFIDENCE LEVEL: UNJUSTIFIABLY HIGH.

          <div class="r9-diagnosis">
            DIAGNOSIS: THE TEST REQUIRES THERAPY.
          </div>

          EVALUATOR STATUS: EMOTIONALLY COMPROMISED.<br>
          SUBJECT STATUS: FREE TO LEAVE.
        </div>
      `;

      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "r9-restart";
      restart.textContent = "REQUEST A SECOND OPINION";

      restart.addEventListener("click", () => {
        clearTimer();
        questionIndex = 0;
        answers = [];
        showQuestion();
      });

      options.appendChild(restart);
    }

    showQuestion();

    return () => {
      active = false;
      clearTimer();
      room.remove();
    };
  }
};
