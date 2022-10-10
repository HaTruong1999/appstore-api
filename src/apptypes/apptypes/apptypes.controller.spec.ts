import { Test, TestingModule } from '@nestjs/testing';
import { ApptypesController } from './apptypes.controller';

describe('apptypes Controller', () => {
  let controller: ApptypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApptypesController],
    }).compile();

    controller = module.get<ApptypesController>(ApptypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
