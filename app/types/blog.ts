export interface BlogTimes {
  createdAt: string;
  updatedAt: string;
}

export interface BlogRelation {
  author: string;
  tags: string[];
}

export interface BlogMeta {
  title: string;
  description: string;
  image: string;
  keyword: string;
}

export interface BlogPost {
  _id: string;
  idBlog: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  type: string;
  img_thunmnail: string;
  language: string;
  relation: BlogRelation;
  meta: BlogMeta;
  times: BlogTimes;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogResponse {
  message: string;
  data: BlogPost[];
  pagination: Pagination;
}