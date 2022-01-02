import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private URL: string = 'https://fakestoreapi.com/products';

  selectedPost: post = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0,
    },
  };

  selectedPosts: post[];

  posts: post[];

  constructor(public http: HttpClient) {}

  getPost(id: number) {
    return this.http.get(`${this.URL}/${id}`);
  }

  getPosts() {
    return this.http.get<post[]>(this.URL);
  }

  createPost(post: post) {
    return this.http.post(this.URL, post);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }

  updatePost(post: post) {
    return this.http.put(`${this.URL}/${post.id}`, post);
  }

  updatePostPatch(post: post) {
    return this.http.patch(`${this.URL}/${post.id}`, post);
  }
}
