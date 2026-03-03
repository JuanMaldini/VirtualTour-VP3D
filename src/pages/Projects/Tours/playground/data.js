// Generated from /playground
// Relative positions (0..1) over floorplan image.
export const floorplanScenePositions = [
  { id: "scene-1", x: 0.7331872050084802, y: 0.6604988772342981 },
  { id: "scene-2", x: 0.43201752254947684, y: 0.7964637919806397 },
  { id: "scene-3", x: 0.7200293113283409, y: 0.6473409835541588 },
  { id: "scene-4", x: 0.4904970678632983, y: 0.6444169982575267 },
];

export const data = {
  scenes: [
    {
      id: "scene-1",
      name: "scene1",
      imageUrl: "blob:http://localhost:5173/3470920a-0b39-497e-a2ab-8ebc49f6f221",
      equirectWidth: 4000,
      initialViewParameters: {
        pitch: 0,
        yaw: 0,
        fov: 110,
      },
      linkHotspots: [
        { yaw: 60.279305, pitch: -19.21807, target: "scene-2" },
        { yaw: -31.381337, pitch: -26.889783, target: "scene-3" },
      ],
      infoHotspots: [
        { yaw: 88.040042, pitch: -6.405186, title: "informacion", text: "phone description" },
      ],
    },
    {
      id: "scene-2",
      name: "scene2",
      imageUrl: "blob:http://localhost:5173/b372c8d9-78b5-4b43-a747-197180aca525",
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -43.641441, pitch: -21.445531, target: "scene-1" },
        { yaw: 68.920507, pitch: -20.062155, target: "scene-4" },
      ],
      infoHotspots: [
        { yaw: 18.884843, pitch: -23.073239, title: "taza", text: "should be clean" },
      ],
    },
    {
      id: "scene-3",
      name: "scene3",
      imageUrl: "blob:http://localhost:5173/4b8e799f-b48f-43dd-bb8a-0507e9e958c3",
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -140.133699, pitch: -24.603145, target: "scene-1" },
        { yaw: 123.782366, pitch: -19.4508, target: "scene-4" },
      ],
      infoHotspots: [
      ],
    },
    {
      id: "scene-4",
      name: "scene4",
      imageUrl: "blob:http://localhost:5173/1b12e658-f2f0-4bb5-b8a5-0c64855c8813",
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -114.52864, pitch: -21.734278, target: "scene-2" },
        { yaw: -35.365572, pitch: -16.045635, target: "scene-3" },
      ],
      infoHotspots: [
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