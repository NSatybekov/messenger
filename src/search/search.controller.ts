import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger'
import { SearchDto } from './search.entity';

@ApiBearerAuth()
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService){}

    @Post()
    searchInfo(@Body() body: SearchDto){
        return this.searchService.search(body.text)
    }

    @Post('reindex')
    reindexData(){
        return this.searchService.reindexData()
    }

    @Post('reindexComments')
    reindexComments(){
        return this.searchService.reindexComments()
    }
}
