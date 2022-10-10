import { Test, TestingModule } from '@nestjs/testing';
import { ApptypesService } from './apptypes.service';

describe('apptypesService', () => {
  let service: ApptypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApptypesService],
    }).compile();

    service = module.get<ApptypesService>(ApptypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
