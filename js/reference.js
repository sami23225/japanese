// ============================================================
// reference.js — renders the Particle reference + conjugation
// cheat sheet in the Reference tab.
// ============================================================

window.Reference = (function () {

  function renderParticles() {
    const grid = document.getElementById("particle-grid");
    grid.innerHTML = "";
    window.GRAMMAR.particles.forEach(p => {
      const card = document.createElement("div");
      card.className = "particle-card";
      const exHtml = p.examples.map(e =>
        `<div class="p-ex">${e.jp}<span class="en">${e.en}</span></div>`
      ).join("");
      card.innerHTML = `
        <div class="p-head">
          <span class="p-symbol">${p.particle}</span>
          <span class="p-name">${p.name}</span>
        </div>
        <div class="p-core">${p.core}</div>
        <div class="muted" style="font-size:13px">${p.whenUse}</div>
        ${p.hint ? `<div class="muted" style="font-size:12px; margin-top:4px"><em>${p.hint}</em></div>` : ""}
        ${exHtml}
      `;
      grid.appendChild(card);
    });
  }

  function renderConjRef() {
    const wrap = document.getElementById("conj-ref");
    // Pick sample words to demo
    const verbs = [
      { dict:"たべる", type:"ru", en:"eat" },
      { dict:"のむ",   type:"u",  en:"drink" },
      { dict:"する",   type:"irr",en:"do" },
    ];
    const adjs = [
      { dict:"たかい", type:"i",  en:"expensive" },
      { dict:"きれい", type:"na", en:"pretty (na-adj)" },
      { dict:"いい",   type:"i",  en:"good (irregular)" },
    ];
    const forms = [
      ["polite","past","pastNeg","te","nai","potential"],
    ][0];
    const adjForms = ["polite","past","pastNeg","negative","teForm","adverb"];

    let html = `<h3 style="margin:10px 0 6px">Verbs</h3><div style="overflow-x:auto"><table style="width:100%; border-collapse:collapse; font-size:14px">
      <thead><tr>
        <th style="text-align:left; padding:6px">Verb</th>
        ${forms.map(f => `<th style="padding:6px">${f}</th>`).join("")}
      </tr></thead><tbody>`;
    verbs.forEach(v => {
      html += `<tr><td style="padding:6px"><strong>${v.dict}</strong> <span class="verb-type-badge ${v.type}">${v.type}</span><br><span class="muted">${v.en}</span></td>`;
      forms.forEach(f => {
        html += `<td style="padding:6px; font-weight:700">${window.GRAMMAR.conjugateVerb(v.dict, v.type, f) || "—"}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;

    html += `<h3 style="margin:18px 0 6px">Adjectives</h3><div style="overflow-x:auto"><table style="width:100%; border-collapse:collapse; font-size:14px">
      <thead><tr>
        <th style="text-align:left; padding:6px">Adjective</th>
        ${adjForms.map(f => `<th style="padding:6px">${f}</th>`).join("")}
      </tr></thead><tbody>`;
    adjs.forEach(a => {
      html += `<tr><td style="padding:6px"><strong>${a.dict}</strong> <span class="verb-type-badge ${a.type}">${a.type}</span><br><span class="muted">${a.en}</span></td>`;
      adjForms.forEach(f => {
        html += `<td style="padding:6px; font-weight:700">${window.GRAMMAR.conjugateAdj(a.dict, a.type, f) || "—"}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;

    html += `
      <h3 style="margin:18px 0 6px">Quick rules</h3>
      <ul class="tips">
        <li><strong>ru-verbs</strong>: drop る, add ending. たべる → たべ + ます = たべます.</li>
        <li><strong>u-verbs</strong>: change the final kana to its い-row equivalent for ます, あ-row for ない, え-row for potential/volitional.</li>
        <li><strong>て-form for u-verbs</strong>: う/つ/る → って ・ む/ぶ/ぬ → んで ・ く → いて ・ ぐ → いで ・ す → して.</li>
        <li><strong>Watch out</strong>: 帰る・入る・走る・知る LOOK like ru-verbs but are actually u-verbs.</li>
        <li><strong>i-adj</strong>: drop い, add くない / かった / くなかった / くて.</li>
        <li><strong>na-adj</strong>: use じゃない / だった / じゃなかった / で (te-form). Use な before a noun: きれいな花.</li>
        <li><strong>いい is irregular</strong>: past is よかった, not いかった.</li>
      </ul>`;
    wrap.innerHTML = html;
  }

  function init() {
    renderParticles();
    renderConjRef();
  }

  return { init };
})();
