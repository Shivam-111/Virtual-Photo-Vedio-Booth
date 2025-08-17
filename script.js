alert("⚠ Please...\n allow Camera & Mic Access!");

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gallery = document.getElementById('gallery');

let mediaRecorder;
let recordedChunks = [];

// Access webcam + mic
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    video.srcObject = stream;

    // Setup MediaRecorder
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function(e) {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = function() {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedChunks = [];
      const videoURL = URL.createObjectURL(blob);

      const vid = document.createElement('video');
      vid.src = videoURL;
      vid.controls = true;
      gallery.appendChild(vid);
    };
  })
  .catch(err => console.error('Error accessing webcam:', err));

// Apply filter
function applyFilter(filter) {
  video.style.filter = filter;
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  [...document.querySelectorAll('.filters button')]
    .find(btn => btn.textContent.toLowerCase().includes(filter.split('(')[0]) || filter === 'none')
    .classList.add('active');
}

// Take photo
document.getElementById('takephoto').onclick = function() {
  ctx.filter = getComputedStyle(video).filter;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  gallery.appendChild(img);
};

// Start recording
document.getElementById('startRecord').onclick = () => {
  mediaRecorder.start();
  document.getElementById('startRecord').disabled = true;
  document.getElementById('stopRecord').disabled = false;
};

// Stop recording
document.getElementById('stopRecord').onclick = () => {
  mediaRecorder.stop();
  document.getElementById('startRecord').disabled = false;
  document.getElementById('stopRecord').disabled = true;
};