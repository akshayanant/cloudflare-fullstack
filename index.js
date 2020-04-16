addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond to the request
 * @param {Request} request
 */

//Parser for text --> html
const html = (text) =>
  `<!DOCTYPE html>
${text}`;

//Element Handler for <a>  tag
class ElementHandler {
  element(element) {
    let attribute = element.getAttribute("href");
    if (attribute) {
      element.setAttribute("href", "https://github.com/akshayanant/");
    }
  }

  comments(comment) {}

  text(text) {
    if (!text.lastInTextNode) {
      text.replace("Visit my Github page!");
    }
  }
}

//specific handler for rewriting the Heading
class HeadingHandler {
  element(element) {}

  comments(comment) {}

  text(text) {
    if (!text.lastInTextNode) {
      const str = text.text;
      const markUP = str.includes("1") ? "First" : "Second";
      text.replace(` ${markUP} Variant`);
    }
  }
}

//specific handler for rewriting the Title
class TitleHandler {
  element(element) {}

  comments(comment) {}

  text(text) {
    if (!text.lastInTextNode) {
      const str = text.text;
      const markUP = str.includes("1") ? "First" : "Second";
      text.replace(` ${markUP} Variant`);
    }
  }
}

//specific handler for rewriting the Paragraph
class ParagraphHandler {
  element(element) {}

  comments(comment) {}

  text(text) {
    if (!text.lastInTextNode) {
      const str = text.text;
      const markUP = str.includes("one") ? "first" : "second";
      text.replace(`My Custom ${markUP} variant of take home project`);
    }
  }
}

async function handleRequest(request) {
  const response = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  )
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      const index = Math.random(2) > 0.5 ? 1 : 0;
      const resp2 = await fetch(data.variants[index])
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          const body = html(text);
          return new Response(body, {
            headers: { "Content-Type": "text/html" },
          });
        });
      return new HTMLRewriter()
        .on("title", new TitleHandler())
        .on("a", new ElementHandler())
        .on("h1", new HeadingHandler())
        .on("p", new ParagraphHandler())
        .transform(resp2);
    });
  return response;
}
