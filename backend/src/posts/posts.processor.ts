import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PostsService } from './posts.service';

@Processor('post-processing')
export class PostsProcessor {
  constructor(private readonly postsService: PostsService) {}

  @Process('process-post')
  async handlePostProcessing(job: Job) {
    console.log('Processing post creation job:', job.id);
    
    try {
      const result = await this.postsService.processPostCreation(job.data);
      console.log('Post created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('Error processing post:', error);
      throw error;
    }
  }
}
