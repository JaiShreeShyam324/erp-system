import { Test, TestingModule } from '@nestjs/testing';
import { BarcodeEntryController } from './barcode-entry.controller';

describe('BarcodeEntryController', () => {
  let controller: BarcodeEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarcodeEntryController],
    }).compile();

    controller = module.get<BarcodeEntryController>(BarcodeEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
