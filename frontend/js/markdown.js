/* ============================================================
   ARK AI — markdown.js
   Markdown rendering and formatting
   ============================================================ */

(function (global) {
  "use strict";

  const { escapeHtml } = global.ARKUI;

  function renderMarkdown(src) {
    const codeBlocks = [];
    let text = String(src).replace(/\r\n/g, "\n");

    // 1. Extract fenced code blocks first so their content is untouched.
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const i = codeBlocks.push({
        lang: lang || "",
        code
      }) - 1;

      return "\u0000CODE" + i + "\u0000";
    });

    text = escapeHtml(text);

    // 2. Tables
    text = text.replace(
      /(^\|.+\|\n\|[ :|-]+\|\n(?:\|.*\|\n?)+)/gm,
      (block) => {
        const rows = block.trim().split("\n");

        const cells = (row) =>
          row
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim());

        const head = cells(rows[0]);
        const body = rows.slice(2).map(cells);

        return (
          "<table><thead><tr>" +
          head.map((h) => "<th>" + h + "</th>").join("") +
          "</tr></thead><tbody>" +
          body
            .map(
              (r) =>
                "<tr>" +
                r.map((c) => "<td>" + c + "</td>").join("") +
                "</tr>"
            )
            .join("") +
          "</tbody></table>"
        );
      }
    );

    // 3. Headings, quotes, inline styles, links
    text = text
      .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
      .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
      .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
      .replace(/^&gt;\s?(.*)$/gm, "<blockquote>$1</blockquote>")
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(
        /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

    // 4. Lists
    text = text.replace(/(?:^(?:\d+\.)\s+.*(?:\n|$))+/gm, (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s+/, ""));

      return (
        "<ol>" +
        items.map((i) => "<li>" + i + "</li>").join("") +
        "</ol>"
      );
    });

    text = text.replace(/(?:^[-*]\s+.*(?:\n|$))+/gm, (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => l.replace(/^[-*]\s+/, ""));

      return (
        "<ul>" +
        items.map((i) => "<li>" + i + "</li>").join("") +
        "</ul>"
      );
    });

    // 5. Paragraphs for remaining loose lines
    text = text
      .split(/\n{2,}/)
      .map((chunk) => {
        const t = chunk.trim();

        if (!t) return "";

        if (/^<(h\d|ul|ol|table|blockquote|pre)/.test(t)) {
          return t;
        }

        return "<p>" + t.replace(/\n/g, "<br>") + "</p>";
      })
      .join("");

    // 6. Restore code blocks
    text = text.replace(
      /\u0000CODE(\d+)\u0000/g,
      (_, i) => {
        const b = codeBlocks[Number(i)];

        return (
          '<pre><code data-lang="' +
          escapeHtml(b.lang) +
          '">' +
          escapeHtml(b.code.trim()) +
          "</code></pre>"
        );
      }
    );

    return text;
  }

  global.ARKMarkdown = {
    renderMarkdown
  };
})(window);