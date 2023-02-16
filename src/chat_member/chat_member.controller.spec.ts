import { Test, TestingModule } from '@nestjs/testing';
import { ChatMemberController } from './chat_member.controller';

describe('ChatMemberController', () => {
  let controller: ChatMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMemberController],
    }).compile();

    controller = module.get<ChatMemberController>(ChatMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
