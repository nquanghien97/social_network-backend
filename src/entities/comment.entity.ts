export default interface CommentEntity {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string;
  childComments: CommentEntity[];
}