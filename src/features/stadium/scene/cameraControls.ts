/**
 * Camera commands for the HUD buttons. The functions are placeholders here;
 * `CameraRig` (inside the 3D canvas) replaces them with real implementations,
 * so UI code can move the camera without touching Three.js.
 */
export const cameraControls = {
  /** Fly from the spinning intro view to the default view inside the stadium. */
  enterStadium: () => {},
  /** Return to the default view and clear any focused stand / seat view. */
  showFullView: () => {},
  /** Fly to a stand and highlight it. */
  focusSector: (_sector: number) => {},
  /** Sit in a seat: eye-level camera that can look around. */
  viewFromSeat: (_seatId: string) => {},
  /** Leave a seat view (goes back to the default view). */
  leaveSeatView: () => {},
  zoomIn: () => {},
}
