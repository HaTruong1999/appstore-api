import { Test, TestingModule } from '@nestjs/testing';
import { WorkplacesController } from './workplaces.controller';

describe('Workplacess Controller', () => {
  let controller: WorkplacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkplacesController],
    }).compile();

    controller = module.get<WorkplacesController>(WorkplacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
