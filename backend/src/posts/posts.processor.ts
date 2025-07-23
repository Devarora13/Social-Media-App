import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PostsService } from './posts.service';

@Processor('post-processing')
export class PostsProcessor {
  constructor(private readonly postsService: PostsService) {}

  @Process('create-post')
  async handlePostProcessing(job: Job) {
    
    try {
      const result = await this.postsService.processPostCreation(job.data);
      return result;
    } catch (error) {
      console.error('Error processing post:', error);
      throw error;
    }
  }
}
