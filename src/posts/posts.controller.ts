import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Sse, MessageEvent, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger'
import { PostCreateInterface, PostInterface, PostDto, UpdatePostDto, SearchPostDto } from './posts.entity';
import { PostsService } from './posts.service';
import { HandlerChatPost } from './chatpost.handler';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService,
                private readonly postHandler: HandlerChatPost
        ){}

    @UseGuards(JwtGuard)
    @Post()
    createPost(@GetUser() user: UserInterface, @Body() body: PostDto ) {
        const {name, text} = body
        return this.postsService.createPost(user, name, text)
      }

    @ApiOperation({summary: 'Get list of your posts'})
    @UseGuards(JwtGuard)
    @Get()
    getMyPosts(@GetUser() user: UserInterface){
          return this.postsService.getUserPosts(user.user_id)
      }
    
    @ApiParam({ name: 'id', description: 'post id' })
    @ApiOperation({summary: 'Edit post by its id'})
    @UseGuards(JwtGuard)
    @Put(':id')
    editPost(@GetUser() user: UserInterface,  @Param('id') post_id: number, @Body() body:UpdatePostDto){
        const {name, text} = body
        return this.postsService.editPostTry(user, post_id, name, text)
    }

    @ApiParam({ name: 'id', description: 'post id' })
    @ApiOperation({summary: 'Delete post by its id'})
    @UseGuards(JwtGuard)
    @Delete(':id')
    deletePost(@GetUser() user: UserInterface,  @Param('id') post_id: number){
        return this.postsService.deletePost(user, post_id)
    }

    @ApiParam({ name: 'id', description: 'user id' })
    @ApiOperation({summary: 'get users post by users id'})
    @UseGuards(JwtGuard)
    @Get('user/:id')
    getUsersPosts(@GetUser() user: UserInterface, @Param('id') friend_id: number) {
        return this.postsService.getAnotherUsersPosts(user, friend_id)
    }

    @ApiOperation({summary: 'get posts from all users that are your friends or you sent request to them'})
    @UseGuards(JwtGuard)
    @Get('feed')
    getFeedPosts(@GetUser() user: UserInterface) {
        return this.postsService.getFeedPosts(user)
    }

    @UseGuards(JwtGuard)
    @Post('search')
    searchByText(@GetUser() user: UserInterface, @Body() body: SearchPostDto){
         return this.postsService.findPostByText(user, body.text)
    }    

}   
