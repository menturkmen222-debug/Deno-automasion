// upload.js
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const videoFile = document.getElementById("video").files[0];
  const prompt = document.getElementById("prompt").value;
  const channelsSelect = document.getElementById("channels");
  const channels = Array.from(channelsSelect.selectedOptions).map(opt => opt.value);

  if (!videoFile || !prompt || channels.length === 0) {
    alert("Please fill all fields and select at least one channel.");
    return;
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("prompt", prompt);
  channels.forEach(ch => formData.append("channels", ch));

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Uploading...";

  try {
    const response = await fetch("/upload-video", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      resultDiv.textContent = `Video queued successfully! Cloud URL: ${data.cloudUrl}`;
    } else {
      resultDiv.textContent = `Error: ${data.error}`;
    }
  } catch (err) {
    resultDiv.textContent = `Error: ${err.message}`;
  }
});
