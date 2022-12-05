// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Workplaces } from "src/common/entities/Workplaces.entity";
import { WorkplacesDto } from "../dto/workplaces.dto";

export const toWorkplacesDto = (data: Workplaces): WorkplacesDto => {
    const {
        wpId,
        wpCode,
        wpName,
        wpParent,
        wpStatus,
        wpCreatedBy,
        wpCreatedDate,
        wpUpdatedBy,
        wpUpdatedDate,
    } = data;
  
    const Workplaces: WorkplacesDto = {
        wpId,
        wpCode,
        wpName,
        wpParent,
        wpStatus,
        wpCreatedBy,
        wpCreatedDate,
        wpUpdatedBy,
        wpUpdatedDate,
    };
    return Workplaces;
  };
  