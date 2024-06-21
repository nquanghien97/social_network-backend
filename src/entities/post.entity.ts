export default interface PostEntity {
  id: string;
  title?: string;
  text?: string;
  imageUrl?: string;
}

export interface UpdatePostEntity {
  title?: string;
  text?: string;
  imageUrl?: string;
  cloudinary_id?: string;
}