import { ApplicationDto } from './../../../model/dto/ApplicationDto';

export interface OsInterface{

  onClose(application: ApplicationDto);

  onOpen(application: ApplicationDto);

  onChange(application: ApplicationDto);

  onOpens(applications: ApplicationDto[]);

  onChanges(applications: ApplicationDto[], diff:any);

  onCloses(applications: String[]);
}