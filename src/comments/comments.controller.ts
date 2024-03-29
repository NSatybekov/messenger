import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface } from 'src/auth/dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CommentDto, UpdateCommentDto } from './comments.entity';
import { CommentsService } from './comments.service';

@ApiBearerAuth()
@ApiTags('comments of posts')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @ApiParam({ name: 'postId', description: ' post id' })
  @ApiOperation({ summary: 'Get list of post comments' })
  @UseGuards(JwtGuard)
  @Get()
  getPostComments(
    @GetUser() user: UserInterface,
    @Param('postId') post_id: number,
  ) {
    return this.commentService.getPostComments(user, post_id);
  }

  @ApiParam({ name: 'postId', description: ' post id' })
  @ApiOperation({ summary: 'create new comment' })
  @UseGuards(JwtGuard)
  @Post('')
  addCommentToPost(
    @GetUser() user: UserInterface,
    @Param('postId') post_id: number,
    @Body() body: CommentDto,
  ) {
    return this.commentService.addComment(user, post_id, body.text);
  }

  @ApiParam({ name: 'postId', description: ' post id' })
  @ApiOperation({ summary: 'edit comment' })
  @UseGuards(JwtGuard)
  @Put(':id')
  editComment(
    @GetUser() user: UserInterface,
    @Param('id') comment_id: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.editComment(user, comment_id, body.text);
  }

  @ApiParam({ name: 'id', description: ' comment id' })
  @ApiOperation({ summary: 'delete your comment or in your post' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteComment(
    @GetUser() user: UserInterface,
    @Param('id') comment_id: number,
  ) {
    return this.commentService.deleteComment(user, comment_id);
  }
}
