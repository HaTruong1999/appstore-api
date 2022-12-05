import { Test, TestingModule } from '@nestjs/testing';
import { WorkplacesService } from './workplaces.service';

describe('WorkplacesService', () => {
  let service: WorkplacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkplacesService],
    }).compile();

    service = module.get<WorkplacesService>(WorkplacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
