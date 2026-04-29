import { Test, TestingModule } from '@nestjs/testing';
import { UidEntryController } from './uid-entry.controller';

describe('UidEntryController', () => {
  let controller: UidEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UidEntryController],
    }).compile();

    controller = module.get<UidEntryController>(UidEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
