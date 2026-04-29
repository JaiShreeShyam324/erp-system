import { Test, TestingModule } from '@nestjs/testing';
import { UidEntryService } from './uid-entry.service';

describe('UidEntryService', () => {
  let service: UidEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UidEntryService],
    }).compile();

    service = module.get<UidEntryService>(UidEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
