"use client";

import AlbumNameInput from "./AlbumNameInput";
import AlbumDescriptionInput from "./AlbumDescriptionInput";

interface AlbumInputSectionProps {
  albumName: string;
  albumDescription: string;
  onAlbumNameChange: (value: string) => void;
  onAlbumDescriptionChange: (value: string) => void;
}

export default function AlbumInputSection({
  albumName,
  albumDescription,
  onAlbumNameChange,
  onAlbumDescriptionChange,
}: AlbumInputSectionProps) {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <AlbumNameInput value={albumName} onChange={onAlbumNameChange} />
      </div>
      <div>
        <AlbumDescriptionInput value={albumDescription} onChange={onAlbumDescriptionChange} />
      </div>
    </div>
  );
}

