export type SongData = {
  title: string;
  artist: string;
  imageUrl?: string;
};

export type AlbumData = {
  albumName: string;
  albumDescription: string;
  category?: string;
  categoryTag?: string;
  isPublic?: string;
  songCount: number;
  songs?: SongData[];
  coverColor?: string;
  coverImageUrl?: string;
  lpColor?: string;
  lpCircleImageUrl?: string;
  nickname: string;
  profileImageUrl?: string;
  createdDate?: string;
};





