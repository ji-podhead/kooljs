import { Server } from "bun";

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname === "/" ? "/index.html" : url.pathname;

    // Point to the correct files
    if (filePath.startsWith('/kooljs/')) {
        filePath = `..${filePath}`;
    } else if (filePath.startsWith('/src/')) {
        // no-op
    }
    else {
        filePath = `.${filePath}`;
    }


    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);