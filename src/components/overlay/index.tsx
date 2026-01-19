import { ASCIIArt } from "../ascii-art";

export const Overlay = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <ASCIIArt />
    </div>
  );
};
