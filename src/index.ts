import { serve } from "https://deno.land/std@0.201.0/http/server.ts";

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Shorts Upload</title>
</head>
<body>
  <h1>Upload Video Test</h1>
  <form id="form">
    <input type="file" id="video" required />
    <input type="text" id="prompt" placeholder="Prompt" required />
    <button type="submit">Upload</button>
  </form>
  <script>
    document.getElementById("form").addEventListener("submit", e => {
      e.preventDefault();
      alert("Frontend is working!");
    });
  </script>
</body>
</html>`;

serve((_req) => {
  return new Response(indexHtml, {
    headers: { "Content-Type": "text/html" },
  });
});
