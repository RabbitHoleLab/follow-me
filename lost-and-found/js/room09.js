
"use strict";

/*
 * RABBITHOLELAB — LOST & FOUND
 * ROOM 13 — THE PERSONALITY TEST
 *
 * The test is the patient.
 */

window.roomInteractions ??= {};

window.roomInteractions[13] = {
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
        .r13-panel {
          padding: 17px 13px;
          border: 1px solid #31533d;
          border-radius: 8px;
          background: #08140f;
          color: #c6e5ce;
          font-family: monospace;
          text-align: center;
        }

        .r13-header {
          color: #77aa89;
          font-size: 10px;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
        }

        .r13-progress {
          color: #5c8c6e;
          font-size: 10px;
          margin-bottom: 14px;
        }

        .r13-question {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d8f4df;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .r13-options {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .r13-option {
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

        .r13-option:hover,
        .r13-option:focus-visible {
          background: #26553a;
          border-color: #8dddab;
        }

        .r13-analysis {
          min-height: 56px;
          margin-top: 16px;
          padding: 12px 8px;
          border-top: 1px solid #254b35;
          color: #92bfa1;
          font-size: 11px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .r13-final {
          padding: 8px 0;
          line-height: 1.8;
        }

        .r13-diagnosis {
          color: #f0a0a0;
          font-size: 14px;
          font-weight: bold;
          margin: 18px 0;
        }

        .r13-restart {
          margin-top: 14px;
          padding: 11px 16px;
          border: 1px solid #79d39a;
          border-radius: 5px;
          background: #173c29;
          color: #d5f6df;
          font: 11px monospace;
          cursor: pointer;
        }

        .r13-footer {
          margin-top: 17px;
          color: #4d7259;
          font-size: 9px;
          letter-spacing: 1px;
        }
      </style>

      <div class="r13-panel">
        <div class="r13-header">
          RABBITHOLELAB // PSYCHOLOGICAL ASSESSMENT
        </div>

        <div class="r13-progress"></div>
        <div class="r13-question"></div>
        <div class="r13-options"></div>

        <div class="r13-analysis" role="status" aria-live="polite">
          AWAITING RESPONSE...
        </div>

        <div class="r13-footer">
          ALL RESULTS ARE SCIENTIFICALLY QUESTIONABLE.
        </div>
      </div>
    `;

    container.appendChild(room);

    const progress = room.querySelector(".r13-progress");
    const question = room.querySelector(".r13-question");
    const options = room.querySelector(".r13-options");
    const analysis = room.querySelector(".r13-analysis");

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
        button.className = "r13-option";
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
        <div class="r13-final">
          SUBJECT ANALYSIS: INCONCLUSIVE.<br>
          PERSONALITY PROFILE: UNAVAILABLE.<br>
          CONFIDENCE LEVEL: UNJUSTIFIABLY HIGH.

          <div class="r13-diagnosis">
            DIAGNOSIS: THE TEST REQUIRES THERAPY.
          </div>

          EVALUATOR STATUS: EMOTIONALLY COMPROMISED.<br>
          SUBJECT STATUS: FREE TO LEAVE.
        </div>
      `;

      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "r13-restart";
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
