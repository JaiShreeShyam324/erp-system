import { Test, TestingModule } from '@nestjs/testing';
import { BarcodeEntryService } from './barcode-entry.service';

describe('BarcodeEntryService', () => {
  let service: BarcodeEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarcodeEntryService],
    }).compile();

    service = module.get<BarcodeEntryService>(BarcodeEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
