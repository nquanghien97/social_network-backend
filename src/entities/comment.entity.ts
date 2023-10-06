export default interface CommentEntity {
  id: string;
  content: string;
  createdAt: string;
  childComments: CommentEntity[];
}