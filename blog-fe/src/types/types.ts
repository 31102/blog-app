export interface ReplyType {
    id: string;
    content: string;
    timestamp: string;
    replies?: ReplyType[];
    user:any; 
  }
  
  export interface CommentType {
    id: string;
    content: string;
    timestamp: string;
    replies?: ReplyType[];
  }
  
  export interface PostType {
    id: string;
    title: string;
    content: string;
    user: { fullname: string } | null;
    comments: CommentType[];
    timestamp: string;
    
  }
  
  export interface CommentType {
    id: string; // Ensure this is also a string
    content: string;
    postId: string;
    user:any; 
  }

  