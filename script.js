/* ======================================================
   JEWELS-AI | 10 TARGET – 10 DRIVE FOLDER ENGINE
   Replace Folder IDs With Real Ones
====================================================== */

const API_KEY = "AIzaSyC_6UEJhSjWUnWaXlBpHy9MYiJAWiX5EBI";

/* ==========================================
   10 DIFFERENT DRIVE FOLDERS (DUMMY)
   Replace with real folder IDs
========================================== */
const FOLDERS = [
  "1VwMKpxjmNMy02Roe_qEDG8Dw3lsgIveV",
  "1TZMdimrOzo_0j2esYkj74ELdSIXBQSjl",
  "1gSqItbKhJpLvYBGQv1NI0fWXkJFJp31S",
  "1ADJEYEnNurtn3-BbxvJ8MhcNwvlCjY5h",
  "1YLkD0LnVbN0YmTxgsSYE8nu7eVe38U1p",
  "1rJb924UWifl0MOlukPSsBRWWVOE1ROEg",
  "1afD_fabfAD8xWMmlgkvu5s_n-PQRnLkB",
  "1N1m0JSjRT58I1VUMZ14YvQxq_pvCOuIR",
  "14cgEAsf_dnX7bDPGaH-UjxK_WkQJoDTO",
  "1K4aAHFqWWB4Et4uIHVY1OqJsBDMA2cip"
];

/* ==========================================
   FETCH LATEST VIDEO FROM A SPECIFIC FOLDER
========================================== */
async function getLatestVideoFromFolder(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video/'&orderBy=modifiedTime desc&pageSize=1&fields=files(id)&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  } catch (error) {
    console.error("Drive Fetch Error:", error);
  }

  return null;
}

/* ==========================================
   MAIN AR ENGINE
========================================== */
window.addEventListener("load", async () => {

  const sceneEl = document.querySelector("a-scene");
  const curtain = document.querySelector("#blackCurtain");

  /* Hide loading curtain when AR is ready */
  sceneEl.addEventListener("arReady", () => {
    if (curtain) {
      curtain.style.opacity = "0";
      setTimeout(() => curtain.style.display = "none", 500);
    }
  });

  /* Loop Through 10 Targets */
  for (let i = 0; i < 10; i++) {

    const videoEl = document.querySelector(`#video${i}`);
    const planeEl = document.querySelector(`#plane${i}`);
    const targetEl = document.querySelectorAll("[mindar-image-target]")[i];

    if (!videoEl || !planeEl || !targetEl) continue;

    /* Fetch Latest Video For That Folder */
    const fileId = await getLatestVideoFromFolder(FOLDERS[i]);

    if (fileId) {
      videoEl.src = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;
      videoEl.load();
    }

    /* When Marker Found */
    targetEl.addEventListener("targetFound", async () => {
      planeEl.setAttribute("visible", "true");
      videoEl.muted = false;

      try {
        await videoEl.play();
      } catch (err) {
        console.log("Autoplay blocked, user interaction required.");
      }
    });

    /* When Marker Lost */
    targetEl.addEventListener("targetLost", () => {
      videoEl.pause();
      planeEl.setAttribute("visible", "false");
    });
  }

});

/* Disable right click */
document.addEventListener("contextmenu", e => e.preventDefault());