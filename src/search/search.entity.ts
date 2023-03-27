import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface PostSearchBody {
  id: number;
  name: string;
  text: string;
  user_id: number;
}

export interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export class SearchDto {
  @ApiProperty({ example: 'any string to search' })
  @IsNotEmpty()
  @IsString()
  text: string;
}
