import { ApiProperty } from '@nestjs/swagger';

export class AppsDto {

    appId: number;

    @ApiProperty()
    appCode: string | null;

    @ApiProperty()
    appName: string | null;

    @ApiProperty()
    appDescription: string | null;

    @ApiProperty()
    appFileAndroid: string | null;

    @ApiProperty()
    appLinkAndroid: string | null;

    @ApiProperty()
    appFileIOS: string | null;

    @ApiProperty()
    appLinkIOS: string | null;

    @ApiProperty()
    appVersion: string | null;

    @ApiProperty()
    appPackage: string | null;

    @ApiProperty()
    appLink: string | null;

    @ApiProperty()
    appSystem: string | null;

    @ApiProperty()
    appSubject: string | null;

    @ApiProperty()
    appWpId: string | null;

    @ApiProperty()
    appTypeId: number | null;

    @ApiProperty()
    appAvatar: string | null;

    @ApiProperty()
    appStatus: number;

    @ApiProperty()
    appWorkplaceId: number;

    @ApiProperty()
    appNumberDownloads: number;

    @ApiProperty()
    appHistoryId: string | null;

    @ApiProperty()
    appCreatedDate: Date | null;

    @ApiProperty()
    appCreatedBy: string | null;

    @ApiProperty()
    appUpdatedDate: Date | null;

    @ApiProperty()
    appUpdatedBy: string | null;

  }
