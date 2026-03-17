// Generated from /playground
// Info hotspot images — replace blob URLs with real asset paths before deploying:
const infoHotspotImg_s2_h0 = "blob:http://localhost:5173/a341b5ac-2cbe-4242-8b11-343ee498a18b"; // /projects/clientes/cliente/Cisco Webex Board Pro 55 Floor stand.jpg
const infoHotspotImg_s3_h0 = "blob:http://localhost:5173/11d69f59-b707-4951-a0b4-4635db0a68e0"; // /projects/clientes/cliente/Cisco 8875 phone.jpg
const infoHotspotImg_s1_h0 = "blob:http://localhost:5173/46af68ea-6182-46b6-b8c4-fcbae120aec8"; // /projects/clientes/cliente/Cisco 8875 phone.jpg

// Relative positions (0..1) over floorplan image.
export const floorplanScenePositions = [
  { id: "scene-1", x: 0.5, y: 0.5 },
  { id: "scene-2", x: 0.5, y: 0.5 },
  { id: "scene-3", x: 0.5, y: 0.5 },
  { id: "scene-4", x: 0.5, y: 0.5 },
];

export const data = {
  scenes: [
    {
      id: "scene-1",
      name: "scene-1",
      imageUrl: "blob:http://localhost:5173/01b05511-8d59-4409-9d74-053363a0dd26", // original file: TEK016-Cisco-View01.jpg
      equirectWidth: 4000,
      initialViewParameters: {
        pitch: 0,
        yaw: 0,
        fov: 110,
      },
      linkHotspots: [
        { yaw: 62.448729, pitch: -19.091481, target: "scene-2" },
        { yaw: -30.805296, pitch: -23.965281, target: "scene-3" },
      ],
      infoHotspots: [
      ],
    },
    {
      id: "scene-2",
      name: "scene-2",
      imageUrl: "blob:http://localhost:5173/59cd4c50-1d4d-4b0b-a3b0-88da31f19dba", // original file: TEK016-Cisco-View02.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -46.48106, pitch: -20.922145, target: "scene-1" },
        { yaw: 72.407732, pitch: -21.562644, target: "scene-4" },
      ],
      infoHotspots: [
        { yaw: -68.572587, pitch: -10.81987, title: "titlé", text: "", showImage: true, imageUrl: infoHotspotImg_s1_h0 },
      ],
    },
    {
      id: "scene-3",
      name: "scene-3",
      imageUrl: "blob:http://localhost:5173/007c9e47-3309-49e6-8a28-e600287e8337", // original file: TEK016-Cisco-View03.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -130.506397, pitch: -27.315622, target: "scene-1" },
        { yaw: 122.89165, pitch: -18.392499, target: "scene-4" },
      ],
      infoHotspots: [
        { yaw: -17.654822, pitch: 3.412943, title: "tele", text: "", showImage: true, imageUrl: infoHotspotImg_s2_h0 },
      ],
    },
    {
      id: "scene-4",
      name: "scene-4",
      imageUrl: "blob:http://localhost:5173/6b0eda91-1c94-4c7c-bb31-6c5c87ce1897", // original file: TEK016-Cisco-View04.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -118.840023, pitch: -22.266233, target: "scene-2" },
        { yaw: -33.788245, pitch: -17.393323, target: "scene-3" },
      ],
      infoHotspots: [
        { yaw: -96.196475, pitch: -4.927095, title: "telefono", text: "", showImage: true, imageUrl: infoHotspotImg_s3_h0 },
      ],
    }
  ],
  name: "TEK016Cisco",
  floorplanImageUrl: "blob:http://localhost:5173/657f50f8-ab04-481e-a639-8c181159d20a",
  settings: {
    mouseViewMode: "drag",
    autorotateEnabled: false,
    fullscreenButton: true,
    viewControlButtons: false,
  },
};